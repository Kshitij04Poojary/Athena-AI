const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const auth = require('../middleware/authMiddleware');
const Lecture = require('../models/Lecture');

router.post('/schedule', auth, lectureController.scheduleLecture);
router.get('/mentor', auth, lectureController.getMentorLectures);
router.get('/mentee', auth, lectureController.getMenteeLectures);
router.put('/status', auth, lectureController.updateLectureStatus);
router.get('/live',auth, lectureController.getLiveLectures);
router.get('/room/:roomId', auth, lectureController.getLectureByRoomId);
// Update chat routes
router.get('/:roomId/chat', auth, lectureController.getLectureChat);
router.post('/:roomId/chat', auth, lectureController.addChatMessage);
router.put('/:id/status', auth, lectureController.updateLectureStatus1);
// In your lectureRoutes.js (or similar)
router.put('/:id/recording', async (req, res) => {
    try {
        const lecture = await Lecture.findByIdAndUpdate(
            req.params.id,
            { recordingUrl: req.body.recordingUrl },
            { new: true }
        );
        res.json(lecture);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update recording' });
    }
});

router.get('/mentees/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the mentor using the userId
        const mentor = await Mentor.findOne({ user: userId }).populate('mentees');
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.status(200).json(mentor.mentees);
    } catch (error) {
        console.error('Error fetching mentees:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ✅ Create a new lecture with attendance
router.post('/create', async (req, res) => {
    const { title, startTime, duration, mentorId, attendanceList } = req.body;

    if (!title || !startTime || !mentorId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newLecture = new Lecture({
            title,
            startTime,
            duration,
            mentor: mentorId,
            attendance: attendanceList.map(studentId => ({ student: studentId }))
        });

        await newLecture.save();
        res.status(201).json({ message: 'Lecture created successfully', lecture: newLecture });
    } catch (error) {
        console.error('Error creating lecture:', error);
        res.status(500).json({ message: 'Failed to create lecture' });
    }
});


module.exports = router;