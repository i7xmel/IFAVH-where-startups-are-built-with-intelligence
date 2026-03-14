export default function AIScore({ score, label = "AI Score" }) {
  const color = score >= 70 ? "#34d399" : score >= 50 ? "#fbbf24" : "#fb7185"
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1a2540" strokeWidth="8" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2">{label}</p>
    </div>
  )
}
