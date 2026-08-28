import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .database.connection import Base, engine, get_db, SessionLocal
from .models.user import User
from .utils.security import hash_password, verify_password, create_access_token, get_current_user
from .api import chat, search, standards, certification, verification, documents, admin

app = FastAPI(title="BIS AI Assistant", version="1.0.0", description="SIH26107 - AI-powered Intelligent Assistant for Indian Standards & BIS Services")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(search.router)
app.include_router(standards.router)
app.include_router(certification.router)
app.include_router(verification.router)
app.include_router(documents.router)
app.include_router(admin.router)

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])


class AuthRequest(BaseModel):
    email: str
    password: str
    name: str | None = None
    industry: str | None = None


@auth_router.post("/register")
def register(body: AuthRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    has_admin = db.query(User).filter(User.role == "admin").first() is not None
    user = User(email=body.email, name=body.name or body.email.split("@")[0], hashed_password=hash_password(body.password), role="admin", industry=body.industry)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"token": create_access_token({"sub": str(user.id)}), "user": user.to_dict()}


@auth_router.post("/login")
def login(body: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"token": create_access_token({"sub": str(user.id)}), "user": user.to_dict()}


@auth_router.get("/me")
def me(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user.to_dict()


@auth_router.post("/make-admin")
@auth_router.get("/make-admin")
def make_admin(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = "admin"
    db.commit()
    return {"message": f"{user.email} is now admin", "user": user.to_dict()}


app.include_router(auth_router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    from .database.seed import seed_standards
    db = SessionLocal()
    try:
        seed_standards(db)
        has_admin = db.query(User).filter(User.role == "admin").first()
        if not has_admin:
            first_user = db.query(User).first()
            if first_user:
                first_user.role = "admin"
                db.commit()
                print(f"[startup] auto-promoted {first_user.email} to admin")
    finally:
        db.close()
    try:
        from .api.admin import run_reindex
        from .rag.vector_store import get_vector_store
        if get_vector_store().count() == 0:
            result = run_reindex()
            print(f"[startup] auto-indexed {result['files_ingested']} files ({result['chunks_added']} chunks)")
    except Exception as exc:
        print(f"[startup] auto-index skipped: {exc}")


@app.get("/")
def root():
    return {"service": "BIS AI Assistant", "docs": "/docs"}
