const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phoneNumber: Number,
    userType: { type: String, enum: ['Student', 'Mentor', 'Admin'], required: true },
    role: { type: String, enum: ['mentor', 'mentee'], required: false },
    skills: [{
        name: { type: String, required: true },         
        proficiency: { type: Number, min: 0, max: 100, default: 50 }  
    }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    careerGoals: [String],
    linkedin: String,
    github: String,
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
