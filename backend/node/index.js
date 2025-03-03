const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/authRouter');
const courseRoutes = require('./routes/courseRouter');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
