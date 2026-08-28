import { useState } from "react"

export default function SearchBar({ onSearch, placeholder = "Search standards, circulars, guidelines..." }) {
  const [query, setQuery] = useState("")

  function submit(e) {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 10 }}>
      <div style={{
        flex: 1, display: "flex", alignItems: "center", background: "#fff", borderRadius: 14,
        border: "2px solid #e2e8f0", padding: "0 16px", gap: 10,
      }}>
        <svg width="18" height="18" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, border: "none", padding: "14px 0", background: "transparent", boxShadow: "none" }}
        />
      </div>
      <button className="btn" type="submit" style={{ borderRadius: 14, padding: "14px 28px" }}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        Search
      </button>
    </form>
  )
}
