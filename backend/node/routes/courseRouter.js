const express = require('express');
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    updateChapter,
    deleteCourse,
    getChapterById,
    getSectionById,
    updateCourseLayout, 
    updateChapterLayout
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create-courses', authMiddleware, createCourse);            // Create course (requires auth)
router.get('/courselist', authMiddleware, getAllCourses);                            // Public - Get all courses
router.get('/:id', authMiddleware, getCourseById);                        // Public - Get single course
router.put('/:courseId/chapters/:chapterId', authMiddleware, updateChapter);         // Update (requires auth)
router.put('/:courseId', updateCourse);
router.delete('/:id', authMiddleware, deleteCourse);      // Delete (requires auth)
router.get('/:courseId/chapters/:chapterId', getChapterById);
router.get('/:courseId/chapters/:chapterId/sections/:sectionId', getSectionById);


module.exports = router;
