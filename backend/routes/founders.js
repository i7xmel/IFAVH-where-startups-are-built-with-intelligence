const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT u.id, u.name, u.email, u.role, u.avatar, u.created_at, fp.bio, fp.skills, fp.linkedin, fp.twitter, fp.looking_for, fp.expertise, fp.open_to_connect FROM users u LEFT JOIN founder_profiles fp ON u.id = fp.user_id WHERE fp.open_to_connect = TRUE ORDER BY u.created_at DESC'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/profile', async (req, res) => {
  try {
    const { user_id, bio, skills, linkedin, twitter, looking_for, expertise } = req.body;
    const [existing] = await db.query('SELECT id FROM founder_profiles WHERE user_id = ?', [user_id]);
    if (existing.length) {
      await db.query('UPDATE founder_profiles SET bio=?, skills=?, linkedin=?, twitter=?, looking_for=?, expertise=? WHERE user_id=?',
        [bio, skills, linkedin, twitter, looking_for, expertise, user_id]);
    } else {
      await db.query('INSERT INTO founder_profiles (user_id, bio, skills, linkedin, twitter, looking_for, expertise) VALUES (?,?,?,?,?,?,?)',
        [user_id, bio, skills, linkedin, twitter, looking_for, expertise]);
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/connect', async (req, res) => {
  try {
    const { requester_id, receiver_id } = req.body;
    await db.query('INSERT INTO connections (requester_id, receiver_id) VALUES (?, ?)', [requester_id, receiver_id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;