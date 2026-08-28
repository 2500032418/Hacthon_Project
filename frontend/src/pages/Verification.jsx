import { useState } from "react"
import api from "../services/api"
import Loading from "../components/Loading"

export default function Verification() {
  const [licenseNo, setLicenseNo] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function verify(e) {
    e.preventDefault(); setLoading(true); setError(null); setResult(null)
    try {
      const res = await api.post("/verification/license", { license_no: licenseNo })
      setResult(res.data)
    } catch (err) { setError(err.response?.data?.detail || "Verification failed") }
    finally { setLoading(false) }
  }

  const isValid = result?.valid_format

  return (
    <div className="content">
      <div style={{ marginBottom: 24 }}>
        <h1>Verify BIS Licence</h1>
        <p className="muted" style={{ marginTop: 4 }}>Check the authenticity of a BIS licence or registration number</p>
      </div>
      <div style={{
        background: "linear-gradient(135deg, #fff7ed, #fffbeb)", borderRadius: 20,
        padding: "28px 32px", border: "1px solid #fed7aa", marginBottom: 24,
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <span className="tag" style={{ fontSize: 12 }}>ISI: CM/L-8700123456</span>
          <span className="tag" style={{ fontSize: 12 }}>CRS: R-61001234</span>
          <span className="tag" style={{ fontSize: 12 }}>HUID: H9X2AB</span>
          <span className="tag" style={{ fontSize: 12 }}>FMCS: FML-1234567890</span>
        </div>
        <form onSubmit={verify} style={{ display: "flex", gap: 10 }}>
          <input value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} placeholder="Enter licence / registration number" style={{ flex: 1 }} />
          <button className="btn" style={{ borderRadius: 12 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Verify
          </button>
        </form>
      </div>
      {loading && <Loading text="Checking..." />}
      {error && <p className="error-text">{error}</p>}
      {result && (
        <div className="card" style={{
          animation: "fadeUp .3s ease",
          borderLeft: `5px solid ${isValid ? "#059669" : "#dc2626"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: isValid ? "#dcfce7" : "#fef2f2",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>{isValid ? "✅" : "❌"}</div>
            <div>
              <h3 style={{ color: isValid ? "#166534" : "#991b1b", fontSize: 18, fontWeight: 700 }}>{result.message}</h3>
              {result.scheme_type && <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>Scheme: <b style={{ color: "#334155" }}>{result.scheme_type}</b></p>}
            </div>
          </div>
          {result.status !== "unknown" && (
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Status check: </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{result.status}</span>
            </div>
          )}
          {result.next_steps?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <h3 style={{ fontSize: 14, color: "#64748b", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Next steps</h3>
              <ul className="plain">
                {result.next_steps.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          )}
          <p className="muted" style={{ marginTop: 14 }}>{result.disclaimer}</p>
          <a href={result.official_check} target="_blank" rel="noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, color: "#2563eb",
            fontWeight: 600, fontSize: 14,
          }}>Official verification portal <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>
        </div>
      )}
    </div>
  )
}
