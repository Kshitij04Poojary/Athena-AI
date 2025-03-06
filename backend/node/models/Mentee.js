const mongoose = require('mongoose');

const menteeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor'
  },
  learningGoals: [String],
  progress: {
    totalHoursLearned: {
      type: Number,
      default: 0
    },
    lecturesAttended: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    preferredTiming: [String],
    topics: [String]
  }
}, { timestamps: true });

const Mentee =mongoose.model('Mentee', menteeSchema);
module.exports = Mentee;

// Mentee.syncIndexes().then(() => {
//   console.log('Indexes are synchronized');
// }).catch(err => {
//   console.error('Error synchronizing indexes', err);
// });