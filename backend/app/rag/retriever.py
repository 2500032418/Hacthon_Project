from .chunking import chunk_text, merge_chunks_with_meta
from .embeddings import get_embedding_service
from .vector_store import get_vector_store


class Retriever:
    def ingest_text(self, text: str, metadata: dict) -> int:
        chunks = chunk_text(text)
        if not chunks:
            return 0
        metadatas = merge_chunks_with_meta(chunks, dict(metadata))
        embeddings = get_embedding_service().embed_texts([c.text for c in chunks])
        get_vector_store().add(embeddings, metadatas)
        return len(chunks)

    def retrieve(self, query: str, top_k: int = 5) -> list[dict]:
        if get_vector_store().count() == 0:
            return []
        embedding = get_embedding_service().embed_query(query)
        return get_vector_store().search(embedding, top_k)

    def stats(self) -> int:
        return get_vector_store().count()


def get_retriever() -> Retriever:
    return Retriever()
