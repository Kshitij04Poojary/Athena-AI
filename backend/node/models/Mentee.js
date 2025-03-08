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
  profileCompleted: {
    type: Boolean,
    default: false
  },
  academics: {
    class10: {
      school: String,
      percentage: Number,
      yearOfCompletion: Number
    },
    class12: {
      school: String,
      percentage: Number,
      yearOfCompletion: Number
    },
    currentEducation: {
      institution: String,
      course: String,
      specialization: String,
      yearOfStudy: Number,
      cgpa: Number
    }
  },
  extracurricular: [{
    activity: String,
    role: String,
    description: String,
    duration: String
  }],
  internships: [{
    company: String,
    role: String,
    duration: String,
    description: String
  }],
  achievements: [{
    title: String,
    description: String,
    year: Number
  }],
  futureGoals: {
    shortTerm: String,
    longTerm: String,
    dreamCompanies: [String]
  },
  progress: {
    totalHoursLearned: { type: Number, default: 0 },
    lecturesAttended: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  }
}, { timestamps: true });

const Mentee = mongoose.model('Mentee', menteeSchema);
module.exports = Mentee;