const express = require('express');
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
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
router.post('/assign/:courseId', async (req, res) => {
    try {
        const { mentorId, menteeIds } = req.body; // Accept multiple menteeIds as an array
        const {courseId}=req.params
        
        const mentor = await Mentor.findOne({ user: mentorId }); 
       
        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found." });
        }
        
        // Ensure course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }

        // Validate each menteeId
        const mentees = await Mentee.find({ user: { $in: menteeIds } });
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
router.get('/assigned-courses/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the mentee document based on userId
        const mentee = await Mentee.findOne({ user: userId });
        if (!mentee) {
            return res.status(404).json({ message: 'Mentee not found' });
        }
        const courses = await Course.find({ assignedMentees: mentee.user });

        res.status(200).json({ courses });
    } catch (error) {
        console.error('Error fetching assigned courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/get-assigned/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find course by ID
        const course = await Course.findById(courseId)
            .populate('assignedMentees', 'user') // Populate assigned mentees if needed
            .populate('assignedMentor', 'name'); // Populate mentor if needed

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ course });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:id', authMiddleware, getCourseById);                        // Public - Get single course
router.put('/:courseId/chapters/:chapterId', authMiddleware, updateChapter);         // Update (requires auth)
router.put('/:courseId', updateCourse);
router.delete('/:id', authMiddleware, deleteCourse);      // Delete (requires auth)
router.get('/:courseId/chapters/:chapterId', getChapterById);
router.get('/:courseId/chapters/:chapterId/sections/:sectionId', getSectionById);

module.exports = router;
