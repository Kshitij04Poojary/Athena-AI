const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    userType: { type: String, enum: ['Student', 'Teacher'], required: true },
    role: { type: String, enum: ['mentor', 'mentee'], required: false },
    skills: [String],
    courses: [String],
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
