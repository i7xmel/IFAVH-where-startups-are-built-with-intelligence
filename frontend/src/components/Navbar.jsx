import { useApp } from "../context/AppContext"
import { LogOut, Bell, Search } from "lucide-react"
import toast from "react-hot-toast"
export default function Navbar() {
  const { user, logout } = useApp()
  const handleLogout = () => { logout(); toast.success("Logged out!") }
  return (
    <header className="h-16 flex items-center justify-between px-6 shrink-0"
      style={{ background: "rgba(15,22,41,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(79,110,247,0.1)" }}>
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input placeholder="Search startups, founders, events..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-slate-300 placeholder-slate-500 outline-none focus:ring-1"
            style={{ background: "rgba(26,37,64,0.8)", border: "1px solid rgba(79,110,247,0.15)" }} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-white/5">
          <Bell size={18} className="text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>
        <div className="flex items-center gap-3 pl-3" style={{ borderLeft: "1px solid rgba(79,110,247,0.15)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#4f6ef7,#a78bfa)" }}>
            {user?.name?.[0] || "U"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white leading-none">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role || "Member"}</p>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-400">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
