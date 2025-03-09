const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const User = require('../models/UserModel');

// Mentor Controllers
exports.getMentorMentees = async (req, res) => {
    try {
        console.log(req.user.id);
        const mentor = await Mentor.findOne({ user: req.user.id })
           

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }
        // console.log(mentor);
        res.json(mentor.mentees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMentorDetails = async (req, res) => {
    try {
        const mentor = await Mentor.findOne({ user: req.params.mentorId })
            .populate('user', 'name email userType skills courses achievements')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'mentee',
                    select: 'name'
                }
            });

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.json(mentor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mentee Controllers
exports.getMenteeMentor = async (req, res) => {
    try {
        const mentee = await Mentee.findOne({ user: req.user.id })
            .populate({
                path: 'mentor',
                populate: {
                    path: 'user',
                    select: 'name email userType skills courses achievements'
                }
            });

        if (!mentee || !mentee.mentor) {
            return res.status(404).json({ message: 'Mentor not found for this mentee' });
        }

        res.json(mentee.mentor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMenteeDetails = async (req, res) => {
    try {
        const mentee = await Mentee.findOne({ user: req.params.menteeId })
            .populate('user', 'name email userType skills courses careerGoals')
            .populate({
                path: 'mentor',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            });

        if (!mentee) {
            return res.status(404).json({ message: 'Mentee not found' });
        }

        res.json(mentee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
