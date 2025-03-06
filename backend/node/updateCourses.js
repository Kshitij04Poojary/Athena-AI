const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Assessment = require('./models/AssessmentModel');  // Adjust path if needed

async function updateAssessments() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const result = await Assessment.updateMany(
            { course: { $exists: false } },  // Only update if field doesn't exist
            { $set: { course: null } }       // Set new field to null
        );

        console.log(`Updated assessments: ${result.modifiedCount}`);
        mongoose.disconnect();
    } catch (error) {
        console.error('Error updating assessments:', error);
        mongoose.disconnect();
    }
}

updateAssessments();
