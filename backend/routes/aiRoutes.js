const express = require('express');
const { generateCode } = require('../controllers/aiController');

const router = express.Router();

router.post('/generate', generateCode);

module.exports = router;