import { useState } from "react"
import UploadDocument from "../components/UploadDocument"
import ChatBox from "../components/ChatBox"
import Message from "../components/Message"
import Loading from "../components/Loading"
import useChat from "../hooks/useChat"

export default function DocumentQA() {
  const chat = useChat()
  const [lastDoc, setLastDoc] = useState(null)

  return (
    <div className="content">
      <h1>Document Q&A</h1>
      <p className="muted" style={{ margin: "6px 0 20px" }}>Upload a BIS standard or circular, then ask questions about it.</p>
      <div style={{ display: "grid", gridTemplateColumns: lastDoc ? "1fr" : "1fr", gap: 20 }}>
        <UploadDocument onUploaded={setLastDoc} />
        {lastDoc && (
          <div style={{
            background: "linear-gradient(135deg, #ecfdf5, #f0fdf4)", border: "1px solid #bbf7d0",
            borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✅</div>
            <div>
              <div style={{ fontWeight: 600, color: "#166534", fontSize: 14 }}>Indexed "{lastDoc.filename}"</div>
              <div style={{ fontSize: 13, color: "#15803d" }}>{lastDoc.num_chunks} chunks ready for Q&A</div>
            </div>
          </div>
        )}
      </div>
      <div className="card-static" style={{ marginTop: 20 }}>
        <div style={{
          maxHeight: 380, overflowY: "auto", padding: "8px",
          borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9",
        }}>
          {chat.messages.length === 0 && !chat.loading && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📄</div>
              <p style={{ fontSize: 15, color: "#475569" }}>Ask things like "Summarise this document" or "What are the testing requirements?"</p>
            </div>
          )}
          {chat.messages.map((m, i) => <Message key={i} message={m} />)}
          {chat.loading && <Loading text="Reading your document..." />}
        </div>
        {chat.error && <p className="error-text">{chat.error}</p>}
        <div style={{ marginTop: 12 }}>
          <ChatBox onSend={chat.send} loading={chat.loading} />
        </div>
      </div>
    </div>
  )
}
