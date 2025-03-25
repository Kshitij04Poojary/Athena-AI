const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    front: {
        type: String,
        required: true
    },
    back: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);