const router = require('express').Router();
const upload = require('../middleware/upload');
const { analyzePitchDeck, evaluateStartup } = require('../controllers/aiController');

router.post('/analyze-pitch', upload.single('pitchDeck'), analyzePitchDeck);
router.post('/evaluate-startup/:id', evaluateStartup);

module.exports = router;