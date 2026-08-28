from .retriever import Retriever
from ..llm.llm_service import get_llm_service

import re

GREETING_RE = re.compile(
    r"^\s*(hi+|hello+|hey+|namaste|good\s*(morning|afternoon|evening)|thanks?|thank\s*you|ok(ay)?|i\s*am\s+\w+|my\s*name\s*is\s+\w+|i'm\s+\w+)\s*[!.]*\s*$",
    re.IGNORECASE,
)

GREETING_REPLY = (
    "Hello! I'm your BIS assistant. Ask me things like:\n"
    "- Which IS standard applies to LED lamps?\n"
    "- How do I get CRS registration for power banks?\n"
    "- What are the testing requirements for certification?"
)


class RAGPipeline:
    def __init__(self):
        self.retriever = Retriever()
        self.llm = get_llm_service()

    def _catalog_fallback(self, question: str, db) -> list[dict]:
        try:
            from ..models.standard import Standard
            from ..utils.text import extract_keywords, term_matches

            keywords = extract_keywords(question)
            if not keywords:
                return []
            scored = []
            for std in db.query(Standard).all():
                code_l = (std.code or "").lower()
                title_l = f"{std.title} {std.category}".lower()
                desc_l = (std.description or "").lower()
                score = 0.0
                for kw in keywords:
                    if term_matches(kw, code_l):
                        score += 4
                    elif term_matches(kw, title_l):
                        score += 2
                    elif term_matches(kw, desc_l):
                        score += 1
                if score > 0:
                    scored.append((score, {
                        "source": "standards_catalog",
                        "title": f"{std.code} — {std.title}",
                        "chunk_index": None,
                        "score": float(score),
                        "snippet": std.description or "",
                        "text": f"{std.code}: {std.title}. Category: {std.category}. {std.description or ''}",
                    }))
            scored.sort(key=lambda x: x[0], reverse=True)
            return [h for _, h in scored[:4]]
        except Exception:
            return []

    def answer(self, question: str, top_k: int = 5, db=None) -> dict:
        if GREETING_RE.match(question):
            return {"answer": GREETING_REPLY, "sources": [], "used_context": False}
        hits = self.retriever.retrieve(question, top_k=top_k)
        from_catalog = False
        if not hits and db is not None:
            hits = self._catalog_fallback(question, db)
            from_catalog = bool(hits)
        if not hits:
            return {
                "answer": "I couldn't find anything relevant yet. Upload BIS standards or circulars (Documents page), or run Admin → Re-index, then ask again.",
                "sources": [],
                "used_context": False,
            }
        context = "\n\n---\n\n".join(
            f"[Source: {h.get('source', 'unknown')} | {h.get('title', '')}]\n{h['text']}" for h in hits
        )
        answer = self.llm.generate_with_context(question, context)
        sources = [
            {
                "source": h.get("source", "unknown"),
                "title": h.get("title", ""),
                "chunk_index": h.get("chunk_index"),
                "score": round(h.get("score", 0.0), 4),
                "snippet": h["text"][:300],
            }
            for h in hits
        ]
        return {"answer": answer, "sources": sources, "used_context": True}


def get_rag_pipeline() -> RAGPipeline:
    return RAGPipeline()
