const Lecture = require('../models/Lecture');
const User = require('../models/UserModel');

exports.scheduleLecture = async (req, res) => {
    try {
        const { title, startTime, duration } = req.body;
        const mentorId = req.user.id;

        // Get mentor document
        const mentor = await User.findById(mentorId);
        if (!mentor || mentor.userType !== 'Mentor') {
            return res.status(400).json({ message: 'Mentor not found' });
        }

        const roomId = `lecture-${Date.now()}-${mentorId}`;

        const lecture = new Lecture({
            title,
            mentor: mentor._id,
            students: mentor.mentees,
            startTime,
            duration,
            roomId,
            status: 'scheduled'
        });

        const savedLecture = await lecture.save();
        const populatedLecture = await Lecture.findById(savedLecture._id)
            .populate('mentor')
            .populate('students');

        res.status(201).json(populatedLecture);
    } catch (error) {
        console.error('Error in scheduleLecture:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getMentorLectures = async (req, res) => {
    try {
        const mentor = await User.findById(req.user.id);
        if (!mentor || mentor.userType !== 'Mentor') {
            return res.status(400).json({ message: 'Mentor not found' });
        }
        const lectures = await Lecture.find({ mentor: mentor._id })
            .populate({ path: 'students' })
            .populate({ path: 'attendance' })
            .sort({ startTime: 1 });
        res.json(lectures);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentLectures = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        if (!student || student.userType !== 'Student') {
            return res.status(400).json({ message: 'Student not found' });
        }
        const lectures = await Lecture.find({ students: student._id })
            .populate('mentor')
            .sort({ startTime: 1 });
        res.json(lectures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLectureStatus = async (req, res) => {
    try {
        const { lectureId, status } = req.body;
        const lecture = await Lecture.findById(lectureId).populate('mentor').populate('students');

        if (status === 'ongoing') {
            const io = req.app.get('io');
            const populatedLecture = await Lecture.findById(lectureId).populate('mentor').populate('students');
            const notificationData = {
                lectureId: populatedLecture._id,
                roomId: populatedLecture.roomId,
                title: populatedLecture.title,
                mentorName: populatedLecture.mentor.name,
                startTime: new Date().toISOString()
            };
            populatedLecture.students.forEach(student => {
                io.to(`user_${student._id}`).emit('lecture_started', notificationData);
            });
        }
        const updatedLecture = await Lecture.findByIdAndUpdate(
            lectureId,
            { status },
            { new: true }
        );
        res.json(updatedLecture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLectureChat = async (req, res) => {
    try {
        const lecture = await Lecture.findOne({ roomId: req.params.roomId }).populate('chat.user');
        res.json(lecture.chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addChatMessage = async (req, res) => {
    try {
        const lecture = await Lecture.findOne({ roomId: req.params.roomId });
        const newMessage = {
            user: req.user.id,
            message: req.body.message,
            timestamp: new Date()
        };
        lecture.chat.push(newMessage);
        await lecture.save();
        const io = req.app.get('io');
        io.to(req.params.roomId).emit('chat_message', await Lecture.populate(newMessage, { path: 'user' }));
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLiveLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({ status: 'ongoing' })
            .populate('mentor')
            .select('title roomId startTime');
        res.json(lectures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLectureByRoomId = async (req, res) => {
    try {
        const lecture = await Lecture.findOne({ roomId: req.params.roomId })
            .populate('mentor')
            .populate('students');
        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }
        const userId = req.user.id;
        const isMentor = lecture.mentor._id.toString() === userId;
        const isStudent = lecture.students.some(s => s._id.toString() === userId);
        if (!isMentor && !isStudent) {
            return res.status(403).json({ message: 'Not authorized to access this lecture' });
        }
        res.json(lecture);
    } catch (error) {
        console.error('Error in getLectureByRoomId:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateLectureStatus1 = async (req, res) => {
    try {
        const { status } = req.body;
        const lecture = await Lecture.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('mentor').populate('students');
        if (status === 'completed') {
            await lecture.save();
        }
        res.status(200).json(lecture);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
