import { useState, useEffect } from "react"
import { Plus, Search, X, Rocket } from "lucide-react"
import StartupCard from "../components/StartupCard"
import toast from "react-hot-toast"
const INDUSTRIES = ["FinTech","HealthTech","EdTech","CleanTech","AI/ML","SaaS","E-commerce","Other"]
const STAGES = ["idea","pre-seed","seed","series-a","series-b","growth"]
function Modal({ onClose, onSave }) {
  const [form, setForm] = useState({name:"",tagline:"",description:"",industry:"FinTech",stage:"idea",funding_needed:"",team_size:"",location:"",founded_year:"",website:""})
  const [saving, setSaving] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const res = await fetch("/api/startups",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,user_id:1})})
      const data = await res.json()
      if(data.error){toast.error(data.error);return}
      toast.success("Startup created!"); onSave(data)
    } finally { setSaving(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)"}}>
      <div className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{background:"#0f1629",border:"1px solid rgba(79,110,247,0.2)"}}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add New Startup</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
        </div>
        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Startup Name" required className="col-span-2 px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <input value={form.tagline} onChange={e=>setForm({...form,tagline:e.target.value})} placeholder="Tagline" required className="col-span-2 px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" rows={3} className="col-span-2 px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <input value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="Website" className="px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Location" className="px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <input value={form.founded_year} onChange={e=>setForm({...form,founded_year:e.target.value})} placeholder="Founded Year" type="number" className="px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <input value={form.team_size} onChange={e=>setForm({...form,team_size:e.target.value})} placeholder="Team Size" type="number" className="px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <input value={form.funding_needed} onChange={e=>setForm({...form,funding_needed:e.target.value})} placeholder="Funding Needed ($)" type="number" className="px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <select value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})} className="px-3 py-2 rounded-xl text-sm text-white outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}</select>
          <select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})} className="px-3 py-2 rounded-xl text-sm text-white outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}>{STAGES.map(s=><option key={s}>{s}</option>)}</select>
          <div className="col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl text-sm text-slate-400 border border-white/10">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#4f6ef7,#a78bfa)"}}>
              {saving?"Saving...":"Create Startup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default function Startups() {
  const [startups, setStartups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState("")
  const [filterIndustry, setFilterIndustry] = useState("")
  const [filterStage, setFilterStage] = useState("")
  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if(search) params.set("search",search)
    if(filterIndustry) params.set("industry",filterIndustry)
    if(filterStage) params.set("stage",filterStage)
    const res = await fetch(`/api/startups?${params}`)
    setStartups(await res.json())
    setLoading(false)
  }
  useEffect(()=>{load()},[search,filterIndustry,filterStage])
  return (
    <div className="space-y-6">
      {showModal && <Modal onClose={()=>setShowModal(false)} onSave={(s)=>{setStartups(p=>[s,...p]);setShowModal(false)}}/>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Startups <span className="gradient-text">Registry</span></h1>
          <p className="text-slate-400 text-sm">{startups.length} startups in the ecosystem</p>
        </div>
        <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#4f6ef7,#a78bfa)"}}>
          <Plus size={16}/> Add Startup
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none w-56" style={{background:"#141d35",border:"1px solid rgba(79,110,247,0.15)"}}/>
        </div>
        <select value={filterIndustry} onChange={e=>setFilterIndustry(e.target.value)} className="px-3 py-2 rounded-xl text-sm text-white outline-none" style={{background:"#141d35",border:"1px solid rgba(79,110,247,0.15)"}}>
          <option value="">All Industries</option>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}
        </select>
        <select value={filterStage} onChange={e=>setFilterStage(e.target.value)} className="px-3 py-2 rounded-xl text-sm text-white outline-none" style={{background:"#141d35",border:"1px solid rgba(79,110,247,0.15)"}}>
          <option value="">All Stages</option>{STAGES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        {(search||filterIndustry||filterStage) && <button onClick={()=>{setSearch("");setFilterIndustry("");setFilterStage("")}} className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs text-red-400 border border-red-400/20"><X size={12}/> Clear</button>}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_,i)=><div key={i} className="h-52 rounded-2xl animate-pulse" style={{background:"#141d35"}}/>)}</div>
      ) : startups.length===0 ? (
        <div className="text-center py-20 text-slate-500"><Rocket size={48} className="mx-auto mb-4 opacity-30"/><p>No startups found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{startups.map(s=><StartupCard key={s.id} startup={s}/>)}</div>
      )}
    </div>
  )
}
