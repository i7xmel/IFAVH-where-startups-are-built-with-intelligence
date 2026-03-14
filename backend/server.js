const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/startups', require('./routes/startups'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/events', require('./routes/events'));
app.use('/api/founders', require('./routes/founders'));

app.get('/api/health', (req, res) => res.json({ status: 'IFAV Platform API running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));