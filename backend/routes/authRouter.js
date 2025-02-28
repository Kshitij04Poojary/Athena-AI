const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// New Profile Route - Protected
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
