from fastapi import APIRouter
from pydantic import BaseModel, Field

from ..services.verification_service import get_verification_service

router = APIRouter(prefix="/api/verification", tags=["verification"])


class LicenseRequest(BaseModel):
    license_no: str = Field(min_length=2, max_length=50)


@router.post("/license")
def verify_license(body: LicenseRequest):
    return get_verification_service().verify_license(body.license_no)
