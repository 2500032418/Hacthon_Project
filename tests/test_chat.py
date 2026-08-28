import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database.connection import Base, engine


@pytest.fixture(scope="module")
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c


def test_register_first_user_becomes_admin(client):
    res = client.post("/api/auth/register", json={"email": "admin@test.com", "password": "secret1"})
    assert res.status_code == 200
    body = res.json()
    assert body["token"]
    assert body["user"]["role"] == "admin"


def test_second_user_is_regular(client):
    client.post("/api/auth/register", json={"email": "user@test.com", "password": "secret1"})
    token = client.post("/api/auth/login", json={"email": "user@test.com", "password": "secret1"}).json()["token"]
    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"}).json()
    assert me["role"] == "user"


def test_login_wrong_password_rejected(client):
    res = client.post("/api/auth/login", json={"email": "admin@test.com", "password": "wrong"})
    assert res.status_code == 401
