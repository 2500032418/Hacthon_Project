import os
import json
import uuid
import threading
import numpy as np

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DEFAULT_INDEX_DIR = os.path.join(ROOT_DIR, "vector_db", "embeddings")


class FAISSVectorStore:
    def __init__(self, index_dir: str | None = None, dimension: int = 384):
        self.index_dir = index_dir or DEFAULT_INDEX_DIR
        self.dimension = dimension
        self._index = None
        self._metadatas: list[dict] = []
        self._lock = threading.Lock()
        os.makedirs(self.index_dir, exist_ok=True)
        self.load()

    @property
    def index_path(self) -> str:
        return os.path.join(self.index_dir, "faiss.index")

    @property
    def meta_path(self) -> str:
        return os.path.join(self.index_dir, "metadata.json")

    def load(self):
        if os.path.exists(self.index_path) and os.path.exists(self.meta_path):
            import faiss

            self._index = faiss.read_index(self.index_path)
            with open(self.meta_path, "r", encoding="utf-8") as f:
                self._metadatas = json.load(f)
            if self._index.d != 0:
                self.dimension = self._index.d
        else:
            self._index = None

    def _ensure_index(self):
        import faiss

        if self._index is None:
            if os.path.exists(self.index_path):
                self.load()
            else:
                self._index = faiss.IndexFlatIP(self.dimension)

    def add(self, embeddings: list[list[float]], metadatas: list[dict]) -> list[str]:
        import faiss

        with self._lock:
            vectors = np.array(embeddings, dtype="float32")
            if vectors.ndim == 1:
                vectors = vectors.reshape(1, -1)
            self._ensure_index()
            if self._index.ntotal == 0 and vectors.shape[1] != self._index.d:
                self.dimension = vectors.shape[1]
                self._index = faiss.IndexFlatIP(self.dimension)
            if vectors.shape[1] != self._index.d:
                raise ValueError(f"Embedding dim {vectors.shape[1]} does not match index dim {self._index.d}")
            ids = [str(uuid.uuid4()) for _ in metadatas]
            for meta, _id in zip(metadatas, ids):
                meta["id"] = _id
            self._index.add(vectors)
            self._metadatas.extend(metadatas)
            faiss.write_index(self._index, self.index_path)
            with open(self.meta_path, "w", encoding="utf-8") as f:
                json.dump(self._metadatas, f)
            return ids

    def search(self, query_embedding: list[float], top_k: int = 5) -> list[dict]:
        with self._lock:
            self._ensure_index()
            if self._index.ntotal == 0:
                return []
            vector = np.array([query_embedding], dtype="float32")
            k = min(top_k, self._index.ntotal)
            scores, idxs = self._index.search(vector, k)
            results = []
            for score, idx in zip(scores[0], idxs[0]):
                if idx < 0 or idx >= len(self._metadatas):
                    continue
                meta = dict(self._metadatas[idx])
                meta["score"] = float(score)
                results.append(meta)
            return results

    def clear(self):
        import faiss

        with self._lock:
            self._index = faiss.IndexFlatIP(self.dimension)
            self._metadatas = []
            if os.path.exists(self.index_path):
                os.remove(self.index_path)
            if os.path.exists(self.meta_path):
                os.remove(self.meta_path)

    def count(self) -> int:
        self._ensure_index()
        return int(self._index.ntotal)


_store_instance: FAISSVectorStore | None = None


def get_vector_store() -> FAISSVectorStore:
    global _store_instance
    if _store_instance is None:
        _store_instance = FAISSVectorStore()
    return _store_instance
