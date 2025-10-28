const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database (now async)
db.init().then(() => {
  console.log('✅ Database ready');
}).catch(err => {
  console.error('❌ Database initialization error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Crimson Energy API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database initialized: ${db.getFilePath()}`);
});

module.exports = app;

