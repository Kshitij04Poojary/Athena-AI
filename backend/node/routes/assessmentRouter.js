const express = require("express");
const router = express.Router();
const Assessment = require("../models/AssessmentModel");
const User = require("../models/UserModel");
const { generateExamModel } = require("../config/AIModel"); 

router.post("/generate", async (req, res) => {
  try {
    const { userId, topic } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const airesponse = await generateExamModel.sendMessage(
      `Generate Exam on topic : ${topic} with Question and Options along with correct answer in JSON format with difficulty level high but not very long questions and no need for difficulty key, (Give 10)`
    );
 
    const examQuestions = JSON.parse(airesponse.response.text());
    console.log(examQuestions);

    const newAssessment = new Assessment({
      user: userId,
      topic,
      questions: examQuestions
    });

    await newAssessment.save();
    res.status(201).json(newAssessment);
  } catch (error) {
    res.status(500).json({ message: "Error generating exam", error });
  }
});

router.patch("/:examId", async (req, res) => {
  try {
    const { score } = req.body;
    const { examId } = req.params;

    const updatedExam = await Assessment.findByIdAndUpdate(
      examId,
      { score: score },
      { new: true }
    );
    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ message: "Score updated successfully", exam: updatedExam });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:examId", async (req, res) => {
  try {
    const { examId } = req.params;
    const assessment = await Assessment.findById(examId);
    
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    res.json(assessment); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
