const mongoose = require('mongoose');
const User = require('./models/UserModel'); // Adjust this path to where your User model is located
require('dotenv').config();

async function addMissingFields() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const result = await User.updateMany(
            {}, 
            { 
                $set: { 
                    phoneNumber: null,
                    github: '',
                    linkedin: ''
                } 
            }
        );

        console.log(`Updated ${result.modifiedCount} users with missing fields.`);
    } catch (error) {
        console.error('Error updating users:', error);
    } finally {
        await mongoose.disconnect();
    }
}

addMissingFields();
