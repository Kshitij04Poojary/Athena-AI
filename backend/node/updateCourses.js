const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Course = require('./models/CourseModel');
const AssignedCourse = require('./models/AssignedCourseModel');

const MONGO_URI = process.env.MONGO_URL;

const runFix = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Step 1: Get all courses that are courseCopies in AssignedCourse
        const assignedCourses = await AssignedCourse.find().populate('assigns.courseCopy');

        // Step 2: Extract all courseCopy IDs that have been duplicated
        const courseCopyIds = assignedCourses.flatMap(ac =>
            ac.assigns.map(assign => assign.courseCopy._id.toString())
        );

        console.log(`Found ${courseCopyIds.length} duplicated courses.`);

        // Step 3: Update those courses to have assignedCopy: true
        const result = await Course.updateMany(
            { _id: { $in: courseCopyIds } },
            { $set: { assignedCopy: true } }
        );

        console.log(`Updated ${result.modifiedCount} duplicated courses to have assignedCopy: true`);

        mongoose.connection.close();
    } catch (err) {
        console.error('🔥 Error fixing duplicate courses:', err);
        mongoose.connection.close();
    }
};

runFix();
