const express = require('express');
const router = express.Router();
const team = require('../controllers/teamController');

router.post('/create-team', team.createTeam);
router.get('/', team.getTeams);
router.get('/latest-lectures', team.getAllTeamsWithLatestLecture);

module.exports = router;