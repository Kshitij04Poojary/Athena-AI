const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const connectDB = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/authRouter');
const courseRoutes = require('./routes/courseRouter');
const assessmentRoutes = require('./routes/assessmentRouter');
const generateCourseRoutes = require('./routes/generateCourseRouter')
const generateChapterContentRoutes = require('./routes/generateChapterContentRouter');
const interviewRoutes=require('./routes/interviewRouter')
//const fileRoutes = require('./routes/fileRouter');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
const authRoutes = require('./routes/authRouter');
const lectureRoutes = require('./routes/lectureRouter');
const mentorMenteeRouter = require('./routes/mentorMenteeRouter');
const Lecture = require('./models/Lecture');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const Mentor = require('./models/Mentor');
const Mentee = require('./models/Mentee');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Connect to MongoDB
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use('/api', generateCourseRoutes);
app.use('/api', generateChapterContentRoutes);
//app.use('/api/files', fileRoutes);

app.use('/api/interview',interviewRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'],
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
// Participant tracking Map
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);

  socket.on('register', ({ userId, role, name }) => {
    console.log('Registering user:', { userId, role, name, socketId: socket.id });
    connectedUsers.set(socket.id, { userId, role, name, socketId: socket.id });
    console.log('Connected users:', Array.from(connectedUsers.values()));
  });
  // Join lecture room
  socket.on('leave_lecture', async({roomId,role,userId}) => {
    console.log(userId,"Left lecture");
    if(role==='mentee'){
      try {
        let ment1;
        if(role === 'mentee'){
           ment1=await Mentee.find({ user: userId });
        }
        console.log("ment",ment1);
        // Update leave time and duration
        await Lecture.findOneAndUpdate(
          { roomId:roomId },  // Find the ongoing lecture
          { 
              $push: { 
                  attendance: { student: ment1._id }  // Add mentee to attendance array
              } 
          },
          { new: true }  // Return the updated document
      );
     
      } catch (error) {
        console.error('Attendance update error:', error);
      }
    }
    
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    // Update leave time for all lectures the user was attending
   
    console.log(`User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.id);
    console.log('Connected users:', Array.from(connectedUsers.values()));
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/users', mentorMenteeRouter);


// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
