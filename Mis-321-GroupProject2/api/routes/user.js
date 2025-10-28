const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'crimson-energy-secret-key-change-in-production';

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/save-calculation', verifyToken, (req, res) => {
  try {
    const { carbonEmissions, breakevenYears, carbonDetails, breakevenDetails } = req.body;
    const database = db.getDb();
    
    database.run(
      'INSERT INTO calculations (user_id, carbon_emissions, breakeven_years, carbon_details, breakeven_details) VALUES (?, ?, ?, ?, ?)',
      [req.userId, carbonEmissions, breakevenYears, JSON.stringify(carbonDetails), JSON.stringify(breakevenDetails)]
    );
    
    const idResult = database.exec('SELECT last_insert_rowid() as id');
    const id = idResult[0].values[0][0];
    
    db.save();

    res.json({ message: 'Calculation saved successfully', id });
  } catch (error) {
    console.error('Save calculation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/profile', verifyToken, (req, res) => {
  try {
    const database = db.getDb();
    
    const userResult = database.exec('SELECT id, email, created_at FROM users WHERE id = ' + req.userId);
    if (!userResult || !userResult[0] || userResult[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userColumns = userResult[0].columns;
    const userValues = userResult[0].values[0];
    const user = {};
    userColumns.forEach((col, i) => { user[col] = userValues[i]; });

    // Get latest carbon calculation
    const carbonResult = database.exec('SELECT * FROM calculations WHERE user_id = ' + req.userId + ' AND carbon_emissions IS NOT NULL ORDER BY created_at DESC LIMIT 1');
    let latestCarbon = null;
    if (carbonResult && carbonResult[0] && carbonResult[0].values.length > 0) {
      const calcColumns = carbonResult[0].columns;
      const calcValues = carbonResult[0].values[0];
      latestCarbon = {};
      calcColumns.forEach((col, i) => { latestCarbon[col] = calcValues[i]; });
    }

    // Get latest breakeven calculation
    const breakevenResult = database.exec('SELECT * FROM calculations WHERE user_id = ' + req.userId + ' AND breakeven_years IS NOT NULL ORDER BY created_at DESC LIMIT 1');
    let latestBreakeven = null;
    if (breakevenResult && breakevenResult[0] && breakevenResult[0].values.length > 0) {
      const calcColumns = breakevenResult[0].columns;
      const calcValues = breakevenResult[0].values[0];
      latestBreakeven = {};
      calcColumns.forEach((col, i) => { latestBreakeven[col] = calcValues[i]; });
    }

    res.json({
      user: { id: user.id, email: user.email, createdAt: user.created_at },
      latestCarbon: latestCarbon ? {
        id: latestCarbon.id,
        carbonEmissions: latestCarbon.carbon_emissions,
        carbonDetails: latestCarbon.carbon_details ? JSON.parse(latestCarbon.carbon_details) : null,
        createdAt: latestCarbon.created_at
      } : null,
      latestBreakeven: latestBreakeven ? {
        id: latestBreakeven.id,
        breakevenYears: latestBreakeven.breakeven_years,
        breakevenDetails: latestBreakeven.breakeven_details ? JSON.parse(latestBreakeven.breakeven_details) : null,
        createdAt: latestBreakeven.created_at
      } : null
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
