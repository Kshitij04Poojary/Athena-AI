const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expertise: [String],
  rating: {
    type: Number,
    default: 0
  },
  totalHoursTaught: {
    type: Number,
    default: 0
  },
  mentees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentee'
  }],
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  reviews: [{
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentee'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });


const Mentor =mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;

// Mentor.syncIndexes().then(() => {
//   console.log('Indexes are synchronized');
// }).catch(err => {
//   console.error('Error synchronizing indexes', err);
// });