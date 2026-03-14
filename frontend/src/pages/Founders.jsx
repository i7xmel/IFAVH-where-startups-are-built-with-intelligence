import { useState, useEffect } from "react"
import { UserPlus, Linkedin, Twitter, Search, Briefcase } from "lucide-react"
import toast from "react-hot-toast"
const lookingColors = {"co-founder":"#4f6ef7","investor":"#34d399","developer":"#a78bfa","mentor":"#fbbf24","all":"#fb7185"}
export default function Founders() {
  const [founders, setFounders] = useState([])
  const [search, setSearch] = useState("")
  useEffect(()=>{ fetch("/api/founders").then(r=>r.json()).then(setFounders) },[])
  const connect = async (id) => {
    await fetch("/api/founders/connect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({requester_id:1,receiver_id:id})})
    toast.success("Connection request sent!")
  }
  const filtered = founders.filter(f=>!search||f.name?.toLowerCase().includes(search.toLowerCase())||f.expertise?.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-white">Founder <span className="gradient-text">Network</span></h1><p className="text-slate-400 text-sm">{founders.length} founders available</p></div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search founders..." className="pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none w-56" style={{background:"#141d35",border:"1px solid rgba(79,110,247,0.15)"}}/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(founder=>{
          const lookColor = lookingColors[founder.looking_for]||"#4f6ef7"
          return (
            <div key={founder.id} className="glass rounded-2xl p-5" style={{border:"1px solid rgba(79,110,247,0.1)"}}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0" style={{background:"linear-gradient(135deg,#4f6ef7,#a78bfa)"}}>{founder.name?.[0]||"?"}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white">{founder.name}</h3>
                  <p className="text-xs text-slate-400 capitalize">{founder.role}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block capitalize" style={{background:`${lookColor}22`,color:lookColor}}>Looking for: {founder.looking_for}</span>
                </div>
              </div>
              {founder.bio && <p className="text-sm text-slate-400 mb-3 line-clamp-2">{founder.bio}</p>}
              {founder.expertise && <div className="flex items-center gap-2 mb-3"><Briefcase size={12} className="text-slate-500 shrink-0"/><span className="text-xs text-slate-400 truncate">{founder.expertise}</span></div>}
              {founder.skills && <div className="flex flex-wrap gap-1 mb-4">{founder.skills.split(",").slice(0,4).map((s,i)=><span key={i} className="text-xs px-2 py-0.5 rounded-lg text-slate-300" style={{background:"rgba(79,110,247,0.1)",border:"1px solid rgba(79,110,247,0.15)"}}>{s.trim()}</span>)}</div>}
              <div className="flex gap-2 pt-3" style={{borderTop:"1px solid rgba(79,110,247,0.1)"}}>
                <button onClick={()=>connect(founder.id)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-white" style={{background:"linear-gradient(135deg,#4f6ef7,#a78bfa)"}}><UserPlus size={12}/> Connect</button>
                {founder.linkedin && <a href={founder.linkedin} target="_blank" className="p-2 rounded-xl text-slate-400 hover:text-blue-400 border border-white/10"><Linkedin size={14}/></a>}
                {founder.twitter && <a href={founder.twitter} target="_blank" className="p-2 rounded-xl text-slate-400 hover:text-sky-400 border border-white/10"><Twitter size={14}/></a>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
