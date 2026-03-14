import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AppProvider, useApp } from "./context/AppContext"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import Startups from "./pages/Startups"
import StartupDetail from "./pages/StartupDetail"
import PitchAnalyzer from "./pages/PitchAnalyzer"
import Events from "./pages/Events"
import Founders from "./pages/Founders"
import Login from "./pages/Login"
function Layout({ children }) {
  const { sidebarOpen } = useApp()
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0a0e1a" }}>
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
function ProtectedRoute({ children }) {
  const { token } = useApp()
  return token ? children : <Navigate to="/login" />
}
function AppRoutes() {
  const { token } = useApp()
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/startups" element={<ProtectedRoute><Layout><Startups /></Layout></ProtectedRoute>} />
      <Route path="/startups/:id" element={<ProtectedRoute><Layout><StartupDetail /></Layout></ProtectedRoute>} />
      <Route path="/pitch-analyzer" element={<ProtectedRoute><Layout><PitchAnalyzer /></Layout></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><Layout><Events /></Layout></ProtectedRoute>} />
      <Route path="/founders" element={<ProtectedRoute><Layout><Founders /></Layout></ProtectedRoute>} />
    </Routes>
  )
}
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: "#141d35", color: "#e2e8f0", border: "1px solid rgba(79,110,247,0.3)" } }} />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
