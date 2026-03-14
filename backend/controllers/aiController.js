const Groq = require("groq-sdk")
const pdfParse = require("pdf-parse")
const fs = require("fs")
const db = require("../db")
require("dotenv").config()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function analyzePitchDeck(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })

    let extractedText = ""
    const filePath = req.file.path
    const ext = req.file.originalname.split(".").pop().toLowerCase()

    if (ext === "pdf") {
      const dataBuffer = fs.readFileSync(filePath)
      const pdfData = await pdfParse(dataBuffer)
      extractedText = pdfData.text
    } else {
      extractedText = `PowerPoint file uploaded: ${req.file.originalname}. Please provide a comprehensive evaluation.`
    }

    if (!extractedText || extractedText.trim().length < 50) {
      extractedText = `Startup pitch deck: ${req.file.originalname}. Provide a comprehensive evaluation framework.`
    }

    const prompt = `You are a world-class startup investor and pitch deck expert with 20+ years experience. Analyze this pitch deck and provide a comprehensive evaluation.

PITCH DECK CONTENT:
${extractedText.substring(0, 6000)}

Respond ONLY with valid JSON (no markdown, no backticks, no explanation, just raw JSON):
{
  "overall_score": <0-100 integer>,
  "investor_readiness": "<one of: Not Ready, Early Stage, Getting There, Almost There, Investor Ready>",
  "summary": "<3-4 sentence executive summary of this startup>",
  "scores": {
    "problem": <0-100>,
    "solution": <0-100>,
    "market": <0-100>,
    "team": <0-100>,
    "traction": <0-100>,
    "financials": <0-100>
  },
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "weaknesses": ["<specific weakness 1>", "<specific weakness 2>", "<specific weakness 3>"],
  "improvements": [
    {"area": "<area name>", "action": "<specific actionable improvement>", "priority": "<High|Medium|Low>"},
    {"area": "<area name>", "action": "<specific actionable improvement>", "priority": "<High|Medium|Low>"},
    {"area": "<area name>", "action": "<specific actionable improvement>", "priority": "<High|Medium|Low>"},
    {"area": "<area name>", "action": "<specific actionable improvement>", "priority": "<High|Medium|Low>"},
    {"area": "<area name>", "action": "<specific actionable improvement>", "priority": "<High|Medium|Low>"}
  ],
  "investor_questions": ["<tough question 1>", "<tough question 2>", "<tough question 3>"],
  "comparable_companies": ["<comparable startup 1>", "<comparable startup 2>"],
  "next_steps": ["<immediate action 1>", "<immediate action 2>", "<immediate action 3>"]
}`

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0]?.message?.content?.trim()
    console.log("Groq response received, length:", responseText?.length)

    let analysis
    try {
      analysis = JSON.parse(responseText)
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) analysis = JSON.parse(jsonMatch[0])
      else throw new Error("AI response was not valid JSON: " + responseText?.substring(0, 200))
    }

    const startupId = req.body.startup_id || null
    const userId = req.body.user_id || null

    const [dbResult] = await db.query(
      `INSERT INTO pitch_analyses (startup_id, user_id, file_name, file_path, extracted_text, overall_score, problem_score, solution_score, market_score, team_score, traction_score, financials_score, strengths, weaknesses, improvements, investor_readiness, summary) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        startupId, userId, req.file.originalname, filePath,
        extractedText.substring(0, 5000),
        analysis.overall_score,
        analysis.scores?.problem || 0,
        analysis.scores?.solution || 0,
        analysis.scores?.market || 0,
        analysis.scores?.team || 0,
        analysis.scores?.traction || 0,
        analysis.scores?.financials || 0,
        JSON.stringify(analysis.strengths),
        JSON.stringify(analysis.weaknesses),
        JSON.stringify(analysis.improvements),
        analysis.investor_readiness,
        analysis.summary
      ]
    )

    if (startupId) {
      await db.query(
        "UPDATE startups SET ai_score = ?, ai_feedback = ?, ai_analyzed_at = NOW() WHERE id = ?",
        [analysis.overall_score, analysis.summary, startupId]
      )
    }

    res.json({ success: true, analysis, analysisId: dbResult.insertId })

  } catch (e) {
    console.error("AI Analysis Error:", e.message)
    res.status(500).json({ error: e.message })
  }
}

async function evaluateStartup(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM startups WHERE id = ?", [req.params.id])
    if (!rows.length) return res.status(404).json({ error: "Startup not found" })
    const startup = rows[0]

    const prompt = `Evaluate this startup. Return ONLY raw JSON, no markdown, no backticks.

Name: ${startup.name}
Tagline: ${startup.tagline}
Description: ${startup.description}
Industry: ${startup.industry}
Stage: ${startup.stage}
Team Size: ${startup.team_size}
Location: ${startup.location}
Funding Needed: $${startup.funding_needed}
Founded: ${startup.founded_year}

Return this exact JSON structure:
{"score": <0-100>, "feedback": "<2-3 sentence investor feedback>", "recommendation": "<Invest|Watch|Pass>", "key_strengths": ["strength1", "strength2"], "key_risks": ["risk1", "risk2"]}`

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 500,
    })

    let text = completion.choices[0]?.message?.content?.trim()
    console.log("Groq evaluate response:", text?.substring(0, 200))

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const evaluation = JSON.parse(jsonMatch ? jsonMatch[0] : text)

    await db.query(
      "UPDATE startups SET ai_score = ?, ai_feedback = ?, ai_analyzed_at = NOW() WHERE id = ?",
      [evaluation.score, evaluation.feedback, req.params.id]
    )

    res.json(evaluation)
  } catch (e) {
    console.error("Evaluate Error:", e.message)
    res.status(500).json({ error: e.message })
  }
}

module.exports = { analyzePitchDeck, evaluateStartup }
