import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database.connection import get_db
from ..models.user import User
from ..models.document import Document
from ..models.query import Query as QueryModel
from ..rag.retriever import get_retriever
from ..rag.vector_store import get_vector_store
from ..ocr.document_processor import get_document_processor
from ..utils.security import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DATA_DIRS = ["standards", "certification", "circulars", "guidelines", "faq"]


@router.get("/stats")
def stats(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    return {
        "users": db.query(User).count(),
        "documents": db.query(Document).count(),
        "queries": db.query(QueryModel).count(),
        "vector_chunks": get_retriever().stats(),
    }


def run_reindex() -> dict:
    retriever = get_retriever()
    processor = get_document_processor()
    ingested_files = 0
    total_chunks = 0
    skipped = []
    for folder in DATA_DIRS:
        dir_path = os.path.join(ROOT_DIR, "data", folder)
        if not os.path.isdir(dir_path):
            continue
        for name in os.listdir(dir_path):
            path = os.path.join(dir_path, name)
            if not os.path.isfile(path) or os.path.splitext(name)[1].lower() not in processor.SUPPORTED:
                continue
            try:
                text = processor.extract_text(path)
            except Exception as exc:
                skipped.append({"file": name, "reason": str(exc)})
                continue
            if not text.strip():
                skipped.append({"file": name, "reason": "no text"})
                continue
            chunks = retriever.ingest_text(text, {"source": name, "title": os.path.splitext(name)[0], "doc_type": folder})
            ingested_files += 1
            total_chunks += chunks
    return {"files_ingested": ingested_files, "chunks_added": total_chunks, "skipped": skipped}


@router.post("/reindex")
def reindex(_admin: User = Depends(require_admin)):
    return run_reindex()


@router.post("/reset-index")
def reset_index(_admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    from ..api.documents import UPLOAD_DIR

    get_vector_store().clear()

    deleted_files = 0
    if os.path.isdir(UPLOAD_DIR):
        for name in os.listdir(UPLOAD_DIR):
            path = os.path.join(UPLOAD_DIR, name)
            if os.path.isfile(path):
                try:
                    os.remove(path)
                    deleted_files += 1
                except Exception:
                    pass

    removed_rows = db.query(Document).delete()
    db.commit()

    result = run_reindex()
    return {
        "removed_upload_files": deleted_files,
        "removed_document_rows": removed_rows,
        **result,
        "message": f"Index wiped and rebuilt: {result['files_ingested']} files, {result['chunks_added']} chunks (duplicates removed).",
    }
