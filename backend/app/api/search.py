from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..database.connection import get_db
from ..services.search_service import get_search_service, SearchService

router = APIRouter(prefix="/api/search", tags=["search"])


class SearchRequest(BaseModel):
    query: str = Field(min_length=2)
    top_k: int = Field(default=8, ge=1, le=20)


@router.post("")
def search(body: SearchRequest, db: Session = Depends(get_db)):
    service: SearchService = get_search_service()
    return {"query": body.query, "results": service.semantic_search(body.query, top_k=body.top_k, db=db)}
