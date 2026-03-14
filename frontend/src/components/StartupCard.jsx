import { Link } from "react-router-dom"
import { MapPin, Users, TrendingUp, Zap } from "lucide-react"
const stageBadge = {
  "idea": { bg: "rgba(148,163,184,0.15)", color: "#94a3b8", label: "Idea" },
  "pre-seed": { bg: "rgba(251,191,36,0.15)", color: "#fbbf24", label: "Pre-Seed" },
  "seed": { bg: "rgba(79,110,247,0.15)", color: "#4f6ef7", label: "Seed" },
  "series-a": { bg: "rgba(167,139,250,0.15)", color: "#a78bfa", label: "Series A" },
  "series-b": { bg: "rgba(52,211,153,0.15)", color: "#34d399", label: "Series B" },
  "growth": { bg: "rgba(251,113,133,0.15)", color: "#fb7185", label: "Growth" },
}
export default function StartupCard({ startup }) {
  const stage = stageBadge[startup.stage] || stageBadge["idea"]
  const score = startup.ai_score || 0
  return (
    <Link to={`/startups/${startup.id}`}>
      <div className="glass rounded-2xl p-5 transition-all duration-300 cursor-pointer group"
        style={{ border: "1px solid rgba(79,110,247,0.1)" }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#4f6ef7,#a78bfa)" }}>
            {startup.name[0]}
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: stage.bg, color: stage.color }}>{stage.label}</span>
        </div>
        <h3 className="font-bold text-white text-lg mb-1">{startup.name}</h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{startup.tagline}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          {startup.location && <span className="flex items-center gap-1"><MapPin size={11}/>{startup.location}</span>}
          {startup.team_size && <span className="flex items-center gap-1"><Users size={11}/>{startup.team_size} people</span>}
          {startup.industry && <span className="flex items-center gap-1"><TrendingUp size={11}/>{startup.industry}</span>}
        </div>
        {score > 0 && (
          <div className="flex items-center gap-2 pt-3" style={{ borderTop: "1px solid rgba(79,110,247,0.1)" }}>
            <Zap size={12} style={{ color: "#4f6ef7" }} />
            <span className="text-xs text-slate-400">AI Score</span>
            <div className="flex-1 h-1.5 rounded-full ml-1" style={{ background: "#1a2540" }}>
              <div className="h-1.5 rounded-full" style={{ width: `${score}%`, background: "linear-gradient(90deg,#4f6ef7,#a78bfa)" }} />
            </div>
            <span className="text-xs font-bold" style={{ color: score>=70?"#34d399":score>=50?"#fbbf24":"#fb7185" }}>{score}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
