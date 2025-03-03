const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    codeExample: { type: String }  // Optional, might not exist for theory-only sections
});

const chapterSchema = new mongoose.Schema({
    chapterName: { type: String, required: true },
    about: { type: String, required: true },
    duration: { type: String, required: true },
    sections: [sectionSchema],
    video: { type: String }
});

const courseSchema = new mongoose.Schema({
    courseId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    topic: { type: String, required: true },
    level: { type: String, required: true, enum: ['Basic', 'Intermediate', 'Advanced'] },
    courseOutcomes: { type: [String] },
    duration: { type: String, required: true },
    noOfChapters: { type: Number, required: true },
    chapters: {
        type: [chapterSchema],
        validate: {
            validator: function (chapters) {
                return chapters.length <= 5;
            },
            message: 'A course can have a maximum of 5 chapters only.'
        }
    },
    video: { type: Boolean, default: true },
    progress: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
