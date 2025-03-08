const express = require('express');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

const router = express.Router();

router.post('/assign-mentee', async (req, res) => {
    try {
        const { mentorId, menteeId } = req.body;

        // Check if mentor exists
        const mentor = await Mentor.findOne({user:mentorId});
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        // Check if mentee exists
        const mentee = await Mentee.findOne({user:menteeId});
        if (!mentee) {
            return res.status(404).json({ message: 'Mentee not found' });
        }

        // Check if the mentee is already assigned to the mentor
        if (mentor.mentees.includes(menteeId)) {
            return res.status(400).json({ message: 'Mentee is already assigned to this mentor' });
        }

        // Assign the mentee to the mentor
        mentor.mentees.push(menteeId);
        await mentor.save();

        // Update the mentee's mentor field
        mentee.mentor = mentorId;
        await mentee.save();

        res.status(200).json({ message: 'Mentee assigned successfully', mentor, mentee });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
