import { useState, useRef } from "react"
import { Upload, Brain, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react"
import AIScore from "../components/AIScore"
import toast from "react-hot-toast"
const scoreLabels = {problem:"Problem",solution:"Solution",market:"Market Size",team:"Team",traction:"Traction",financials:"Financials"}
const readinessColor = {"Investor Ready":"#34d399","Almost There":"#4f6ef7","Getting There":"#fbbf24","Early Stage":"#f97316","Not Ready":"#fb7185"}
export default function PitchAnalyzer() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const fileRef = useRef()
  const handleFile = (f) => {
    if(!f) return
    const ext = f.name.split(".").pop().toLowerCase()
    if(!["pdf","pptx","ppt"].includes(ext)){toast.error("PDF or PowerPoint only");return}
    setFile(f); setResult(null)
  }
  const analyze = async () => {
    if(!file) return; setLoading(true)
    try {
      const fd = new FormData(); fd.append("pitchDeck",file); fd.append("user_id","1")
      const res = await fetch("/api/ai/analyze-pitch",{method:"POST",body:fd})
      const data = await res.json()
      if(data.error){toast.error(data.error);return}
      setResult(data.analysis); toast.success("Analysis complete!")
    } catch(e){toast.error("Failed: "+e.message)} finally{setLoading(false)}
  }
  const parseArr = (v) => { try { return typeof v==="string"?JSON.parse(v):v||[] } catch{return []} }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Pitch <span className="gradient-text">Analyzer</span></h1>
        <p className="text-slate-400 text-sm mt-1">Upload your pitch deck for instant AI scoring and feedback</p>
      </div>
      <div onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0])}}
        onClick={()=>fileRef.current.click()}
        className="rounded-2xl p-12 text-center cursor-pointer transition-all duration-300"
        style={{background:dragging?"rgba(79,110,247,0.1)":"rgba(20,29,53,0.5)",border:`2px dashed ${dragging?"#4f6ef7":"rgba(79,110,247,0.25)"}`}}>
        <input ref={fileRef} type="file" accept=".pdf,.pptx,.ppt" className="hidden" onChange={e=>handleFile(e.target.files[0])}/>
        <Upload size={40} className="mx-auto mb-3" style={{color:dragging?"#4f6ef7":"#253660"}}/>
        {file ? <div><p className="font-bold text-white text-lg">{file.name}</p><p className="text-sm text-slate-400 mt-1">{(file.size/1024/1024).toFixed(2)} MB</p></div>
          : <div><p className="font-bold text-white text-lg mb-2">Drop your pitch deck here</p><p className="text-sm text-slate-400">PDF or PowerPoint • Up to 20MB</p></div>}
      </div>
      {file && !loading && !result && (
        <button onClick={analyze} className="w-full py-4 rounded-2xl text-lg font-bold text-white flex items-center justify-center gap-3" style={{background:"linear-gradient(135deg,#4f6ef7,#a78bfa)"}}>
          <Brain size={22}/> Analyze with AI
        </button>
      )}
      {loading && (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4"/>
          <p className="text-white font-bold text-lg">Analyzing your pitch deck...</p>
          <p className="text-slate-400 text-sm mt-2">Gemini AI is evaluating your startup</p>
        </div>
      )}
      {result && (
        <div className="space-y-5 animate-fade-up">
          <div className="glass rounded-2xl p-6 flex items-center gap-6 flex-wrap">
            <AIScore score={result.overall_score} label="Overall Score"/>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-2xl font-bold text-white">{result.overall_score}/100</span>
                <span className="px-3 py-1 rounded-full text-sm font-bold" style={{background:`${readinessColor[result.investor_readiness]||"#4f6ef7"}22`,color:readinessColor[result.investor_readiness]||"#4f6ef7"}}>{result.investor_readiness}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">Category Scores</h3>
            <div className="space-y-3">
              {Object.entries(result.scores||{}).map(([k,v])=>(
                <div key={k} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-32 shrink-0">{scoreLabels[k]||k}</span>
                  <div className="flex-1 h-2 rounded-full" style={{background:"#1a2540"}}>
                    <div className="h-2 rounded-full" style={{width:`${v}%`,background:v>=70?"#34d399":v>=50?"#4f6ef7":"#fb7185"}}/>
                  </div>
                  <span className="text-xs font-bold w-8 text-right" style={{color:v>=70?"#34d399":v>=50?"#4f6ef7":"#fb7185"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-white flex items-center gap-2 mb-3"><CheckCircle size={16} className="text-emerald-400"/>Strengths</h3>
              <ul className="space-y-2">{parseArr(result.strengths).map((s,i)=><li key={i} className="flex gap-2 text-sm text-slate-300"><span className="text-emerald-400 shrink-0">✓</span>{s}</li>)}</ul>
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-white flex items-center gap-2 mb-3"><AlertTriangle size={16} className="text-amber-400"/>Weaknesses</h3>
              <ul className="space-y-2">{parseArr(result.weaknesses).map((w,i)=><li key={i} className="flex gap-2 text-sm text-slate-300"><span className="text-amber-400 shrink-0">⚠</span>{w}</li>)}</ul>
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4"><Lightbulb size={16} className="text-blue-400"/>Improvements</h3>
            <div className="space-y-3">
              {parseArr(result.improvements).map((imp,i)=>(
                <div key={i} className="flex gap-3 p-3 rounded-xl" style={{background:"#1a2540"}}>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${imp.priority==="High"?"text-red-400 bg-red-400/10":imp.priority==="Medium"?"text-amber-400 bg-amber-400/10":"text-emerald-400 bg-emerald-400/10"}`}>{imp.priority}</span>
                  <div><p className="text-sm font-semibold text-white">{imp.area}</p><p className="text-xs text-slate-400 mt-0.5">{imp.action}</p></div>
                </div>
              ))}
            </div>
          </div>
          {result.investor_questions && (
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3">🎯 Expect These Investor Questions</h3>
              <ul className="space-y-2">{result.investor_questions.map((q,i)=><li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-blue-400 shrink-0">{i+1}.</span>{q}</li>)}</ul>
            </div>
          )}
          <button onClick={()=>{setFile(null);setResult(null)}} className="w-full py-3 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Analyze Another Deck</button>
        </div>
      )}
    </div>
  )
}
