const express = require('express');
const { getSnippets, saveSnippet } = require('../controllers/editorController');

const router = express.Router();

router.route('/snippets')
    .get(getSnippets)
    .post(saveSnippet);

module.exports = router;
