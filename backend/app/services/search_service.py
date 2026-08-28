from ..rag.retriever import get_retriever
from ..models.standard import Standard
from sqlalchemy.orm import Session


class SearchService:
    def __init__(self):
        self.retriever = get_retriever()

    def semantic_search(self, query: str, top_k: int = 8, db: Session | None = None) -> list[dict]:
        results = []
        for hit in self.retriever.retrieve(query, top_k=top_k):
            results.append({
                "source": hit.get("source", "unknown"),
                "title": hit.get("title", ""),
                "code": hit.get("code", ""),
                "text": hit["text"][:500],
                "score": round(hit.get("score", 0.0), 4),
            })
        if db is not None:
            from ..utils.text import extract_keywords, term_matches

            seen_codes = {r["code"] for r in results if r["code"]}
            keywords = extract_keywords(query)
            for std in db.query(Standard).all():
                if std.code in seen_codes:
                    continue
                code_l = (std.code or "").lower()
                title_l = f"{std.title} {std.category}".lower()
                desc_l = (std.description or "").lower()
                raw = sum(
                    4 * term_matches(kw, code_l) + 2 * term_matches(kw, title_l) + 1 * term_matches(kw, desc_l)
                    for kw in keywords
                )
                if raw > 0:
                    results.append({
                        "source": "standards_catalog",
                        "title": std.title,
                        "code": std.code,
                        "text": std.description or "",
                        "score": round(raw / max(len(keywords) * 4, 1), 4),
                    })
        results.sort(key=lambda r: r["score"], reverse=True)
        return results[:top_k]


def get_search_service() -> SearchService:
    return SearchService()
