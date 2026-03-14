const router = require("express").Router()
const db = require("../db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email])
    if (existing.length) return res.status(400).json({ error: "Email already exists" })
    const hashed = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role || "founder"]
    )
    const token = jwt.sign({ id: result.insertId, role: role || "founder" }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.json({ token, user: { id: result.insertId, name, email, role: role || "founder" } })
  } catch (e) {
    console.error("REGISTER ERROR:", e)
    res.status(500).json({ error: e.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body.email)
    const { email, password } = req.body
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email])
    console.log("Users found:", users.length)
    if (!users.length) return res.status(400).json({ error: "Invalid credentials" })
    const user = users[0]
    const valid = await bcrypt.compare(password, user.password)
    console.log("Password valid:", valid)
    if (!valid) return res.status(400).json({ error: "Invalid credentials" })
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    console.error("LOGIN ERROR:", e)
    res.status(500).json({ error: e.message })
  }
})

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "No token" })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const [users] = await db.query("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [decoded.id])
    res.json(users[0])
  } catch (e) {
    console.error("ME ERROR:", e)
    res.status(401).json({ error: "Invalid token" })
  }
})

module.exports = router
