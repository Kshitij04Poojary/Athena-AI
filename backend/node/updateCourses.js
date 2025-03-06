const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./models/CourseModel');  // Adjust the path if needed

async function updateCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const result = await Course.updateMany(
            { passedFinal: { $exists: false } },  // Only update if field doesn't exist
            { $set: { passedFinal: false } }      // Default value
        );

        console.log(`Updated courses: ${result.modifiedCount}`);
        mongoose.disconnect();
    } catch (error) {
        console.error('Error updating courses:', error);
        mongoose.disconnect();
    }
}

updateCourses();
