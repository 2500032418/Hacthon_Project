# SIH26107 — AI-powered Intelligent Assistant for Indian Standards & BIS Services

An AI assistant that helps manufacturers, MSMEs, students and inspectors navigate **BIS (Bureau of Indian Standards)** services: chat over standards (RAG), semantic search, certification roadmaps, licence verification, personalized standard recommendations and document Q&A.

## Features
| Feature | Endpoint / Page |
|---|---|
| RAG chat with citations | `/api/chat/ask` · `/chat` |
| Semantic search | `/api/search` · `/search` |
| Certification guidance (ISI/CRS) | `/api/certification/guidance` · `/certification` |
| Licence verification (CM/L, R-, HUID, FML) | `/api/verification/license` · `/verification` |
| Personalized recommendations | `/api/standards/recommendations` · `/recommendations` |
| Document upload + OCR + Q&A | `/api/documents/upload` · `/documents` |
| Admin stats & re-indexing | `/api/admin/*` · `/admin` |
| Auth (JWT) — first user = admin | `/api/auth/login\|register\|me` · `/login` |

## Tech stack
- **Backend:** FastAPI, SQLAlchemy (SQLite), FAISS, sentence-transformers, pdfplumber (+pytesseract OCR fallback), PyJWT, OpenAI-compatible LLM API (Groq/OpenAI/Ollama)
- **Frontend:** React 18 + Vite, react-router-dom, axios

## Quick start — backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env         # add your LLM_API_KEY
uvicorn app.main:app --reload  # http://localhost:8000/docs
```

## Quick start — frontend
```bash
cd frontend                    # create Vite app first if needed:
# npm create vite@latest frontend -- --template react   (then replace src with this src)
npm install react-router-dom axios
npm install
npm run dev                    # http://localhost:5173
```

## Add knowledge
- Drop BIS PDFs/TXT into `data/standards`, `data/circulars`, etc. → Admin → "Re-index data/ folder"
- Or upload directly from the Documents page.

> Note: scanned PDFs need [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) installed.
