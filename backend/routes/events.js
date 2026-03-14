const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT e.*, u.name as organizer_name, COUNT(ea.id) as attendee_count FROM events e LEFT JOIN users u ON e.organizer_id = u.id LEFT JOIN event_attendees ea ON e.id = ea.event_id GROUP BY e.id ORDER BY e.date ASC'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, event_type, date, location, is_virtual, meeting_link, max_attendees, organizer_id } = req.body;
    const [result] = await db.query(
      'INSERT INTO events (title, description, event_type, date, location, is_virtual, meeting_link, max_attendees, organizer_id) VALUES (?,?,?,?,?,?,?,?,?)',
      [title, description, event_type, date, location, is_virtual || false, meeting_link, max_attendees, organizer_id || 1]
    );
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/attend', async (req, res) => {
  try {
    const { user_id } = req.body;
    const [existing] = await db.query('SELECT id FROM event_attendees WHERE event_id = ? AND user_id = ?', [req.params.id, user_id]);
    if (existing.length) return res.status(400).json({ error: 'Already registered' });
    await db.query('INSERT INTO event_attendees (event_id, user_id) VALUES (?, ?)', [req.params.id, user_id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;