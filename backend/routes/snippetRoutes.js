const express = require('express');
const router = express.Router();
const {
    createSnippet,
    getSnippets,
    getSnippet,
    updateSnippet,
    deleteSnippet,
    duplicateSnippet,
    toggleFavorite
} = require('../controllers/snippetController');

const { protect } = require('../middleware/authMiddleware');

// Group routes
router.use(protect); // All snippet routes require authentication

router.route('/')
    .post(createSnippet)
    .get(getSnippets);

router.route('/:id')
    .get(getSnippet)
    .put(updateSnippet)
    .delete(deleteSnippet);

router.post('/:id/duplicate', duplicateSnippet);
router.put('/:id/favorite', toggleFavorite);

module.exports = router;