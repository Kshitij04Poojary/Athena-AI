const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const auth = require('../middleware/authMiddleware');

router.post('/schedule', auth, lectureController.scheduleLecture);
router.get('/mentor', auth, lectureController.getMentorLectures);
router.get('/student', auth, lectureController.getStudentLectures);
router.put('/status', auth, lectureController.updateLectureStatus);
router.get('/live', auth, lectureController.getLiveLectures);
router.get('/room/:roomId', auth, lectureController.getLectureByRoomId);

// Chat Routes
router.get('/:roomId/chat', auth, lectureController.getLectureChat);
router.post('/:roomId/chat', auth, lectureController.addChatMessage);

// Status Update Route
router.put('/:id/status', auth, lectureController.updateLectureStatus1);

// Update Recording and Transcript URLs
router.put('/:id/recording', auth, async (req, res) => {
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

router.put('/:id/transcript', auth, async (req, res) => {
    try {
        const lecture = await Lecture.findByIdAndUpdate(
            req.params.id,
            { transcriptPdfUrl: req.body.transcriptPdfUrl },
            { new: true }
        );
        res.json(lecture);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update transcript' });
    }
});

// Get Mentees of a Mentor
router.get('/mentees/:userId', auth, async (req, res) => {
    try {
        const mentor = await User.findOne({ _id: req.params.userId, userType: 'Mentor' })
            .populate({
                path: 'mentees',
                select: 'name _id'
            });

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.status(200).json(mentor.mentees);
    } catch (error) {
        console.error('Error fetching mentees:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a New Lecture with Attendance
router.post('/create', auth, async (req, res) => {
    const { title, startTime, duration, roomId, attendanceList } = req.body;
    const mentorId = req.user.id;

    if (!title || !startTime) {
        return res.status(400).json({ error: 'Title and Start Time are required' });
    }

    try {
        const newLecture = new Lecture({
            title,
            startTime,
            duration,
            status: 'scheduled',
            roomId,
            mentor: mentorId,
            students: attendanceList.map(studentId => studentId)
        });

        await newLecture.save();
        res.status(201).json({ message: 'Lecture created successfully', lecture: newLecture });
    } catch (error) {
        console.error('Error creating lecture:', error);
        res.status(500).json({ message: 'Failed to create lecture' });
    }
});

module.exports = router;
