import { useCallback, useState } from "react"
import api from "../services/api"

export default function useChat() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const send = useCallback(async (question, topK = 5) => {
    if (!question.trim() || loading) return
    setError(null)
    setMessages((prev) => [...prev, { role: "user", text: question, sources: [] }])
    setLoading(true)
    try {
      const res = await api.post("/chat/ask", { question, top_k: topK })
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.answer, sources: res.data.sources || [] },
      ])
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }, [loading])

  const clear = useCallback(() => setMessages([]), [])

  return { messages, loading, error, send, clear }
}
