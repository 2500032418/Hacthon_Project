import useChat from "../hooks/useChat"
import ChatBox from "../components/ChatBox"
import Message from "../components/Message"
import Loading from "../components/Loading"

export default function Chat() {
  const { messages, loading, error, send, clear } = useChat()

  return (
    <div className="content" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 61px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h1>AI Chat</h1>
          <p className="muted" style={{ marginTop: 2 }}>Ask anything about Indian Standards & BIS services</p>
        </div>
        {messages.length > 0 && <button className="btn secondary" onClick={clear} style={{ padding: "9px 20px" }}>Clear chat</button>}
      </div>
      <div style={{
        flex: 1, overflowY: "auto", marginBottom: 16, padding: "4px",
        background: "linear-gradient(180deg, #f8fafc, #f0f4f8)", borderRadius: 16,
        border: "1px solid rgba(0,0,0,.04)",
      }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
            <h2 style={{ color: "#475569", fontSize: 20 }}>What can I help you with?</h2>
            <p className="muted" style={{ maxWidth: 400, margin: "8px auto" }}>
              Try asking about IS codes, certification procedures, or BIS guidelines
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
              {["Which IS standard for LED lamps?", "How to get CRS registration?", "Testing requirements for certification?"].map((q) => (
                <button key={q} className="btn secondary" onClick={() => send(q)} style={{ fontSize: 13, padding: "8px 16px" }}>{q}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => <Message key={i} message={m} />)}
        {loading && <Loading text="Retrieving from standards & generating answer..." />}
      </div>
      {error && <p className="error-text">{error}</p>}
      <ChatBox onSend={send} loading={loading} />
    </div>
  )
}
