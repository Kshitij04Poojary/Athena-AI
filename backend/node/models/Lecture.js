const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true,
        default: 60
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
    attendance: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mentee',
          },
    }],
    
}, { timestamps: true });


const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;

