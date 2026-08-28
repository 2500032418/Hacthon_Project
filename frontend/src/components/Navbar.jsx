import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header style={{
      background: "rgba(255,255,255,.85)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(0,0,0,.05)", padding: "14px 36px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
        <span style={{ color: "#2563eb", fontWeight: 700 }}>BIS</span> AI Assistant <span style={{ margin: "0 8px", color: "#cbd5e1" }}>/</span> <span style={{ color: "#94a3b8" }}>Indian Standards & Certification</span>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        {user ? (
          <>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#f1f5f9", borderRadius: 999, padding: "6px 18px 6px 8px",
              border: "1px solid #e2e8f0",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 13, fontWeight: 700,
                boxShadow: "0 2px 8px rgba(99,102,241,.3)",
              }}>{(user.name || user.email || "U").charAt(0).toUpperCase()}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{user.name || user.email}</span>
            </div>
            <button className="btn secondary" onClick={logout} style={{ padding: "8px 18px", fontSize: 13 }}>Logout</button>
          </>
        ) : (
          <Link to="/login"><button className="btn" style={{ padding: "10px 22px", fontSize: 14 }}>Login</button></Link>
        )}
      </div>
    </header>
  )
}
