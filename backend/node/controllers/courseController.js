const Course = require('../models/CourseModel');
const User = require('../models/UserModel');

// Create Course and Link to User
exports.createCourse = async (req, res) => {
    try {
        const { chapters } = req.body;

        if (chapters && chapters.length > 5) {
            return res.status(400).json({ message: 'A course can have a maximum of 5 chapters only.' });
        }

        const userId = req.user.id; // From authMiddleware

        const course = new Course(req.body);
        await course.save();

        // ✅ Only push course's ObjectId to user's courses array
        await User.findByIdAndUpdate(
            userId,
            { $push: { courses: course._id } },  // Only ObjectId stored
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
        const userId = req.user.id; // From authMiddleware

        // Fetch only courses linked to this user
        const user = await User.findById(userId).populate('courses'); // Assuming `courses` is an array of ObjectIds in UserModel

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.courses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
    }
};

// Get Single Course
exports.getCourseById = async (req, res) => {
    try {
        const userId = req.user.id; // From authMiddleware
        const courseId = req.params.id;

        // Find the user and check if the course exists in their courses array
        const user = await User.findById(userId).populate({
            path: 'courses',
            match: { _id: courseId } // Only match the specific course
        });

        if (!user || user.courses.length === 0) {
            return res.status(404).json({ message: 'Course not found for this user' });
        }

        // course will be in user.courses[0] if found
        res.status(200).json(user.courses[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch course', error: error.message });
    }
};

//// Update Course
exports.updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const updateData = req.body;

    try {
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error });
    }
};


// Update Chapter
exports.updateChapter = async (req, res) => {
    try {
        const { courseId, chapterId } = req.params;
        const userId = req.user.id;  // From authMiddleware

        // Find the user and check if they own this course
        const user = await User.findById(userId).populate({
            path: 'courses',
            match: { _id: courseId }  // Check if this course exists for this user
        });

        if (!user || user.courses.length === 0) {
            return res.status(404).json({ message: 'Course not found for this user' });
        }

        const course = user.courses[0];  // The matched course
        const chapter = course.chapters.id(chapterId);

        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Update the chapter fields with req.body
        Object.assign(chapter, req.body);

        await course.save();

        res.status(200).json({ message: 'Chapter updated successfully', chapter });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update chapter', error: error.message });
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

// Chapter by ID
exports.getChapterById = async (req, res) => {
    try {
        const { courseId, chapterId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const chapter = course.chapters.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        res.status(200).json(chapter);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch chapter', error: error.message });
    }
};

// Section By ID
exports.getSectionById = async (req, res) => {
    try {
        const { courseId, chapterId, sectionId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const chapter = course.chapters.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const section = chapter.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        res.status(200).json(section);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch section', error: error.message });
    }
};

