import { useState } from "react"
import api from "../services/api"
import SearchBar from "../components/SearchBar"
import StandardCard from "../components/StandardCard"
import Loading from "../components/Loading"

export default function SemanticSearch() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(query) {
    setLoading(true); setError(null)
    try {
      const res = await api.post("/search", { query, top_k: 8 })
      setResults(res.data.results)
    } catch (err) { setError(err.response?.data?.detail || "Search failed") }
    finally { setLoading(false) }
  }

  return (
    <div className="content">
      <div style={{ marginBottom: 24 }}>
        <h1>Semantic Search</h1>
        <p className="muted" style={{ marginTop: 4 }}>Search by meaning across indexed standards & documents</p>
      </div>
      <div style={{
        background: "linear-gradient(135deg, #f8fafc, #eef2ff)", borderRadius: 20,
        padding: "28px 32px", border: "1px solid #e2e8f0", marginBottom: 24,
      }}>
        <SearchBar onSearch={search} />
      </div>
      {loading && <Loading text="Searching across standards..." />}
      {error && <p className="error-text">{error}</p>}
      {results && !loading && (
        <div className="grid" style={{ marginTop: 20 }}>
          {results.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
              <p style={{ fontSize: 16, color: "#475569" }}>No results found</p>
              <p className="muted" style={{ marginTop: 4 }}>Try different words or upload more documents</p>
            </div>
          )}
          {results.map((r, i) => <StandardCard key={i} standard={r} />)}
        </div>
      )}
    </div>
  )
}
