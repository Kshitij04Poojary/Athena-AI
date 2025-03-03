const Course = require('../models/CourseModel');
const User = require('../models/UserModel');

// Create Course and Link to User
exports.createCourse = async (req, res) => {
    try {
        const { chapters } = req.body;

        if (chapters && chapters.length > 5) {
            return res.status(400).json({ message: 'A course can have a maximum of 5 chapters only.' });
        }

        const userId = req.user.id; // Extracted from authMiddleware

        const course = new Course(req.body);
        await course.save();

        // Link course to user (any user can create a course)
        await User.findByIdAndUpdate(
            userId,
            { $push: { courses: course._id } },
            { new: true }
        );

        res.status(201).json({ message: 'Course created successfully', course });

    } catch (error) {
        res.status(500).json({ message: 'Failed to create course', error: error.message });
    }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
    }
};

// Get Single Course
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch course', error: error.message });
    }
};

// Update Course
exports.updateCourse = async (req, res) => {
    try {
        const { chapters } = req.body;

        if (chapters && chapters.length > 5) {
            return res.status(400).json({ message: 'A course can have a maximum of 5 chapters only.' });
        }

        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update course', error: error.message });
    }
};

// Delete Course and Remove from User
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Remove course from all users' `courses` array
        await User.updateMany(
            { courses: course._id },
            { $pull: { courses: course._id } }
        );

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete course', error: error.message });
    }
};
