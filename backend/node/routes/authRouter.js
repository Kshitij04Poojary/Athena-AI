const express = require('express');
const { register, login, getUserById } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', getUserById);

module.exports = router;
