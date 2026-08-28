# API Reference (base: http://localhost:8000/api)

## Auth
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | /auth/register | {email, password, name?, industry?} | First user = admin |
| POST | /auth/login | {email, password} | Returns JWT |
| GET | /auth/me | – | Requires Bearer token |

## Chat
- `POST /chat/ask` — `{question, top_k=5}` → `{answer, sources[], used_context}`

## Search
- `POST /search` — `{query, top_k=8}` → ranked `{source,title,code,text,score}[]`

## Standards
- `GET /standards?q=&category=` — list/filter catalog
- `GET /standards/categories`
- `GET /standards/{code}`
- `POST /standards/recommendations` — `{industry, product, limit}` → matches + reasons

## Certification
- `GET /certification/guidance?product=led%20lamp&industry=` → scheme, steps[], documents[], fees[], timeline

## Verification
- `POST /verification/license` — `{license_no}` → format validity, scheme type, next steps

## Documents
- `POST /documents/upload` — multipart `file` (.pdf/.txt/.md/.docx) → chunks indexed
- `GET /documents` · `DELETE /documents/{id}`

## Admin (JWT, role=admin)
- `GET /admin/stats` → users/documents/queries/vector_chunks
- `POST /admin/reindex` → ingests everything under `data/`

Interactive docs: `/docs` (Swagger UI).
