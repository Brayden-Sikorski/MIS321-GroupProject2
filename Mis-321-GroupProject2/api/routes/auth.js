const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'crimson-energy-secret-key-change-in-production';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const database = db.getDb();
    
    // Check if user already exists
    const result = database.exec('SELECT id FROM users WHERE email = "' + email + '"');
    if (result && result.length > 0 && result[0].values.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    database.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    const idResult = database.exec('SELECT last_insert_rowid() as id');
    const userId = idResult[0].values[0][0];
    
    // Save to disk
    db.save();

    // Generate JWT token
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: userId, email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const database = db.getDb();
    
    // Find user
    const result = database.exec('SELECT * FROM users WHERE email = "' + email + '"');
    if (!result || !result[0] || result[0].values.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const columns = result[0].columns;
    const values = result[0].values[0];
    const user = {};
    columns.forEach((col, i) => { user[col] = values[i]; });

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
