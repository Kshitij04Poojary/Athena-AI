const mongoose = require('mongoose');

// const attendanceSchema = new mongoose.Schema({
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Mentee',
//       required: true
//     },
//     joinTime: {
//       type: Date,
//       required: true,
//       default: Date.now
//     },
//     leaveTime: Date,
//     duration: Number
//   });
// attendanceSchema.pre('save', function() {
//     if (this.isModified('leaveTime') && this.leaveTime) {
//       this.duration = Math.round((this.leaveTime - this.joinTime) / 60000); // In minutes
//     }
//   });
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
    attendance: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mentee',
            // required: true
          },
    }],
    // Lecture.js

    
}, { timestamps: true });


const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;

// Lecture.syncIndexes().then(() => {
//     console.log('Indexes are synchronized');
// }).catch(err => {
//     console.error('Error synchronizing indexes', err);
// });
