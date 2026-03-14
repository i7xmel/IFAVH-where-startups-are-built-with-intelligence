import { Link, useLocation } from "react-router-dom"
import { useApp } from "../context/AppContext"
import { LayoutDashboard, Rocket, Brain, Calendar, Users, ChevronLeft, ChevronRight, Zap } from "lucide-react"
const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/startups", icon: Rocket, label: "Startups" },
  { path: "/pitch-analyzer", icon: Brain, label: "AI Pitch Analyzer" },
  { path: "/events", icon: Calendar, label: "Events" },
  { path: "/founders", icon: Users, label: "Founders" },
]
export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp()
  const location = useLocation()
  return (
    <aside className={`fixed left-0 top-0 h-full transition-all duration-300 z-40 ${sidebarOpen ? "w-64" : "w-20"}`}
      style={{ background: "linear-gradient(180deg,#0f1629 0%,#141d35 100%)", borderRight: "1px solid rgba(79,110,247,0.1)" }}>
      <div className="flex items-center justify-between p-4 mb-6" style={{ borderBottom: "1px solid rgba(79,110,247,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-glow"
            style={{ background: "linear-gradient(135deg,#4f6ef7,#a78bfa)" }}>
            <Zap size={18} className="text-white" />
          </div>
          {sidebarOpen && <div><p className="font-bold text-white text-sm">IFAV</p><p className="text-xs" style={{ color: "#4f6ef7" }}>Platform</p></div>}
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      <nav className="px-3 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path || (path !== "/" && location.pathname.startsWith(path))
          return (
            <Link key={path} to={path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${active ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
              style={active ? { background: "linear-gradient(135deg,rgba(79,110,247,0.2),rgba(167,139,250,0.1))", border: "1px solid rgba(79,110,247,0.3)" } : {}}>
              <Icon size={18} className={active ? "text-blue-400" : "group-hover:text-blue-400 transition-colors"} />
              {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
              {active && sidebarOpen && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </Link>
          )
        })}
      </nav>
      {sidebarOpen && (
        <div className="absolute bottom-6 left-4 right-4">
          <div className="rounded-xl p-3" style={{ background: "linear-gradient(135deg,rgba(79,110,247,0.15),rgba(167,139,250,0.08))", border: "1px solid rgba(79,110,247,0.2)" }}>
            <p className="text-xs font-semibold text-white mb-1">🚀 MVP v1.0</p>
            <p className="text-xs text-slate-400">Powered by Gemini AI</p>
          </div>
        </div>
      )}
    </aside>
  )
}
