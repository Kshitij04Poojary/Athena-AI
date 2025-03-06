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

module.exports = router;
