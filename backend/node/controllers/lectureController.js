const Lecture = require('../models/Lecture');
const User = require('../models/UserModel');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

exports.scheduleLecture = async (req, res) => {
    try {
        const { title, startTime, duration } = req.body;
        const mentorId = req.user.id;

        // Get mentor document
        const mentor = await Mentor.findOne({ user: mentorId });
        if (!mentor) {
            return res.status(400).json({ message: 'Mentor not found' });
        }

        const roomId = `lecture-${Date.now()}-${mentorId}`;

        const lecture = new Lecture({
            title,
            mentor: mentor._id, // Use mentor document ID, not user ID
            mentee: mentor.mentees,
            startTime,
            duration,
            roomId,
            status: 'scheduled'
        });

        const savedLecture = await lecture.save();
        
        // Populate the saved lecture for response
        const populatedLecture = await Lecture.findById(savedLecture._id)
            .populate('mentor')
            .populate('mentee');

        res.status(201).json(populatedLecture);
    } catch (error) {
        console.error('Error in scheduleLecture:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getMentorLectures = async (req, res) => {
    try {
        const mentor= await Mentor.findOne({ user: req.user.id });
        const lectures = await Lecture.find({ mentor: mentor._id })
        .populate({
          path: 'mentee',
          populate: { path: 'user' }
        })
        .populate('mentor')
        .sort({ startTime: 1 });
        console.log(lectures);
        res.json(lectures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMenteeLectures = async (req, res) => {
    try {
        const mentee= await Mentee.findOne({ user: req.user.id });
        const lectures = await Lecture.find({ mentee: mentee._id })
        .populate({
            path: 'mentor',
            populate: { path: 'user' }
        })
        .sort({ startTime: 1 });
        console.log(lectures);
        res.json(lectures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLectureStatus = async (req, res) => {
    try {
      const { lectureId, status } = req.body;
      const lecture = await Lecture.findById(lectureId)
        .populate('mentor.user')
        .populate('mentee.user');
  
        if (status === 'ongoing') {
            const io = req.app.get('io');
            const populatedLecture = await Lecture.findById(lectureId)
              .populate({
                path: 'mentor',
                populate: { path: 'user' }
              })
              .populate('mentee');
          
            const notificationData = {
              lectureId: populatedLecture._id,
              roomId: populatedLecture.roomId,
              title: populatedLecture.title,
              mentorName: populatedLecture.mentor.user.name,
              startTime: new Date().toISOString()
            };
          
            populatedLecture.mentee.forEach(mentee => {
              io.to(`user_${mentee.user}`).emit('lecture_started', notificationData);
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
      const lecture = await Lecture.findOne({ roomId: req.params.roomId })
        .populate('chat.user');
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
        console.log("Live Lectures",lectures);
      res.json(lectures);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
exports.getLectureByRoomId = async (req, res) => {
    try {
        const lecture = await Lecture.findOne({ roomId: req.params.roomId })
         .populate('mentor')
            .populate('mentee')
            .exec();
        console.log(lecture);
        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Check if user is authorized to access this lecture
        const userId = req.user.id;
        const isMentor = lecture.mentor.user.toString() === userId;
        const isMentee = lecture.mentee.some(m => m.user.toString() === userId);

        if (!isMentor && !isMentee) {
            return res.status(403).json({ message: 'Not authorized to access this lecture' });
        }

        res.json(lecture);
    } catch (error) {
        console.error('Error in getLectureByRoomId:', error);
        res.status(500).json({ message: error.message });
    }
};
// lectureController.js
exports.updateLectureStatus1 = async (req, res) => {
    try {
      const { status } = req.body;
      const lecture = await Lecture.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate('mentor').populate('mentee');
      console.log(lecture);
  
      if (status === 'completed') {
        // Add Zego room data if needed
        lecture.recordingUrl = `zego-recording-url-${lecture.roomId}`;
        await lecture.save();
      }
  
      res.status(200).json(lecture);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: error.message });
    }
  };