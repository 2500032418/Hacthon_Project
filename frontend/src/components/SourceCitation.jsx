export default function SourceCitation({ sources = [] }) {
  if (!sources.length) return null
  return (
    <div style={{ marginTop: 10 }}>
      <div className="muted" style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Sources</div>
      {sources.map((s, i) => (
        <details key={i} style={{
          background: "#f8fafc", borderRadius: 12, padding: "10px 14px", marginBottom: 6,
          border: "1px solid #e2e8f0", transition: "all .2s",
        }}>
          <summary style={{ cursor: "pointer", fontSize: 13, color: "#2563eb", fontWeight: 500, lineHeight: 1.4 }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 6, background: "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 700, marginRight: 8 }}>{i + 1}</span>
            {s.title || s.source} {s.score != null && <span style={{ color: "#94a3b8", fontWeight: 400, marginLeft: 6 }}>({(s.score * 100).toFixed(0)}%)</span>}
          </summary>
          <div style={{ fontSize: 13, marginTop: 8, whiteSpace: "pre-wrap", color: "#475569", lineHeight: 1.6 }}>{s.snippet}</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
            {s.source}{s.chunk_index != null ? ` · chunk #${s.chunk_index}` : ""}
          </div>
        </details>
      ))}
    </div>
  )
}
