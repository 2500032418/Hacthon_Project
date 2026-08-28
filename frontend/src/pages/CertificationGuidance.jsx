import { useState } from "react"
import api from "../services/api"
import Loading from "../components/Loading"

export default function CertificationGuidance() {
  const [product, setProduct] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function getGuidance(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await api.get("/certification/guidance", { params: { product } })
      setData(res.data)
    } catch (err) { setError(err.response?.data?.detail || "Failed to load guidance") }
    finally { setLoading(false) }
  }

  return (
    <div className="content">
      <div style={{ marginBottom: 24 }}>
        <h1>Certification Guidance</h1>
        <p className="muted" style={{ marginTop: 4 }}>Get a step-by-step roadmap for BIS certification of your product</p>
      </div>
      <div style={{
        background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)", borderRadius: 20,
        padding: "28px 32px", border: "1px solid #bbf7d0", marginBottom: 24,
      }}>
        <form onSubmit={getGuidance} style={{ display: "flex", gap: 10 }}>
          <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Your product (e.g., LED lamp, cement, steel TMT bars)" style={{ flex: 1 }} />
          <button className="btn success" style={{ borderRadius: 12 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16l7-3 7 3V4a2 2 0 00-2-2z"/></svg>
            Get guidance
          </button>
        </form>
      </div>
      {loading && <Loading />}
      {error && <p className="error-text">{error}</p>}
      {data && (
        <div style={{ animation: "fadeUp .3s ease" }}>
          <div className="card" style={{ marginBottom: 20, borderLeft: "4px solid #059669" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <span className="tag">{data.scheme}</span>
              <span className="tag" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", color: "#059669", border: "1px solid #a7f3d0" }}>{data.authority}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 14, color: "#64748b", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Applies to</h3>
                <p style={{ fontSize: 15, color: "#334155" }}>{data.applies_to}</p>
              </div>
              <div>
                <h3 style={{ fontSize: 14, color: "#64748b", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Typical timeline</h3>
                <p style={{ fontSize: 15, color: "#334155" }}>{data.typical_timeline}</p>
              </div>
            </div>
          </div>
          <h2>Steps</h2>
          <div className="grid">
            {data.steps.map((s) => (
              <div className="card" key={s.step} style={{ borderLeft: "4px solid #2563eb" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 10, background: "#eff6ff", color: "#2563eb",
                  fontSize: 14, fontWeight: 700, marginBottom: 10,
                }}>S{s.step}</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>{s.title}</h3>
                <p className="muted" style={{ lineHeight: 1.6 }}>{s.detail}</p>
              </div>
            ))}
          </div>
          <div className="grid" style={{ marginTop: 20 }}>
            <div className="card-static" style={{ padding: "24px 28px" }}>
              <h2>Documents required</h2>
              <ul className="plain">
                {data.documents_required.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
            <div className="card-static" style={{ padding: "24px 28px" }}>
              <h2>Indicative fees</h2>
              <ul className="plain">
                {data.fees.map((f) => <li key={f.item}>{f.item}: <b style={{ color: "#2563eb" }}>{f.amount}</b></li>)}
              </ul>
            </div>
          </div>
          <p className="muted" style={{ marginTop: 16 }}>{data.disclaimer} Official portals: {data.official_portals.join(", ")}</p>
        </div>
      )}
    </div>
  )
}
