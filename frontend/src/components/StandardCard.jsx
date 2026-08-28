export default function StandardCard({ standard, reason }) {
  return (
    <div className="card" style={{ animation: "fadeUp .3s ease" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <span className="tag">{standard.code}</span>
        {standard.category && <span className="tag" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", color: "#059669", border: "1px solid #a7f3d0" }}>{standard.category}</span>}
      </div>
      <h3 style={{ fontSize: 16, marginBottom: 6, lineHeight: 1.4 }}>{standard.title}</h3>
      <p className="muted" style={{ lineHeight: 1.6 }}>{standard.description || standard.text || ""}</p>
      {(reason || standard.reason) && (
        <div style={{
          marginTop: 12, background: "#eff6ff", borderRadius: 10, padding: "10px 14px",
          borderLeft: "3px solid #2563eb",
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: 0.5 }}>Why recommended</span>
          <p style={{ fontSize: 13, color: "#334155", marginTop: 4 }}>{reason || standard.reason}</p>
        </div>
      )}
      {standard.score != null && (
        <div className="muted" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 48, height: 6, borderRadius: 3, background: "#e2e8f0", overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, standard.score * 100)}%`, height: "100%", background: "linear-gradient(90deg, #2563eb, #7c3aed)", borderRadius: 3 }} />
          </div>
          Relevance: {(standard.score * 100).toFixed(0)}%
        </div>
      )}
    </div>
  )
}
