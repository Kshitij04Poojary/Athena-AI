const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String
  }],
  assignedMentees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentee'
  }],
  scores: [{
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentee'
    },
    score: Number,
    totalMarks: Number,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;
