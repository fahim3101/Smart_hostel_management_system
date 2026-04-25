const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const generateRoutes = require('./routes/generateRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/allocation', allocationRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/application', applicationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});