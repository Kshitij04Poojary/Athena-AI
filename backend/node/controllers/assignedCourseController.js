const AssignedCourse = require('../models/AssignedCourseModel');
const Course = require('../models/CourseModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose');

// Create Assigned Course
const createAssignedCourse = async (req, res) => {
    try {
        const { mentor, assigns, orgCourseId, dueDate } = req.body;

        const assignedCourse = new AssignedCourse({
            mentor,
            assigns,
            orgCourseId,
            dueDate
        });

        await assignedCourse.save();
        res.status(201).json({ message: 'Assigned Course created successfully', assignedCourse });
    } catch (error) {
        res.status(500).json({ message: 'Error creating assigned course', error });
    }
};

// Get All Assigned Courses
const getAllAssignedCourses = async (req, res) => {
    try {
        const assignedCourses = await AssignedCourse.find().populate('assigns.menteeId assigns.courseCopy orgCourseId');
        res.json(assignedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned courses', error });
    }
};

// Get Assigned Course by ID
const getAssignedCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const assignedCourse = await AssignedCourse.findById(id).populate('assigns.menteeId assigns.courseCopy orgCourseId');
        if (!assignedCourse) return res.status(404).json({ message: 'Assigned Course not found' });
        res.json(assignedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned course', error });
    }
};

// Add Mentee Assignment (Add a new mentee and duplicated course to existing assignedCourse)
const addMenteeToAssignedCourse = async (req, res) => {
    try {
        const { assignedCourseId } = req.params;
        const { menteeId, orgCourseId } = req.body;

        console.log('Fetching original course:', orgCourseId);
        const originalCourse = await Course.findById(orgCourseId);
        if (!originalCourse) {
            console.log('Original course not found');
            return res.status(404).json({ message: 'Original Course not found' });
        }

        console.log('Original Course found:', originalCourse);

        const duplicatedCourse = new Course(originalCourse.toObject());
        duplicatedCourse._id = new mongoose.Types.ObjectId();
        duplicatedCourse.isNew = true;  // Critical step
        console.log('Saving duplicated course...');
        await duplicatedCourse.save();

        console.log('Duplicated course saved:', duplicatedCourse._id);

        await User.findByIdAndUpdate(
            menteeId,
            { $push: { courses: duplicatedCourse._id } },
            { new: true }
        );

        const updatedAssignedCourse = await AssignedCourse.findByIdAndUpdate(
            assignedCourseId,
            { $push: { assigns: { menteeId, courseCopy: duplicatedCourse._id } } },
            { new: true }
        ).populate('assigns.menteeId assigns.courseCopy orgCourseId');

        console.log('Mentee added successfully');
        res.json({ message: 'Mentee added with new course copy', updatedAssignedCourse });

    } catch (error) {
        console.error('🔥 Error adding mentee:', error.message, error.stack);
        res.status(500).json({ message: 'Error adding mentee', error: error.message });
    }
};


const getAssignedCourseByOrgCourse = async (req, res) => {
    try {
        const { orgCourseId } = req.params;
        const assignedCourse = await AssignedCourse.findOne({ orgCourseId });

        if (!assignedCourse) {
            return res.status(404).json({ message: 'Assigned Course not found' });
        }

        res.json({ assignedCourse });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned course', error });
    }
};

const getAssignedCoursesForMentee = async (req, res) => {
    try {
        const { menteeId } = req.params;

        const assignedCourses = await AssignedCourse.find({
            'assigns.menteeId': menteeId
        }).populate('assigns.courseCopy');

        const filteredCourses = [];

        assignedCourses.forEach(assignedCourse => {
            const assignEntry = assignedCourse.assigns.find(assign => assign.menteeId.toString() === menteeId);

            if (assignEntry && assignEntry.courseCopy) {
                const courseData = {
                    _id: assignEntry.courseCopy._id,
                    courseName: assignEntry.courseCopy.courseName,
                    description: assignEntry.courseCopy.description,
                    skills: assignEntry.courseCopy.skills,
                    level: assignEntry.courseCopy.level,
                    passedFinal: assignEntry.courseCopy.passedFinal,  // Added
                    assignedDate: assignedCourse.updatedAt,
                    mentor: assignedCourse.mentor
                };
                filteredCourses.push(courseData);
            }
        });

        res.status(200).json({ courses: filteredCourses });
    } catch (error) {
        console.error('Error fetching assigned courses for mentee:', error);
        res.status(500).json({ message: 'Failed to fetch assigned courses.' });
    }
};

// Set due date
const setDueDate = async (req, res) => {
    const { dueDate } = req.body;
    try {
        const assignedCourse = await AssignedCourse.findByIdAndUpdate(
            req.params.assignedCourseId,
            { dueDate },
            { new: true }
        );
        res.json({ message: 'Due date set', assignedCourse });
    } catch (error) {
        res.status(500).json({ error: 'Failed to set due date' });
    }
};


// Delete Assigned Course
const deleteAssignedCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await AssignedCourse.findByIdAndDelete(id);
        res.json({ message: 'Assigned Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assigned course', error });
    }
};

// List Assigned Courses for Specific Mentor
const getCoursesByMentor = async (req, res) => {
    try {
        const { mentor } = req.params;
        const assignedCourses = await AssignedCourse.find({ mentor }).populate('assigns.menteeId assigns.courseCopy orgCourseId');
        res.json(assignedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentor courses', error });
    }
};

module.exports = {
    createAssignedCourse,
    getAllAssignedCourses,
    getAssignedCourseById,
    addMenteeToAssignedCourse,
    deleteAssignedCourse,
    getCoursesByMentor,
    getAssignedCourseByOrgCourse,
    getAssignedCoursesForMentee, 
    setDueDate
};
