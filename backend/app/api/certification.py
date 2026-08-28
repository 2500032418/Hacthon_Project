from fastapi import APIRouter, Query

from ..services.certification_service import get_certification_service

router = APIRouter(prefix="/api/certification", tags=["certification"])


@router.get("/guidance")
def guidance(product: str = Query(default=""), industry: str = Query(default="")):
    return get_certification_service().guidance(product=product, industry=industry)
