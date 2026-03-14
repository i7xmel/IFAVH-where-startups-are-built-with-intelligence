import { createContext, useContext, useState, useEffect } from "react"
const AppContext = createContext()
export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("ifav_token"))
  const [sidebarOpen, setSidebarOpen] = useState(true)
  useEffect(() => {
    if (token) {
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(u => { if (!u.error) setUser(u); else logout(); }).catch(logout)
    }
  }, [token])
  const login = (data) => { localStorage.setItem("ifav_token", data.token); setToken(data.token); setUser(data.user) }
  const logout = () => { localStorage.removeItem("ifav_token"); setToken(null); setUser(null) }
  return <AppContext.Provider value={{ user, token, login, logout, sidebarOpen, setSidebarOpen }}>{children}</AppContext.Provider>
}
export const useApp = () => useContext(AppContext)
