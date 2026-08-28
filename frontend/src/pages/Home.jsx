import { Link } from "react-router-dom"

const features = [
  { to: "/chat", icon: "🤖", title: "AI Chat (RAG)", desc: "Ask anything about Indian Standards, BIS services & procedures with cited sources.", color: "#2563eb" },
  { to: "/search", icon: "🔍", title: "Semantic Search", desc: "Find relevant IS codes by meaning, not just keywords.", color: "#7c3aed" },
  { to: "/certification", icon: "📋", title: "Certification Guidance", desc: "Step-by-step ISI/CRS licensing process, documents & fees.", color: "#059669" },
  { to: "/verification", icon: "✅", title: "Verify Licence", desc: "Check CM/L, R-number and HUID formats before trusting a mark.", color: "#ea580c" },
  { to: "/recommendations", icon: "⭐", title: "Personalized Standards", desc: "Get IS standards recommended for your industry & product.", color: "#d946ef" },
  { to: "/documents", icon: "📄", title: "Document Q&A", desc: "Upload any BIS PDF/circular and ask questions about it.", color: "#0891b2" },
]

export default function Home() {
  return (
    <div className="content">
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #2563eb 100%)",
        borderRadius: 24, padding: "48px 44px", color: "#fff", marginBottom: 36,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(139,92,246,.2)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: -80, left: "40%", width: 300, height: 300, borderRadius: "50%", background: "rgba(59,130,246,.15)", filter: "blur(80px)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 12, letterSpacing: -1, color: "#fbbf24" }}>
            AI-powered Assistant for<br/>Indian Standards & BIS Services
          </h1>
          <p style={{ opacity: .85, maxWidth: 560, fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
            One assistant for IS codes, certification steps, licence verification and document Q&A — built for manufacturers, MSMEs, students and inspectors.
          </p>
          <Link to="/chat">
            <button className="btn" style={{ background: "#fff", color: "#1e3a5f", fontWeight: 700, padding: "14px 32px", fontSize: 16, borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}>
              Start chatting →
            </button>
          </Link>
        </div>
      </div>

      <h2 style={{ marginBottom: 20 }}>What can it do?</h2>
      <div className="grid">
        {features.map((f, i) => (
          <Link key={f.to} to={f.to}>
            <div className="card" style={{
              height: "100%", borderLeft: `4px solid ${f.color}`,
              animation: `fadeUp .3s ease ${i * 0.06}s both`,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 14,
                background: `${f.color}12`, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
              <p className="muted" style={{ lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
