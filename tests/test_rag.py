from app.rag.chunking import chunk_text
from app.utils.security import hash_password, verify_password, create_access_token, decode_token


def test_chunk_text_respects_size():
    text = ("Paragraph about BIS certification. " * 50) + "\n\n" + ("Another section. " * 40)
    chunks = chunk_text(text, chunk_size=500, overlap=50)
    assert len(chunks) >= 2
    for c in chunks:
        assert len(c.text) <= 700


def test_chunk_text_empty():
    assert chunk_text("") == []
    assert chunk_text("   \n  ") == []


def test_chunk_indices_ordered():
    chunks = chunk_text("A. " * 300 + "\n\nB. " * 200)
    assert [c.index for c in chunks] == list(range(len(chunks)))


def test_password_hash_roundtrip():
    stored = hash_password("s3cret!")
    assert stored != "s3cret!"
    assert verify_password("s3cret!", stored)
    assert not verify_password("wrong", stored)


def test_jwt_roundtrip():
    token = create_access_token({"sub": "42"})
    payload = decode_token(token)
    assert payload["sub"] == "42"
    assert decode_token(token + "x") is None
