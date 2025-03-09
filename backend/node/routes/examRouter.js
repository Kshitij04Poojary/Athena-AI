const express = require('express');
const router = express.Router();
const Exam = require('../models/ExamModel');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

// Create a new exam
router.post('/create', async (req, res) => {
  try {
    const { mentorId, title, description, questions, assignedMentees } = req.body;
    console.log(mentorId)
    // Check if mentor exists
    const mentorExists = await Mentor.findOne({user:mentorId});
    
    if (!mentorExists) return res.status(404).json({ message: "Mentor not found" });

    // Create new exam
    const exam = new Exam({
      mentor: mentorId,
      title,
      description,
      questions,
      assignedMentees
    });

    await exam.save();
    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all exams
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find().populate('mentor assignedMentees', 'user');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get an exam by ID
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('mentor assignedMentees', 'user');
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an exam
router.put('/:id', async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExam) return res.status(404).json({ message: "Exam not found" });

    res.json({ message: "Exam updated successfully", updatedExam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an exam
router.delete('/:id', async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndDelete(req.params.id);
    if (!deletedExam) return res.status(404).json({ message: "Exam not found" });

    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/mentee/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

        const mentee=await Mentee.findOne({user:userId})
        // console.log(mentee)
        const menteeId=mentee._id
    
      // Find exams where mentee is assigned
      const exams = await Exam.find({ assignedMentees: menteeId });

      if (exams.length === 0) {
        return res.status(404).json({ message: 'No exams found for this mentee.' });
      }
  
      res.status(200).json(exams);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }); 

// Submit Exam & Record Score
router.post('/submit/:examId', async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const exam = await Exam.findById(req.params.examId);

    const mentee=await Mentee.findOne({user:userId})
    
    const menteeId=mentee._id
    // console.log(menteeId)
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Check if mentee is assigned
    if (!exam.assignedMentees.includes(menteeId)) {
      return res.status(403).json({ message: "You are not assigned to this exam" });
    }
  
    let score = 0;
    exam.questions.forEach((q, index) => {
        console.log(q);
      if (answers[index] == q.correctAnswer) {
        console.log("Hi");
        score++;
      }
    });
    // console.log(score)

    // Update scores array
    exam.scores.push({ mentee: menteeId, score, totalMarks: exam.questions.length });
    await exam.save();

    res.json({ message: "Exam submitted successfully", score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/status/:examId/:userId', async (req, res) => {
    try {
      const { examId, userId } = req.params;
    
      const mentee = await Mentee.findOne({ user: userId });
      if (!mentee) return res.status(404).json({ message: "Mentee not found" });

      const exam = await Exam.findById(examId);
      if (!exam) return res.status(404).json({ message: "Exam not found" });
  
      const hasSubmitted = exam.scores.some(score => score.mentee.equals(mentee._id));
  
      res.json({ isCompleted: hasSubmitted });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;
