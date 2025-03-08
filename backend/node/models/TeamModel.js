const mongoose = require('mongoose');


const TeamSchema = new mongoose.Schema({
    teamname: {
        type: String,
        required: true
    },
    teamCode: {
        type: String,
        required: true,
        unique: true
    }
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    mentee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentee'
    }],
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
    }]   
}, { timestamps: true });


const Team = mongoose.model('Team', TeamSchema);
module.exports = Team;
