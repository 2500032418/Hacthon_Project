from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..database.connection import get_db
from ..models.standard import Standard
from ..services.recommendation_service import get_recommendation_service
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/standards", tags=["standards"])


@router.get("")
def list_standards(q: str | None = Query(default=None), category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Standard)
    if q:
        like = f"%{q}%"
        query = query.filter(Standard.title.ilike(like) | Standard.code.ilike(like) | Standard.description.ilike(like))
    if category:
        query = query.filter(Standard.category.ilike(f"%{category}%"))
    return {"count": query.count(), "results": [s.to_dict() for s in query.order_by(Standard.code).limit(100).all()]}


@router.get("/categories")
def categories(db: Session = Depends(get_db)):
    rows = db.query(Standard.category).distinct().all()
    return {"categories": sorted({r[0] for r in rows if r[0]})}


class RecommendationRequest(BaseModel):
    industry: str = ""
    product: str = ""
    limit: int = Field(default=6, ge=1, le=20)


@router.post("/recommendations")
def recommend(body: RecommendationRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    service = get_recommendation_service()
    return {"results": service.recommend(db, user=user, industry=body.industry, product=body.product, limit=body.limit)}


@router.get("/{code}")
def get_standard(code: str, db: Session = Depends(get_db)):
    std = db.query(Standard).filter(Standard.code.ilike(code)).first()
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
    return std.to_dict()
