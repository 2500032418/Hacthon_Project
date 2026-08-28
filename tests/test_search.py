import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database.connection import Base, engine


@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c


def test_standards_catalog_seeded(client):
    res = client.get("/api/standards")
    assert res.status_code == 200
    assert res.json()["count"] >= 10


def test_standard_filter_by_query(client):
    res = client.get("/api/standards", params={"q": "concrete"})
    codes = [r["code"] for r in res.json()["results"]]
    assert "IS 456" in codes


def test_get_single_standard(client):
    res = client.get("/api/standards/IS%201786")
    assert res.status_code == 200
    assert "Steel" in res.json()["title"]


def test_semantic_search_returns_results(client):
    res = client.post("/api/search", json={"query": "steel reinforcement bars", "top_k": 5})
    assert res.status_code == 200
    results = res.json()["results"]
    assert len(results) > 0
    assert all("score" in r for r in results)
