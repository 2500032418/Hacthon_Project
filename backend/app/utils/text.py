import re

STOPWORDS = {
    "the", "and", "for", "are", "was", "has", "its", "which", "what", "when",
    "standard", "standards", "applies", "apply", "indian", "about", "there",
    "with", "this", "that", "have", "does", "need", "tell", "give", "list",
    "code", "codes", "bis", "product", "products", "used", "under", "how",
}


def extract_keywords(text: str) -> list[str]:
    tokens = re.findall(r"[a-z0-9]+", (text or "").lower())
    return [t for t in tokens if len(t) >= 3 and t not in STOPWORDS]


def term_matches(term: str, haystack: str) -> bool:
    if term in haystack:
        return True
    if term.endswith("s") and len(term) > 3 and term[:-1] in haystack:
        return True
    return False
