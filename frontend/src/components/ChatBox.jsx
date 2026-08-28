import { useState } from "react"
import Loading from "./Loading"

export default function ChatBox({ onSend, disabled, loading }) {
  const [text, setText] = useState("")

  function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text)
    setText("")
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
      <div style={{
        flex: 1, background: "#fff", borderRadius: 14, border: "2px solid #e2e8f0",
        padding: "4px", display: "flex", alignItems: "flex-end",
        transition: "border-color .2s, box-shadow .2s",
      }}>
        <textarea
          rows={1}
          placeholder="Ask about IS codes, certification, BIS services..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(e) }}
          style={{ flex: 1, border: "none", borderRadius: 12, padding: "12px 14px", resize: "none", minHeight: 44, maxHeight: 120, background: "transparent", boxShadow: "none" }}
        />
      </div>
      <button className="btn" type="submit" disabled={disabled || loading} style={{ height: 48, width: 48, padding: 0, borderRadius: 14, justifyContent: "center", flexShrink: 0 }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
      {loading && <Loading />}
    </form>
  )
}
