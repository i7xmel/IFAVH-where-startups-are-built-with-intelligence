export default function StatCard({ title, value, subtitle, icon: Icon, color = "#4f6ef7", trend }) {
  return (
    <div className="glass rounded-2xl p-5 glow animate-fade-up">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trend >= 0 ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-white/80">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  )
}
