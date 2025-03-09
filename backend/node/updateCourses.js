const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Course = require('./models/CourseModel');

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URL; // Use your actual MongoDB URL
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ Failed to connect to MongoDB', err));

const updateCourses = async () => {
    try {
        // Fetch all courses
        const courses = await Course.find({});

        // Loop through each course
        for (let course of courses) {
            let updated = false;

            // Loop through each chapter of the course
            for (let chapter of course.chapters) {
                // Check if `ppt` field exists, if not, add it
                if (chapter.ppt === undefined) {
                    chapter.ppt = "";  // Adding ppt as empty string
                    updated = true;
                }
            }

            // If any chapter was updated, save the course
            if (updated) {
                await course.save();
                console.log(`✅ Updated Course ID: ${course._id}`);
            }
        }

        console.log('🎉 All courses updated successfully');
        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Error updating courses:', err);
        mongoose.connection.close();
    }
};

updateCourses();
