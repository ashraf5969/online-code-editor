const Snippet = require('../models/Snippet');

// @desc    Get all snippets
// @route   GET /api/editor/snippets
exports.getSnippets = async (req, res, next) => {
    try {
        const snippets = await Snippet.find();
        res.status(200).json({ success: true, data: snippets });
    } catch (error) {
        next(error);
    }
};

// @desc    Save a snippet
// @route   POST /api/editor/snippets
exports.saveSnippet = async (req, res, next) => {
    try {
        const snippet = await Snippet.create(req.body);
        res.status(201).json({ success: true, data: snippet });
    } catch (error) {
        next(error);
    }
};
