const router = require('express').Router();
const db = require('../db');

// GET all startups
router.get('/', async (req, res) => {
  try {
    const { industry, stage, search } = req.query;
    let q = 'SELECT s.*, u.name as founder_name FROM startups s LEFT JOIN users u ON s.user_id = u.id WHERE 1=1';
    const params = [];
    if (industry) { q += ' AND s.industry = ?'; params.push(industry); }
    if (stage) { q += ' AND s.stage = ?'; params.push(stage); }
    if (search) { q += ' AND (s.name LIKE ? OR s.tagline LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    q += ' ORDER BY s.created_at DESC';
    const [rows] = await db.query(q, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET single startup
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT s.*, u.name as founder_name, u.email as founder_email FROM startups s LEFT JOIN users u ON s.user_id = u.id WHERE s.id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// CREATE startup
router.post('/', async (req, res) => {
  try {
    const { user_id, name, tagline, description, industry, stage, funding_needed, website, team_size, location, founded_year } = req.body;
    const [result] = await db.query(
      'INSERT INTO startups (user_id, name, tagline, description, industry, stage, funding_needed, website, team_size, location, founded_year) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [user_id || 1, name, tagline, description, industry, stage, funding_needed, website, team_size, location, founded_year]
    );
    const [rows] = await db.query('SELECT * FROM startups WHERE id = ?', [result.insertId]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// UPDATE startup
router.put('/:id', async (req, res) => {
  try {
    const fields = ['name','tagline','description','industry','stage','funding_needed','website','team_size','location','founded_year','status'];
    const updates = [];
    const params = [];
    fields.forEach(f => {
      if (req.body[f] !== undefined) { updates.push(`${f} = ?`); params.push(req.body[f]); }
    });
    if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await db.query(`UPDATE startups SET ${updates.join(', ')} WHERE id = ?`, params);
    const [rows] = await db.query('SELECT * FROM startups WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE startup
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM startups WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET stats
router.get('/meta/stats', async (req, res) => {
  try {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM startups');
    const [[{ funded }]] = await db.query("SELECT COUNT(*) as funded FROM startups WHERE status = 'funded'");
    const [[{ avg_score }]] = await db.query('SELECT AVG(ai_score) as avg_score FROM startups WHERE ai_score > 0');
    const [byIndustry] = await db.query('SELECT industry, COUNT(*) as count FROM startups GROUP BY industry');
    const [byStage] = await db.query('SELECT stage, COUNT(*) as count FROM startups GROUP BY stage');
    res.json({ total, funded, avg_score: Math.round(avg_score || 0), byIndustry, byStage });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;