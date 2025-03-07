const express = require('express');
const router = express.Router();
const mentorMenteeController = require('../controllers/mentorMenteeController');
const Mentor=require('../models/Mentor')
const Mentee = require("../models/Mentee");
const User = require("../models/UserModel");
const auth = require('../middleware/authMiddleware');

// Mentor routes
router.get('/mentor/mentees', auth, mentorMenteeController.getMentorMentees);
router.get('/mentor/:mentorId', auth, mentorMenteeController.getMentorDetails);

// Mentee routes
router.get('/mentee/mentor', auth, mentorMenteeController.getMenteeMentor);
router.get('/mentee/:menteeId', auth, mentorMenteeController.getMenteeDetails);

router.get("/mentees/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Find mentor by user ID (without populating)
        const mentor = await Mentor.findOne({ user: userId });
       
        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found or no assigned mentees" });
        }
        const menteeUserIds = mentor.mentees.map(mentee => mentee.toString());
        const menteeUsers = await User.find({ _id: { $in: menteeUserIds } }).select("name email");
        res.json({ mentees: menteeUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
