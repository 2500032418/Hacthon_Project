import re
from dataclasses import dataclass


@dataclass
class Chunk:
    text: str
    index: int


def _split_sentences(text: str) -> list[str]:
    return re.split(r"(?<=[.!?])\s+|\n+", text)


def chunk_text(text: str, chunk_size: int = 900, overlap: int = 120) -> list[Chunk]:
    text = re.sub(r"\r\n", "\n", text).strip()
    if not text:
        return []
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    current = ""

    def flush():
        nonlocal current
        if current.strip():
            chunks.append(current.strip())
        current = ""

    for para in paragraphs:
        if len(para) > chunk_size:
            flush()
            sentences = _split_sentences(para)
            buf = ""
            for sent in sentences:
                if len(buf) + len(sent) + 1 > chunk_size:
                    if buf:
                        chunks.append(buf.strip())
                    tail = buf[-overlap:] if overlap and len(buf) > overlap else ""
                    buf = (tail + " " if tail else "") + sent
                else:
                    buf += (" " if buf else "") + sent
            flush_current = buf.strip()
            if flush_current:
                chunks.append(flush_current)
            continue
        if len(current) + len(para) + 2 > chunk_size:
            flush()
            tail = current[-overlap:] if overlap and len(current) > overlap else ""
            if tail:
                current = tail + "\n\n"
        current += para + "\n\n"
    flush()

    return [Chunk(text=c, index=i) for i, c in enumerate(chunks)]


def merge_chunks_with_meta(chunks: list[Chunk], base_meta: dict) -> list[dict]:
    return [{**base_meta, "chunk_index": c.index, "text": c.text} for c in chunks]
