const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

exports.register = async (req, res) => {
    try {
        const { name, email, password, userType, ...rest } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        let role = '';
        if (userType === 'Student') {
            role = 'mentee';
        } else if (userType === 'Mentor') {
            role = 'mentor';
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            userType,
            role,
            ...rest
        });

        await user.save();

        if (role === 'mentor') {
            const mentor = new Mentor({
                user: user._id
            });
            await mentor.save();
        }

        if (role === 'mentee') {
            const mentee = new Mentee({
                user: user._id
            });
            await mentee.save();
        }

        res.status(201).json({
            message: 'User registered successfully',
            user
        });

    } catch (err) {
        console.error('❌ Error in Registration:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ token, user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

