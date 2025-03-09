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

        // Find the mentor by user ID
        const mentor = await Mentor.findOne({ user: userId });

        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found or no assigned mentees" });
        }

        // Find all mentees assigned to the mentor and populate the user details (name, email)
        const menteeUsers = await Mentee.find({ _id: { $in: mentor.mentees } })
            .populate("user", "name email") // Populate the 'user' field and fetch 'name' and 'email'
            .select("user"); // Only return the populated user field

        res.json({ mentees: menteeUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});



module.exports = router;
