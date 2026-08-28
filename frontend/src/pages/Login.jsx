import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ email: "", password: "", name: "", industry: "" })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  function update(k) { return (e) => setForm((f) => ({ ...f, [k]: e.target.value })) }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError(null)
    try {
      if (mode === "login") { await login(form.email, form.password) }
      else { await register({ email: form.email, password: form.password, name: form.name, industry: form.industry }) }
      navigate("/")
    } catch (err) { setError(err.response?.data?.detail || "Authentication failed") }
    finally { setBusy(false) }
  }

  const isRegister = mode === "register"

  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "calc(100vh - 60px)", margin: "-60px 0 0 0", padding: 24,
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #2563eb 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(139,92,246,.15)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", bottom: -150, left: -100, width: 500, height: 500, borderRadius: "50%", background: "rgba(59,130,246,.1)", filter: "blur(100px)" }} />
      <div style={{
        width: "100%", maxWidth: 440, background: "#fff", borderRadius: 24,
        boxShadow: "0 25px 80px rgba(0,0,0,.25)", overflow: "hidden",
        animation: "fadeUp .4s ease", position: "relative",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #2563eb, #7c3aed)", padding: "36px 36px 30px", textAlign: "center",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px",
            background: "rgba(255,255,255,.2)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -1,
            boxShadow: "0 4px 20px rgba(0,0,0,.15)",
          }}>BIS</div>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0 }}>BIS AI Assistant</h1>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, marginTop: 4 }}>{isRegister ? "Create your account" : "Sign in to continue"}</p>
        </div>
        <div style={{ padding: "32px 36px 36px" }}>
          {error && <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
            borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 500, marginBottom: 16,
          }}>{error}</div>}
          <form onSubmit={submit}>
            {isRegister && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Full Name</label>
                <input placeholder="Enter your full name" value={form.name} onChange={update("name")} style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Email Address</label>
              <input type="email" required placeholder="you@example.com" value={form.email} onChange={update("email")} style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Password</label>
              <input type="password" required minLength={4} placeholder="Min 4 characters" value={form.password} onChange={update("password")} style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
            </div>
            {isRegister && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Industry <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
                <input placeholder="e.g. Construction, Electronics, Water" value={form.industry} onChange={update("industry")} style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
              </div>
            )}
            <button type="submit" className="btn" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 16, marginTop: 8, borderRadius: 14 }}>
              {busy ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: 24, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
            {isRegister
              ? <span style={{ fontSize: 14, color: "#64748b" }}>Already have an account? <button onClick={() => { setMode("login"); setError(null) }} style={{ background: "none", border: "none", color: "#2563eb", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign in</button></span>
              : <span style={{ fontSize: 14, color: "#64748b" }}>New here? <button onClick={() => { setMode("register"); setError(null) }} style={{ background: "none", border: "none", color: "#2563eb", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Create an account</button></span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
