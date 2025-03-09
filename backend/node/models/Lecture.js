const mongoose = require('mongoose');


const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    mentee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentee',
        required: true
    }],

    startTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    recordingUrl: {
        type: String
    },
    transcript: {
        type: String
    },
    attendance: [{
        
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mentee',
            // required: true
          
    }],
    // Lecture.js

    
}, { timestamps: true });


const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;