const express = require('express');
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/courses', authMiddleware, createCourse);            // Create course (requires auth)
router.get('/courses', getAllCourses);                            // Public - Get all courses
router.get('/courses/:id', getCourseById);                        // Public - Get single course
router.put('/courses/:id', authMiddleware, updateCourse);         // Update (requires auth)
router.delete('/courses/:id', authMiddleware, deleteCourse);      // Delete (requires auth)

module.exports = router;
