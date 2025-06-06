const express = require('express');
const { 
    register,
    login,
    getUserById,
    updateUser    
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Existing user routes
router.get('/:id', authMiddleware, getUserById);
router.patch('/:id', authMiddleware, updateUser);

module.exports = router;
