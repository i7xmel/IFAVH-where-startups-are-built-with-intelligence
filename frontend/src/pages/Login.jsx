import { useState } from "react"
import { useApp } from "../context/AppContext"
import toast from "react-hot-toast"
import { Zap, Eye, EyeOff } from "lucide-react"
export default function Login() {
  const { login } = useApp()
  const [mode, setMode] = useState("login")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "founder" })
  const handle = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      login(data); toast.success(mode === "login" ? "Welcome back!" : "Account created!")
    } catch { toast.error("Connection error") } finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#0a0e1a" }}>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle,#4f6ef7,transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle,#a78bfa,transparent)" }} />
      <div className="relative w-full max-w-md p-8 rounded-3xl" style={{ background: "rgba(15,22,41,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(79,110,247,0.2)" }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4f6ef7,#a78bfa)" }}>
            <Zap size={24} className="text-white" />
          </div>
          <div><h1 className="text-2xl font-bold text-white">IFAV Platform</h1><p className="text-sm text-slate-400">Startup Ecosystem</p></div>
        </div>
        <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: "#141d35" }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${mode===m?"text-white":"text-slate-400 hover:text-white"}`}
              style={mode===m?{background:"linear-gradient(135deg,#4f6ef7,#7c6ef5)"}:{}}>
              {m}
            </button>
          ))}
        </div>
        <form onSubmit={handle} className="space-y-4">
          {mode==="register" && <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full Name" required className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}} />}
          <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email address" type="email" required className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}} />
          <div className="relative">
            <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" type={showPass?"text":"password"} required className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}} />
            <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">{showPass?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
          {mode==="register" && <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}>
            <option value="founder">Founder</option><option value="investor">Investor</option><option value="developer">Developer</option>
          </select>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50" style={{background:"linear-gradient(135deg,#4f6ef7,#a78bfa)"}}>
            {loading?"Please wait...":mode==="login"?"Sign In":"Create Account"}
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-4">Demo: <span className="text-blue-400 font-mono">admin@ifav.com</span> / <span className="text-blue-400 font-mono">password</span></p>
      </div>
    </div>
  )
}
