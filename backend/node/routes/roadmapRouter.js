const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');

router.post('/generate', roadmapController.createRoadmap);
router.get('/user/:userId', roadmapController.getRoadmapsByUser);
router.get('/:roadmapId', roadmapController.getRoadmapById);

module.exports = router;
