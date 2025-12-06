const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const designRoutes = require('./routes/design.routes');
const { initDb } = require('./db/init');

// Initialize Database
initDb();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/design', designRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Interior Design AI API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Keep the process alive
setInterval(() => { }, 1000 * 60 * 60);

process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  process.exit(0);
});
