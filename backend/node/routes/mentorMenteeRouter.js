const express = require('express');
const router = express.Router();
const mentorMenteeController = require('../controllers/mentorMenteeController');
const auth = require('../middleware/authMiddleware');

// Mentor routes
router.get('/mentor/mentees', auth, mentorMenteeController.getMentorMentees);
router.get('/mentor/:mentorId', auth, mentorMenteeController.getMentorDetails);

// Mentee routes
router.get('/mentee/mentor', auth, mentorMenteeController.getMenteeMentor);
router.get('/mentee/:menteeId', auth, mentorMenteeController.getMenteeDetails);

module.exports = router;
