const express = require('express');
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateChapter,
    deleteCourse,
    getChapterById,
    getSectionById
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const Mentor=require('../models/Mentor')
const Course=require('../models/CourseModel')
const Mentee=require('../models/Mentee')

const router = express.Router();

router.post('/create-courses', authMiddleware, createCourse);            // Create course (requires auth)
router.get('/courselist', authMiddleware, getAllCourses);                            // Public - Get all courses
router.get('/:id', authMiddleware, getCourseById);                        // Public - Get single course
router.put('/:courseId/chapters/:chapterId', authMiddleware, updateChapter);         // Update (requires auth)
router.delete('/:id', authMiddleware, deleteCourse);      // Delete (requires auth)
router.get('/:courseId/chapters/:chapterId', getChapterById);
router.get('/:courseId/chapters/:chapterId/sections/:sectionId', getSectionById);

router.post('/assign', async (req, res) => {
    try {
        const { mentorId, menteeIds, courseId } = req.body; // Accept multiple menteeIds as an array

        // Ensure mentor exists
        const mentor = await Mentor.findById({user:mentorId});
        console.log(mentor)
        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found." });
        }
        
        // Ensure course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }

        // Validate each menteeId
        const mentees = await Mentee.find({ _id: { $in: menteeIds } });
        if (mentees.length !== menteeIds.length) {
            return res.status(404).json({ error: "One or more mentees not found." });
        }

        // Assign mentees to the course, avoiding duplicates
        menteeIds.forEach(menteeId => {
            if (!course.assignedMentees.includes(menteeId)) {
                course.assignedMentees.push(menteeId);
            }
        });

        course.assignedMentor = mentorId; // Assuming only one mentor per course

        await course.save();

        res.status(200).json({ message: "Course assigned successfully to mentees", course });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
