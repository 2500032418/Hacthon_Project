from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from ..rag.pipeline import get_rag_pipeline, RAGPipeline
from ..database.connection import get_db
from ..models.query import Query as QueryModel
from ..utils.security import get_current_user
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/chat", tags=["chat"])


class AskRequest(BaseModel):
    question: str = Field(min_length=2)
    top_k: int = Field(default=5, ge=1, le=15)


class AskResponse(BaseModel):
    answer: str
    sources: list[dict]
    used_context: bool


@router.post("/ask", response_model=AskResponse)
def ask(body: AskRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    pipeline: RAGPipeline = get_rag_pipeline()
    result = pipeline.answer(body.question, top_k=body.top_k, db=db)

    try:
        record = QueryModel(user_id=user.id if user else None, question=body.question, answer=result["answer"])
        db.add(record)
        db.commit()
    except Exception:
        pass

    return AskResponse(answer=result["answer"], sources=result["sources"], used_context=result.get("used_context", False))
