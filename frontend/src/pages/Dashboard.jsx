import { useState, useEffect } from "react"
import { Rocket, Users, Calendar, Brain, Star } from "lucide-react"
import StatCard from "../components/StatCard"
import StartupCard from "../components/StartupCard"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts"
export default function Dashboard() {
  const [stats, setStats] = useState({ total:0, funded:0, avg_score:0, byIndustry:[], byStage:[] })
  const [startups, setStartups] = useState([])
  const [events, setEvents] = useState([])
  useEffect(() => {
    Promise.all([
      fetch("/api/startups/meta/stats").then(r=>r.json()),
      fetch("/api/startups").then(r=>r.json()),
      fetch("/api/events").then(r=>r.json()),
    ]).then(([s,st,ev]) => { setStats(s); setStartups(st.slice(0,3)); setEvents(ev.slice(0,3)) })
  }, [])
  const colors = ["#4f6ef7","#a78bfa","#34d399","#fbbf24","#fb7185"]
  const stageColors = {"idea":"#94a3b8","pre-seed":"#fbbf24","seed":"#4f6ef7","series-a":"#a78bfa","series-b":"#34d399","growth":"#fb7185"}
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard <span className="gradient-text">Overview</span></h1>
        <p className="text-slate-400 text-sm">Welcome to the IFAV startup ecosystem platform</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Startups" value={stats.total} icon={Rocket} color="#4f6ef7" trend={12} />
        <StatCard title="Funded Startups" value={stats.funded} icon={Star} color="#34d399" trend={8} />
        <StatCard title="Avg AI Score" value={stats.avg_score} icon={Brain} color="#a78bfa" subtitle="Out of 100" />
        <StatCard title="Events" value={events.length} icon={Calendar} color="#fbbf24" trend={5} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Startups by Industry</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.byIndustry}>
              <XAxis dataKey="industry" tick={{fill:"#64748b",fontSize:11}} />
              <YAxis tick={{fill:"#64748b",fontSize:11}} />
              <Tooltip contentStyle={{background:"#141d35",border:"1px solid rgba(79,110,247,0.3)",borderRadius:"12px",color:"#e2e8f0"}} />
              <Bar dataKey="count" radius={[6,6,0,0]}>{stats.byIndustry.map((_,i)=><Cell key={i} fill={colors[i%5]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Startup Stages</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.byStage} layout="vertical">
              <XAxis type="number" tick={{fill:"#64748b",fontSize:11}} />
              <YAxis dataKey="stage" type="category" tick={{fill:"#64748b",fontSize:11}} width={70} />
              <Tooltip contentStyle={{background:"#141d35",border:"1px solid rgba(79,110,247,0.3)",borderRadius:"12px",color:"#e2e8f0"}} />
              <Bar dataKey="count" radius={[0,6,6,0]}>{stats.byStage.map((e,i)=><Cell key={i} fill={stageColors[e.stage]||"#4f6ef7"}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Startups</h2>
          <a href="/startups" className="text-sm text-blue-400 hover:text-blue-300">View all →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {startups.map(s=><StartupCard key={s.id} startup={s}/>)}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {events.map(ev=>(
            <div key={ev.id} className="glass rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                style={{background:"linear-gradient(135deg,rgba(79,110,247,0.2),rgba(167,139,250,0.1))",border:"1px solid rgba(79,110,247,0.2)"}}>
                <span className="text-xs text-blue-400 font-mono">{new Date(ev.date).toLocaleDateString("en",{month:"short"})}</span>
                <span className="text-lg font-bold text-white leading-none">{new Date(ev.date).getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{ev.title}</p>
                <p className="text-xs text-slate-400">{ev.location} • {ev.attendee_count||0} attending</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${ev.is_virtual?"text-emerald-400 bg-emerald-400/10":"text-blue-400 bg-blue-400/10"}`}>
                {ev.is_virtual?"Virtual":"In-Person"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
