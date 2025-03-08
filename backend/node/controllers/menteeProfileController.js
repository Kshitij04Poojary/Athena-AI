const Mentee = require('../models/Mentee');

exports.getProfile = async (req, res) => {
    try {
        const mentee = await Mentee.findOne({ user: req.user.id })
            .populate('user', 'name email')
            .populate('mentor');
        
        if (!mentee) {
            return res.status(404).json({ message: 'Mentee profile not found' });
        }

        res.json(mentee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = {
            ...req.body,
            profileCompleted: true
        };

        // Validate required sections
        if (!updates.academics || !updates.futureGoals) {
            return res.status(400).json({ 
                message: 'Academics and future goals are required' 
            });
        }

        // Filter out empty arrays for optional sections
        if (updates.extracurricular?.length === 0) delete updates.extracurricular;
        if (updates.internships?.length === 0) delete updates.internships;
        if (updates.achievements?.length === 0) delete updates.achievements;

        const mentee = await Mentee.findOneAndUpdate(
            { user: req.user.id },
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('user', 'name email');

        if (!mentee) {
            return res.status(404).json({ message: 'Mentee not found' });
        }

        res.json(mentee);
    } catch (error) {
        res.status(400).json({ 
            message: 'Profile update failed', 
            error: error.message 
        });
    }
};

exports.editProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        // Ensure profileCompleted status isn't changed
        updates.profileCompleted = true;

        const mentee = await Mentee.findOneAndUpdate(
            { user: req.user.id },
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('user', 'name email');

        if (!mentee) {
            return res.status(404).json({ message: 'Mentee not found' });
        }

        res.json(mentee);
    } catch (error) {
        res.status(400).json({ 
            message: 'Profile edit failed', 
            error: error.message 
        });
    }
};
