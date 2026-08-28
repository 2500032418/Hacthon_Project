import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database.connection import Base, engine
from app.services.verification_service import get_verification_service


@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c


def test_isi_license_valid_format():
    result = get_verification_service().verify_license("CM/L-8700123456")
    assert result["valid_format"] is True
    assert "ISI" in result["scheme_type"]


def test_crs_registration_valid_format():
    result = get_verification_service().verify_license("r-61001234")
    assert result["valid_format"] is True
    assert "CRS" in result["scheme_type"]


def test_invalid_format_rejected():
    result = get_verification_service().verify_license("XX-12345")
    assert result["valid_format"] is False


def test_placeholder_number_flagged_suspicious():
    result = get_verification_service().verify_license("CM/L-12345678")
    assert result["status"] == "suspicious"


def test_guidance_electronics_uses_crs(client):
    res = client.get("/api/certification/guidance", params={"product": "LED lamp"})
    assert res.json()["scheme"].startswith("CRS")


def test_guidance_cement_uses_isi(client):
    res = client.get("/api/certification/guidance", params={"product": "cement bags"})
    assert res.json()["scheme"].startswith("ISI")
