import os
import re
import httpx


def strip_reasoning(text: str) -> str:
    if not text:
        return ""
    if "<think>" in text:
        if "</think>" in text:
            text = re.sub(r"<think>.*?</think>\s*", "", text, flags=re.DOTALL)
        else:
            text = text.split("<think>")[0]
    return text.strip()


class LLMService:
    THINKY_HINTS = ("qwq", "-r1", "r1-", "reason", "thinking")
    def __init__(self):
        self.api_base = os.getenv("LLM_API_BASE", "").rstrip("/")
        self.api_key = os.getenv("LLM_API_KEY", "")
        self.model = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
        self.last_error = None

    @property
    def configured(self) -> bool:
        return bool(self.api_base and self.api_key)

    def _resolve_model(self) -> str | None:
        try:
            response = httpx.get(
                f"{self.api_base}/models",
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=15,
            )
            response.raise_for_status()
            ids = [m.get("id", "") for m in response.json().get("data", []) if m.get("id")]
            non_thinky = [i for i in ids if not any(h in i.lower() for h in self.THINKY_HINTS)]
            candidates = non_thinky or ids
            for prefix in ("llama-3.3", "llama-3.1", "llama-4", "llama", "gemma", "qwen"):
                for model_id in candidates:
                    if model_id.startswith(prefix):
                        return model_id
            return candidates[0] if candidates else None
        except Exception as exc:
            print(f"[LLM] could not list models: {type(exc).__name__}: {exc}")
            return None

    def chat(self, system_prompt: str, user_prompt: str, temperature: float = 0.2, max_tokens: int = 2048) -> str | None:
        if not self.configured:
            return None
        for attempt in range(2):
            try:
                response = httpx.post(
                    f"{self.api_base}/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                    json={
                        "model": self.model,
                        "temperature": temperature,
                        "max_tokens": max_tokens,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                    },
                    timeout=60,
                )
                if response.status_code == 404 and attempt == 0:
                    alternative = self._resolve_model()
                    if alternative and alternative != self.model:
                        print(f"[LLM] model '{self.model}' not found; switching to '{alternative}'")
                        self.model = alternative
                        continue
                response.raise_for_status()
                data = response.json()
                cleaned = strip_reasoning(data["choices"][0]["message"]["content"])
                if not cleaned:
                    self.last_error = "model returned only internal reasoning (no final answer)"
                    print(f"[LLM] {self.last_error}")
                    if attempt == 0:
                        alternative = self._resolve_model()
                        if alternative and alternative != self.model:
                            print(f"[LLM] switching to '{alternative}' and retrying")
                            self.model = alternative
                            continue
                    return None
                return cleaned
            except Exception as exc:
                print(f"[LLM] request failed: {type(exc).__name__}: {exc}")
                self.last_error = f"{type(exc).__name__}: {exc}"
                return None
        return None

    def generate_with_context(self, question: str, context: str) -> str:
        if not context.strip():
            return (
                "I don't have enough indexed material to answer this yet. "
                "Upload BIS documents (Documents page) or run Admin → Re-index, then try again."
            )
        system_prompt = (
            "You are a helpful assistant for the Bureau of Indian Standards (BIS). "
            "Answer the user's question using ONLY the provided context about Indian Standards (IS codes), "
            "certification procedures and guidelines. Cite standard codes when relevant. "
            "If the answer is not in the context, say you don't have that information and suggest visiting bis.gov.in."
        )
        user_prompt = f"Context:\n{context}\n\nQuestion: {question}\n\nAnswer:"
        answer = self.chat(system_prompt, user_prompt)
        if answer is None:
            if not self.configured:
                prefix = "LLM API is not configured"
            else:
                prefix = f"LLM request failed ({getattr(self, 'last_error', 'unknown error')})"
            snippets = [line.strip() for line in context.split("\n") if line.strip()]
            summary = "\n".join(f"- {s}" for s in snippets[:6])
            return (
                f"{prefix}, here are the most relevant passages found:\n"
                f"{summary}\n\n(Check backend/.env and the server console for details.)"
            )
        return answer


def get_llm_service() -> LLMService:
    return LLMService()
