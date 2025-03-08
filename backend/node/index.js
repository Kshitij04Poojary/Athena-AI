const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const connectDB = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/authRouter');
const courseRoutes = require('./routes/courseRouter');
const assessmentRoutes = require('./routes/assessmentRouter');
const generateCourseRoutes = require('./routes/generateCourseRouter');
const generateChapterContentRoutes = require('./routes/generateChapterContentRouter');
const interviewRoutes = require('./routes/interviewRouter');
const lectureRoutes = require('./routes/lectureRouter');
const mentorMenteeRouter = require('./routes/mentorMenteeRouter');
const menteeProfileRouter = require('./routes/menteeProfileRouter');

const assignmentRouter=require('./routes/assignmentRouter')
const assignedCourseRouter = require('./routes/assignedCourseRouter');
const chatbotRouter=require('./routes/chatbotRouter')

const Lecture = require('./models/Lecture');
const User = require('./models/UserModel');
const Mentor = require('./models/Mentor');
const Mentee = require('./models/Mentee');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));


// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api', generateCourseRoutes);
app.use('/api', generateChapterContentRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/users', mentorMenteeRouter);
app.use('/api/mentee', menteeProfileRouter);
app.use('/api/assign',assignmentRouter);
app.use('/api/assigned',assignedCourseRouter);
app.use('/api',chatbotRouter)

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
    credentials: true
  }
});

// Make io available throughout the app
app.set('io', io);

// Socket Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    socket.user = decoded;
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Track active users in memory
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);

  socket.on('register', ({ userId, role, name }) => {
    console.log('Registering user:', { userId, role, name, socketId: socket.id });
    connectedUsers.set(socket.id, { userId, role, name, socketId: socket.id });
    console.log('Connected users:', Array.from(connectedUsers.values()));
  });

  // Handle user leaving a lecture
  socket.on('leave_lecture', async ({ roomId, role, userId }) => {
    console.log(userId, "Left lecture");
    if (role === 'mentee') {
      try {
        const mentee = await Mentee.findOne({ user: userId }); // Fix: Using `findOne` instead of `find`
        if (mentee) {
          await Lecture.findOneAndUpdate(
            { roomId: roomId },
            { $push: { attendance: { student: mentee._id } } },
            { new: true }
          );
        }
      } catch (error) {
        console.error('Attendance update error:', error);
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.id);
    console.log('Connected users:', Array.from(connectedUsers.values()));
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
