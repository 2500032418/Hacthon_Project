# Architecture

```
React (Vite)  ──HTTP──▶  FastAPI  ──▶  Services layer
     │                      │                │
   pages/api.js        routers (/api/*)     ├── SearchService ─────┐
                                             ├── CertificationService
                                             ├── VerificationService
                                             └── RecommendationService
                                                      │
                       RAG Pipeline ◀─────────────────┘
                       ├─ DocumentProcessor (pdfplumber / pytesseract OCR / docx)
                       ├─ Chunking (paragraph+sentence, 900 chars, 120 overlap)
                       ├─ Embeddings (sentence-transformers MiniLM, normalized)
                       ├─ FAISS VectorStore (IndexFlatIP + metadata.json)
                       └─ LLMService (OpenAI-compatible: Groq/OpenAI/Ollama)

SQLAlchemy (SQLite): users, documents, standards, queries
```

## Request flow — chat question
1. Frontend `useChat` → `POST /api/chat/ask {question}`
2. `chat.py` router → `RAGPipeline.answer()`
3. Retriever embeds query → FAISS top-k cosine search
4. Chunks formatted as context → LLMService generates grounded answer
5. Answer + sources persisted in `queries` table → returned with citations

## Ingestion flow
- Upload: `/api/documents/upload` → save file → extract text (OCR fallback) → chunk → embed → FAISS (+ row in `documents`)
- Bulk: `POST /api/admin/reindex` walks `data/{standards,certification,circulars,guidelines,faq}`

## Design notes
- Vector store persists to `vector_db/embeddings/faiss.index` + `metadata.json`; thread-safe writes.
- Embedding model configurable via `EMBEDDING_MODEL` (default all-MiniLM-L6-v2, 384-d).
- LLM is OpenAI-compatible; without a key the app degrades to "relevant passages" mode.
- Auth: PBKDF2-SHA256 password hashing, JWT bearer tokens; first registered user becomes admin.
