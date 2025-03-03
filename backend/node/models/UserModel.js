const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    userType: { type: String, enum: ['Student', 'Teacher'], required: true },
    role: { type: String, enum: ['mentor', 'mentee'], required: false },
    skills: [{
        name: { type: String, required: true },         // Skill name (required)
        proficiency: { type: Number, min: 0, max: 100 }  // Skill level 0-100
    }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    careerGoals: [String],
    preferences: {
        location: [String],
        preferredStipendRange: String,
        remotePreference: Boolean
    },
    achievements: [String],
    badges: [String],
    leaderboardRank: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
