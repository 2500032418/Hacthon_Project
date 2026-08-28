from sqlalchemy.orm import Session

from ..models.standard import Standard
from ..models.user import User
from ..rag.embeddings import get_embedding_service


class RecommendationService:
    INDUSTRY_KEYWORDS = {
        "construction": ["concrete", "cement", "steel", "structural", "building", "reinforcement"],
        "water": ["water", "drinking", "potable", "wastewater", "pipe"],
        "plastics": ["pipe", "pvc", "polyethylene", "plastic"],
        "electronics": ["led", "lamp", "appliance", "electronic", "electrical"],
        "toys": ["toy", "children", "safety"],
        "metallurgy": ["steel", "metal", "bar", "wire"],
    }

    def recommend(self, db: Session, user: User | None = None, industry: str = "", product: str = "", limit: int = 6) -> list[dict]:
        from ..utils.text import extract_keywords, term_matches

        text = f"{industry} {product}".strip()
        if not text and user is not None:
            text = (user.industry or "")

        keywords: list[str] = []
        for key, kws in self.INDUSTRY_KEYWORDS.items():
            if key in text.lower():
                keywords.extend(kws)
        keywords.extend(extract_keywords(text))
        keywords = list(dict.fromkeys(keywords))

        standards = db.query(Standard).all()
        if not keywords:
            return [s.to_dict() | {"reason": "Popular standard"} for s in standards[:limit]]

        scored = []
        query_vec = None
        try:
            if text.strip():
                query_vec = get_embedding_service().embed_query(text)
        except Exception:
            query_vec = None

        for s in standards:
            code_l = (s.code or "").lower()
            title_l = f"{s.title} {s.category}".lower()
            desc_l = (s.description or "").lower()
            kw_score = sum(
                4 * term_matches(kw, code_l) + 2 * term_matches(kw, title_l) + 1 * term_matches(kw, desc_l)
                for kw in keywords
            )
            sem_score = 0.0
            if query_vec is not None:
                try:
                    vec = get_embedding_service().embed_query(f"{s.title} {s.category}")
                    sem_score = sum(a * b for a, b in zip(query_vec, vec))
                except Exception:
                    sem_score = 0.0
            total = kw_score * 2 + max(sem_score, 0)
            if total > 0:
                reason_bits = []
                if kw_score:
                    reason_bits.append("matches your industry/product keywords")
                if sem_score > 0.3:
                    reason_bits.append("semantically similar to your description")
                scored.append((total, s.to_dict() | {"reason": "; ".join(reason_bits).capitalize()}))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [item for _, item in scored[:limit]]


def get_recommendation_service() -> RecommendationService:
    return RecommendationService()
