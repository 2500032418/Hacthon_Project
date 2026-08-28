import SourceCitation from "./SourceCitation"

export default function Message({ message }) {
  const isUser = message.role === "user"
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 14, animation: "fadeUp .3s ease" }}>
      {!isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: 12, flexShrink: 0, marginRight: 10, marginTop: 2,
          background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex",
          alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 700,
          boxShadow: "0 2px 8px rgba(37,99,235,.3)",
        }}>B</div>
      )}
      <div style={{ maxWidth: "78%" }}>
        <div
          style={{
            background: isUser
              ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
              : "#fff",
            color: isUser ? "#fff" : "#1e293b",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            padding: "14px 18px",
            boxShadow: isUser
              ? "0 2px 12px rgba(37,99,235,.25)"
              : "0 1px 4px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.03)",
            whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.65,
          }}
        >
          {message.text}
        </div>
        {!isUser && <SourceCitation sources={message.sources} />}
      </div>
      {isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: 12, flexShrink: 0, marginLeft: 10, marginTop: 2,
          background: "linear-gradient(135deg, #e2e8f0, #cbd5e1)", display: "flex",
          alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 15, fontWeight: 700,
        }}>U</div>
      )}
    </div>
  )
}
