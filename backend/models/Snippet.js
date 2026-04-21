const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide the user ID']
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    htmlCode: {
        type: String,
        default: ''
    },
    cssCode: {
        type: String,
        default: ''
    },
    jsCode: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        trim: true,
        default: 'web'
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

module.exports = mongoose.model('Snippet', SnippetSchema);
