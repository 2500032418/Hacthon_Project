import { useState } from "react"
import api from "../services/api"
import StandardCard from "../components/StandardCard"
import Loading from "../components/Loading"

export default function PersonalizedStandards() {
  const [industry, setIndustry] = useState("")
  const [product, setProduct] = useState("")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function recommend(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await api.post("/standards/recommendations", { industry, product })
      setResults(res.data.results)
    } catch (err) { setError(err.response?.data?.detail || "Recommendation failed") }
    finally { setLoading(false) }
  }

  return (
    <div className="content">
      <div style={{ marginBottom: 24 }}>
        <h1>Standards For You</h1>
        <p className="muted" style={{ marginTop: 4 }}>Tell us your industry and product — we'll suggest the IS standards that matter to you</p>
      </div>
      <div style={{
        background: "linear-gradient(135deg, #fdf4ff, #faf5ff)", borderRadius: 20,
        padding: "28px 32px", border: "1px solid #e9d5ff", marginBottom: 24,
      }}>
        <form onSubmit={recommend} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry (construction, water, electronics, toys...)" style={{ flex: 1, minWidth: 200 }} />
          <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Product (e.g., TMT bars)" style={{ flex: 1, minWidth: 200 }} />
          <button className="btn" style={{ borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Recommend
          </button>
        </form>
      </div>
      {loading && <Loading />}
      {error && <p className="error-text">{error}</p>}
      {results && !loading && (
        <div className="grid" style={{ marginTop: 20 }}>
          {results.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>⭐</div>
              <p style={{ fontSize: 16, color: "#475569" }}>No matches found</p>
              <p className="muted" style={{ marginTop: 4 }}>Try broader terms like "construction" or "water"</p>
            </div>
          )}
          {results.map((r, i) => <StandardCard key={i} standard={r} reason={r.reason} />)}
        </div>
      )}
    </div>
  )
}
