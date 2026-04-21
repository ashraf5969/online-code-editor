const Snippet = require('../models/Snippet');

// Create Snippet
exports.createSnippet = async (req, res, next) => {
    try {
        req.body.userId = req.user.id;
        const snippet = await Snippet.create(req.body);
        res.status(201).json({ success: true, data: snippet });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Get all User Snippets (with search, filter, sort)
exports.getSnippets = async (req, res, next) => {
    try {
        let query = { userId: req.user.id };

        // Search by title
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }

        // Filter by language
        if (req.query.language) {
            query.language = req.query.language;
        }

        // Filter by favorites
        if (req.query.favorite === 'true') {
            query.isFavorite = true;
        }

        // Sort (default: latest first)
        let sortOption = '-createdAt';
        if (req.query.sort) {
            const parts = req.query.sort.split(':');
            sortOption = parts[1] === 'desc' ? `-${parts[0]}` : parts[0];
        }

        const snippets = await Snippet.find(query).sort(sortOption);
        res.status(200).json({ success: true, count: snippets.length, data: snippets });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Get Single Snippet
exports.getSnippet = async (req, res, next) => {
    try {
        const snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({ success: false, error: 'Snippet not found' });
        }

        // Check if snippet belongs to user or is public
        if (snippet.userId.toString() !== req.user.id && !snippet.isPublic) {
            return res.status(401).json({ success: false, error: 'Not authorized to access this snippet' });
        }

        res.status(200).json({ success: true, data: snippet });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Update Snippet
exports.updateSnippet = async (req, res, next) => {
    try {
        let snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({ success: false, error: 'Snippet not found' });
        }

        // Make sure user is snippet owner
        if (snippet.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authorized to update this snippet' });
        }

        snippet = await Snippet.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: snippet });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Delete Snippet
exports.deleteSnippet = async (req, res, next) => {
    try {
        const snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({ success: false, error: 'Snippet not found' });
        }

        if (snippet.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authorized to delete this snippet' });
        }

        await snippet.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Duplicate Snippet
exports.duplicateSnippet = async (req, res, next) => {
    try {
        const originalSnippet = await Snippet.findById(req.params.id);

        if (!originalSnippet) {
            return res.status(404).json({ success: false, error: 'Snippet not found' });
        }

        if (originalSnippet.userId.toString() !== req.user.id && !originalSnippet.isPublic) {
            return res.status(401).json({ success: false, error: 'Not authorized to duplicate this snippet' });
        }

        const duplicatedData = {
            userId: req.user.id,
            title: `${originalSnippet.title} (Copy)`,
            htmlCode: originalSnippet.htmlCode,
            cssCode: originalSnippet.cssCode,
            jsCode: originalSnippet.jsCode,
            language: originalSnippet.language,
            isPublic: false
        };

        const newSnippet = await Snippet.create(duplicatedData);
        res.status(201).json({ success: true, data: newSnippet });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Toggle Favorite
exports.toggleFavorite = async (req, res, next) => {
    try {
        const snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({ success: false, error: 'Snippet not found' });
        }

        if (snippet.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authorized to update this snippet' });
        }

        snippet.isFavorite = !snippet.isFavorite;
        await snippet.save();

        res.status(200).json({ success: true, data: snippet });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};