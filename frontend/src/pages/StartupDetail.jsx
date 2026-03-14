import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Trash2, Brain, Save, X } from "lucide-react"
import AIScore from "../components/AIScore"
import toast from "react-hot-toast"
export default function StartupDetail() {
  const { id } = useParams(); const navigate = useNavigate()
  const [startup, setStartup] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [evaluating, setEvaluating] = useState(false)
  useEffect(()=>{ fetch(`/api/startups/${id}`).then(r=>r.json()).then(d=>{setStartup(d);setForm(d)}) },[id])
  const save = async () => {
    const res = await fetch(`/api/startups/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)})
    const data = await res.json(); setStartup(data); setEditing(false); toast.success("Updated!")
  }
  const del = async () => {
    if(!confirm("Delete this startup?")) return
    await fetch(`/api/startups/${id}`,{method:"DELETE"}); toast.success("Deleted"); navigate("/startups")
  }
  const evaluateAI = async () => {
    setEvaluating(true)
    try {
      const res = await fetch(`/api/ai/evaluate-startup/${id}`,{method:"POST"})
      const data = await res.json()
      if(data.error){toast.error(data.error);return}
      setStartup(p=>({...p,ai_score:data.score,ai_feedback:data.feedback}))
      toast.success(`AI Score: ${data.score}/100 — ${data.recommendation}`)
    } finally { setEvaluating(false) }
  }
  if(!startup) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"/></div>
  const F = ({k,label,type="text",multiline}) => (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      {editing ? (
        multiline ? <textarea value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} rows={4} className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none resize-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
        : <input value={form[k]||""} type={type} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
      ) : <p className="text-sm text-white">{startup[k]||"—"}</p>}
    </div>
  )
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={()=>navigate("/startups")} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"><ArrowLeft size={20}/></button>
        <div className="flex-1"><h1 className="text-2xl font-bold text-white">{startup.name}</h1><p className="text-slate-400 text-sm">{startup.tagline}</p></div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={save} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#34d399,#059669)"}}><Save size={14}/> Save</button>
              <button onClick={()=>setEditing(false)} className="px-4 py-2 rounded-xl text-sm text-slate-400 border border-white/10"><X size={14}/></button>
            </>
          ) : (
            <>
              <button onClick={evaluateAI} disabled={evaluating} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed)"}}><Brain size={14}/> {evaluating?"Analyzing...":"AI Evaluate"}</button>
              <button onClick={()=>setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-300 border border-white/10 hover:bg-white/5"><Edit size={14}/> Edit</button>
              <button onClick={del} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 border border-red-400/20 hover:bg-red-400/10"><Trash2 size={14}/> Delete</button>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-white">Startup Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <F k="name" label="Name"/><F k="tagline" label="Tagline"/>
            <div className="col-span-2"><F k="description" label="Description" multiline/></div>
            <F k="industry" label="Industry"/><F k="stage" label="Stage"/>
            <F k="location" label="Location"/><F k="team_size" label="Team Size" type="number"/>
            <F k="funding_needed" label="Funding Needed ($)" type="number"/><F k="founded_year" label="Founded Year" type="number"/>
            <F k="website" label="Website"/>
          </div>
        </div>
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 text-center">
            <h2 className="font-bold text-white mb-4">AI Evaluation</h2>
            <AIScore score={startup.ai_score||0}/>
            {startup.ai_feedback && <p className="text-xs text-slate-400 mt-4 text-left leading-relaxed">{startup.ai_feedback}</p>}
            {!startup.ai_score && <p className="text-xs text-slate-500 mt-3">Click AI Evaluate to score this startup.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
