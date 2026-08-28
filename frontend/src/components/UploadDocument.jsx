import { useRef, useState } from "react"
import api from "../services/api"
import Loading from "./Loading"

export default function UploadDocument({ onUploaded }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  async function upload(file) {
    if (!file) return
    setBusy(true); setError(null); setStatus(null)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await api.post("/documents/upload", form)
      setStatus(res.data.message)
      onUploaded?.(res.data.document)
    } catch (err) { setError(err.response?.data?.detail || "Upload failed") }
    finally { setBusy(false) }
  }

  return (
    <div className="card-static">
      <div style={{
        border: "2px dashed #cbd5e1", borderRadius: 16, padding: "32px 28px",
        textAlign: "center", cursor: "pointer", transition: "all .2s",
        background: busy ? "#f8fafc" : "#fff",
      }} onClick={() => !busy && inputRef.current?.click()}>
        <input
          ref={inputRef} type="file" accept=".pdf,.txt,.md,.docx"
          style={{ display: "none" }}
          onChange={(e) => upload(e.target.files?.[0])}
        />
        {busy ? (
          <Loading text="Extracting & indexing..." />
        ) : (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: "#eff6ff",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px", fontSize: 24,
            }}>📄</div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Click to upload or drag & drop</h3>
            <p className="muted">PDF, TXT, MD or DOCX — OCR supported for scanned PDFs</p>
            <button className="btn secondary" style={{ marginTop: 14, borderRadius: 12 }} onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>
              Choose file
            </button>
          </>
        )}
      </div>
      {status && (
        <div style={{
          marginTop: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12,
          padding: "12px 16px", color: "#166534", fontSize: 14, fontWeight: 500,
        }}>{status}</div>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}
