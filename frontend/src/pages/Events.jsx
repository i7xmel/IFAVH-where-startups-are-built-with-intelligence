import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, Plus, Video, X } from "lucide-react"
import toast from "react-hot-toast"
const typeColors = {"pitch":"#4f6ef7","networking":"#34d399","workshop":"#fbbf24","demo-day":"#a78bfa","conference":"#fb7185"}
function AddModal({ onClose, onSave }) {
  const [form, setForm] = useState({title:"",description:"",event_type:"networking",date:"",location:"",is_virtual:false,max_attendees:"",meeting_link:""})
  const [saving, setSaving] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const res = await fetch("/api/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,organizer_id:1})})
      const data = await res.json()
      if(data.error){toast.error(data.error);return}
      toast.success("Event created!"); onSave(data)
    } finally { setSaving(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)"}}>
      <div className="w-full max-w-lg rounded-2xl p-6" style={{background:"#0f1629",border:"1px solid rgba(79,110,247,0.2)"}}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Create Event</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-white"/></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Event Title" required className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Description" className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="Location" className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}/>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.event_type} onChange={e=>setForm(f=>({...f,event_type:e.target.value}))} className="px-3 py-2 rounded-xl text-sm text-white outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)"}}>
              {["pitch","networking","workshop","demo-day","conference"].map(t=><option key={t}>{t}</option>)}
            </select>
            <input type="datetime-local" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} required className="px-3 py-2 rounded-xl text-sm text-white outline-none" style={{background:"#1a2540",border:"1px solid rgba(79,110,247,0.2)",colorScheme:"dark"}}/>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_virtual} onChange={e=>setForm(f=>({...f,is_virtual:e.target.checked}))} className="w-4 h-4"/>
            <span className="text-sm text-slate-300">Virtual Event</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl text-sm text-slate-400 border border-white/10">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#4f6ef7,#a78bfa)"}}>{saving?"Creating...":"Create Event"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default function Events() {
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  useEffect(()=>{ fetch("/api/events").then(r=>r.json()).then(setEvents) },[])
  const attend = async (id) => {
    const res = await fetch(`/api/events/${id}/attend`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:1})})
    const data = await res.json()
    if(data.error){toast.error(data.error);return}
    toast.success("Registered!"); setEvents(ev=>ev.map(e=>e.id===id?{...e,attendee_count:(e.attendee_count||0)+1}:e))
  }
  const del = async (id) => {
    await fetch(`/api/events/${id}`,{method:"DELETE"}); setEvents(ev=>ev.filter(e=>e.id!==id)); toast.success("Deleted")
  }
  return (
    <div className="space-y-6">
      {showModal && <AddModal onClose={()=>setShowModal(false)} onSave={(ev)=>{setEvents(p=>[...p,ev]);setShowModal(false)}}/>}
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-white">Events <span className="gradient-text">& Meetups</span></h1><p className="text-slate-400 text-sm">{events.length} events</p></div>
        <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#4f6ef7,#a78bfa)"}}><Plus size={16}/> Create Event</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(ev=>{
          const color = typeColors[ev.event_type]||"#4f6ef7"
          const d = new Date(ev.date)
          return (
            <div key={ev.id} className="glass rounded-2xl overflow-hidden group" style={{border:"1px solid rgba(79,110,247,0.1)"}}>
              <div className="h-2" style={{background:`linear-gradient(90deg,${color},${color}88)`}}/>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-lg capitalize" style={{background:`${color}22`,color}}>{ev.event_type?.replace("-"," ")}</span>
                  <button onClick={()=>del(ev.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400"><X size={14}/></button>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{ev.title}</h3>
                {ev.description && <p className="text-sm text-slate-400 mb-4 line-clamp-2">{ev.description}</p>}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400"><Calendar size={12}/>{d.toLocaleDateString("en",{weekday:"short",month:"short",day:"numeric"})}</div>
                  {ev.location && <div className="flex items-center gap-2 text-xs text-slate-400"><MapPin size={12}/>{ev.location}</div>}
                  <div className="flex items-center gap-2 text-xs text-slate-400"><Users size={12}/>{ev.attendee_count||0} attending</div>
                </div>
                <button onClick={()=>attend(ev.id)} className="w-full py-2 rounded-xl text-xs font-bold" style={{background:`${color}22`,color,border:`1px solid ${color}44`}}>Register</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
