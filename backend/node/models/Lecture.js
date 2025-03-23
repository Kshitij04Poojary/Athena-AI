const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    title: { type: String, required: true },

    mentor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Changed from 'Mentor' to 'User'
        required: true 
    },

    students: [{ // Changed from 'mentee' to 'students'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],

    startTime: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes

    status: { 
        type: String, 
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], 
        default: 'scheduled' 
    },

    roomId: { type: String, required: true, unique: true },
    recordingUrl: { type: String },
    transcript: { type: String },

    attendance: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // Changed from 'Mentee' to 'User'
    }]

}, { timestamps: true });

const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;
