# Setup Guide

## 1. Prerequisites
- Python 3.10–3.12, Node.js 18+
- (Optional, for scanned PDFs) [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) on PATH
- LLM API key: free at console.groq.com (or OpenAI / local Ollama)

## 2. Backend
```bash
cd SIH26107-BIS-AI-ASSISTANT/backend
python -m venv venv
venv\Scripts\activate            # Windows  (Linux/macOS: source venv/bin/activate)
pip install -r requirements.txt
copy .env.example .env           # then edit .env → set LLM_API_KEY + SECRET_KEY
uvicorn app.main:app --reload
```
- Swagger UI: http://localhost:8000/docs
- First launch creates `data/bis_assistant.db` and seeds sample standards.

## 3. Frontend
If the folder has no package.json yet:
```bash
cd SIH26107-BIS-AI-ASSISTANT
npm create vite@latest frontend-tmp -- --template react
# copy frontend-tmp/package.json (+ vite.config.js, index.html) into frontend/, delete tmp
```
Then:
```bash
cd frontend
npm install react-router-dom axios
npm install
npm run dev                      # http://localhost:5173
```

## 4. Feed the knowledge base
1. Put BIS PDFs/TXT/MD into `data/standards`, `data/circulars`, `data/guidelines`, `data/certification`, `data/faq`
2. Login as admin → Admin Dashboard → **Re-index data/ folder**
3. Or upload per-file from **Documents** page.

## 5. Docker alternative
```bash
docker compose up --build
```

## Troubleshooting
| Problem | Fix |
|---|---|
| Chat says "LLM API not configured" | Set `LLM_API_BASE` + `LLM_API_KEY` in backend/.env |
| "No extractable text" on upload | Scanned PDF → install Tesseract OCR |
| faiss/sentence-transformers wheel error | Use Python 3.11; `pip install --upgrade pip` |
| CORS errors in browser | Backend `CORS_ORIGINS` env must include your frontend URL |
