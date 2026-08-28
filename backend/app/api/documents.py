import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from ..database.connection import get_db
from ..models.document import Document
from ..ocr.document_processor import get_document_processor
from ..rag.retriever import get_retriever

router = APIRouter(prefix="/api/documents", tags=["documents"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), "data", "uploaded_documents")


@router.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    ext = os.path.splitext(file.filename or "")[1].lower()
    processor = get_document_processor()
    if ext not in processor.SUPPORTED:
        raise HTTPException(status_code=400, detail=f"Unsupported type. Allowed: {', '.join(processor.SUPPORTED)}")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    safe_name = f"{uuid.uuid4().hex[:8]}_{os.path.basename(file.filename)}"
    dest = os.path.join(UPLOAD_DIR, safe_name)
    with open(dest, "wb") as out:
        out.write(await file.read())

    try:
        text = processor.extract_text(dest)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Extraction failed: {exc}")

    if not text.strip():
        raise HTTPException(status_code=422, detail="No extractable text found (scanned PDF? install Tesseract OCR).")

    retriever = get_retriever()
    num_chunks = retriever.ingest_text(text, {"source": safe_name, "title": file.filename, "doc_type": "upload"})

    record = Document(filename=safe_name, source_type="upload", num_chunks=num_chunks, status="indexed" if num_chunks else "empty")
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"document": record.to_dict(), "message": f"Ingested {num_chunks} chunks into vector store."}


@router.get("")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.uploaded_at.desc()).all()
    return {"count": len(docs), "results": [d.to_dict() for d in docs]}


@router.delete("/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    path = os.path.join(UPLOAD_DIR, doc.filename)
    if os.path.exists(path):
        os.remove(path)
    db.delete(doc)
    db.commit()
    return {"deleted": doc_id, "note": "Row removed; vectors remain until next reindex."}
