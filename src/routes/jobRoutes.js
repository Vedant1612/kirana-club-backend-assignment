const express = require('express');
const { submitJob, getJobStatus } = require('../controllers/jobController');

const router = express.Router();

router.post('/api/submit', submitJob);
router.get('/api/status', getJobStatus);

module.exports = router;
