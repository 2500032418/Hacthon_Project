import { useEffect, useState } from "react"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import Loading from "../components/Loading"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [docs, setDocs] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  async function load() {
    try {
      setError(null)
      const [s, d] = await Promise.all([api.get("/admin/stats"), api.get("/documents")])
      setStats(s.data)
      setDocs(d.data.results)
    } catch (err) {
      setError(err.response?.status === 403 ? "Admin access required — login with the admin account." : "Failed to load (is the backend running?)")
    }
  }

  useEffect(() => { load() }, [])

  async function reindex() {
    setBusy(true); setMessage(null)
    try {
      const res = await api.post("/admin/reindex")
      setMessage(`Reindex complete: ${res.data.files_ingested} files, ${res.data.chunks_added} chunks added.`)
      load()
    } catch (err) { setMessage(err.response?.data?.detail || "Reindex failed") }
    finally { setBusy(false) }
  }

  async function resetIndex() {
    if (!window.confirm("This wipes the index, deletes uploaded copies and rebuilds from data/ only. Continue?")) return
    setBusy(true); setMessage(null)
    try {
      const res = await api.post("/admin/reset-index")
      setMessage(res.data.message)
      load()
    } catch (err) { setMessage(err.response?.data?.detail || "Reset failed") }
    finally { setBusy(false) }
  }

  const statColors = ["#2563eb", "#7c3aed", "#059669", "#ea580c"]

  return (
    <div className="content">
      <div style={{ marginBottom: 24 }}>
        <h1>Admin Dashboard</h1>
        <p className="muted" style={{ marginTop: 4 }}>Logged in as: {user ? user.name || user.email : "guest"} · role: {user?.role || "-"}</p>
      </div>
      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "16px 20px",
          color: "#991b1b", fontSize: 14, fontWeight: 500, marginBottom: 20,
        }}>{error}</div>
      )}
      {!stats && !error && <Loading text="Loading stats..." />}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[["Users", stats.users], ["Documents", stats.documents], ["Queries", stats.queries], ["Vector chunks", stats.vector_chunks]].map(([label, value], i) => (
            <div key={label} className="card" style={{ borderTop: `3px solid ${statColors[i]}` }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: statColors[i], letterSpacing: -1 }}>{value}</div>
              <div className="muted" style={{ fontWeight: 500, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn" onClick={reindex} disabled={busy} style={{ borderRadius: 12 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Re-index data/ folder
        </button>
        <button className="btn danger" onClick={resetIndex} disabled={busy} style={{ borderRadius: 12 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.64-8.36L1 10"/></svg>
          Reset & rebuild index
        </button>
        {busy && <Loading text="Indexing..." />}
        {message && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 16px", color: "#166534", fontSize: 13, fontWeight: 500 }}>
            {message}
          </div>
        )}
      </div>
      {docs && (
        <div className="card-static" style={{ overflow: "hidden" }}>
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #f1f5f9" }}>
            <h2 style={{ margin: 0 }}>Uploaded documents</h2>
          </div>
          <table>
            <thead>
              <tr><th>File</th><th>Type</th><th>Chunks</th><th>Uploaded</th></tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 500 }}>{d.filename}</td>
                  <td><span className="tag" style={{ fontSize: 12 }}>{d.source_type}</span></td>
                  <td style={{ textAlign: "center", fontWeight: 600 }}>{d.num_chunks}</td>
                  <td style={{ color: "#64748b" }}>{d.uploaded_at}</td>
                </tr>
              ))}
              {docs.length === 0 && <tr><td colSpan={4} className="muted" style={{ textAlign: "center", padding: 30 }}>No documents yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
