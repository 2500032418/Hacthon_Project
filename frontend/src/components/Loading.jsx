export default function Loading({ text = "Thinking..." }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b", padding: 10 }}>
      <div style={{ position: "relative", width: 20, height: 20 }}>
        <div style={{
          width: 20, height: 20, border: "3px solid #e2e8f0", borderTopColor: "#2563eb",
          borderRadius: "50%", animation: "spin .8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{text}</span>
    </div>
  )
}
