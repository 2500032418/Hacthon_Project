import { Link, NavLink } from "react-router-dom"

const items = [
  { to: "/", label: "Home", icon: <HomeIcon /> },
  { to: "/chat", label: "AI Chat", icon: <ChatIcon /> },
  { to: "/search", label: "Semantic Search", icon: <SearchIcon /> },
  { to: "/certification", label: "Certification", icon: <CertIcon /> },
  { to: "/verification", label: "Verify Licence", icon: <VerifyIcon /> },
  { to: "/recommendations", label: "For You", icon: <StarIcon /> },
  { to: "/documents", label: "Documents", icon: <DocIcon /> },
  { to: "/admin", label: "Admin", icon: <AdminIcon /> },
]

function HomeIcon() { return <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/></svg> }
function ChatIcon() { return <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> }
function SearchIcon() { return <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> }
function CertIcon() { return <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16l7-3 7 3V4a2 2 0 00-2-2z"/></svg> }
function VerifyIcon() { return <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> }
function StarIcon() { return <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function DocIcon() { return <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> }
function AdminIcon() { return <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> }

const sideStyle = {
  width: 250,
  background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
  padding: "0",
  position: "sticky",
  top: 0,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  borderRight: "1px solid rgba(255,255,255,.06)",
  overflowY: "auto",
}

const logoBox = {
  width: 38, height: 38, borderRadius: 12,
  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: -0.5,
  boxShadow: "0 4px 12px rgba(99,102,241,.4)",
}

export default function Sidebar() {
  return (
    <aside style={sideStyle}>
      <Link to="/" style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "24px 20px 28px", borderBottom: "1px solid rgba(255,255,255,.08)",
      }}>
        <div style={logoBox}>BIS</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", lineHeight: 1.2 }}>BIS Assistant</div>
        </div>
      </Link>
      <nav style={{ padding: "14px 12px", flex: 1 }}>
        {items.map((it, idx) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === "/"}
            style={({ isActive }) => ({
              display: "flex", gap: 12, alignItems: "center",
              padding: "11px 16px", borderRadius: 12, marginBottom: 3,
              background: isActive ? "linear-gradient(135deg, rgba(59,130,246,.2), rgba(139,92,246,.15))" : "transparent",
              color: isActive ? "#fbbf24" : "rgba(255,255,255,.65)",
              fontSize: 14, fontWeight: isActive ? 600 : 400,
              transition: "all .2s cubic-bezier(.4,0,.2,1)",
              textDecoration: "none",
              animation: `slideRight .3s ease ${idx * 0.04}s both`,
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains("active")) {
                e.currentTarget.style.background = "rgba(255,255,255,.06)"
                e.currentTarget.style.color = "#fbbf24"
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains("active")) {
                e.currentTarget.style.background = ""
                e.currentTarget.style.color = "rgba(255,255,255,.65)"
              }
            }}
          >
            {it.icon} {it.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", textAlign: "center" }}>
          Bureau of Indian Standards
        </div>
      </div>
    </aside>
  )
}
