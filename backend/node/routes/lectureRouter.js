const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const auth = require('../middleware/authMiddleware');
const Lecture = require('../models/Lecture');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

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
// const {processTranscription}=require('../config/transcription')
// In your lectureRoutes.js (or similar)
router.put('/:id/recording', async (req, res) => {
    try {
        const lecture = await Lecture.findByIdAndUpdate(
            req.params.id,
            { recordingUrl: req.body.recordingUrl },
            { new: true }
        );
        // processTranscription(lecture);
        res.json(lecture);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update recording' });
    }
});
router.put('/:id/transcript', async (req, res) => {
    try {
        const lecture = await Lecture.findByIdAndUpdate(
            req.params.id,
            { transcriptPdfUrl: req.body.transcriptPdfUrl },
            { new: true }
        );
        // processTranscription(lecture);
        res.json(lecture);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update recording' });
    }
});

router.get('/mentees/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the mentor using the userId
        const mentor = await Mentor.findOne({ user: userId })
            .populate({
                path: 'mentees',
                populate: {
                    path: 'user', // Populating the 'user' field within the mentee model
                    select: 'name' // Select only the name field of the user
                }
            });

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        // Create an array of objects containing both name and mentee ID
        const menteeDetails = mentor.mentees.map(mentee => ({
            id: mentee._id,  // Mentee's unique ID
            name: mentee.user.name  // Mentee's name
        }));

        res.status(200).json(menteeDetails);
    } catch (error) {
        console.error('Error fetching mentees:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// ✅ Create a new lecture with attendance
router.post('/create', async (req, res) => {
    const { title, startTime, duration, roomId, mentorId, attendanceList } = req.body;

    if (!title || !startTime || !mentorId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newLecture = new Lecture({
            title,
            startTime,
            duration,
            status: 'completed',
            roomId,
            mentor: mentorId,
            attendance: attendanceList.map(studentId => ({ student: studentId })) // Ensure each student ID is correctly referenced here
        });

        await newLecture.save();
        res.status(201).json({ message: 'Lecture created successfully', lecture: newLecture });
    } catch (error) {
        console.error('Error creating lecture:', error);
        res.status(500).json({ message: 'Failed to create lecture' });
    }
});


module.exports = router;