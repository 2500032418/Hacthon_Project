import { createContext, useContext, useEffect, useState } from "react"
import api from "../services/api"

const AuthContext = createContext(null)

function decodeUser(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return { id: payload.sub }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("bis_token"))
  const [user, setUser] = useState(() => decodeUser(localStorage.getItem("bis_token") || ""))

  useEffect(() => {
    if (!token) return
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => logout())
  }, [])

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password })
    applyAuth(res.data)
  }

  async function register(data) {
    const res = await api.post("/auth/register", data)
    applyAuth(res.data)
  }

  function applyAuth({ token: t, user: u }) {
    localStorage.setItem("bis_token", t)
    setToken(t)
    setUser(u)
  }

  function logout() {
    localStorage.removeItem("bis_token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
