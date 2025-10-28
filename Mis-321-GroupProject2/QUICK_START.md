# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- npm

## Setup Steps

### 1. Install Backend Dependencies
```bash
cd api
npm install
```

### 2. Start the Backend Server
```bash
npm start
```
Server will run on http://localhost:3000

### 3. Open the Frontend
Open `client/index.html` in your browser.

**Recommended:** Use a local server to avoid CORS issues:
```bash
# From the client directory
cd client
python -m http.server 8080
```
Then open http://localhost:8080

## First Use

1. Navigate to the Carbon Calculator or Breakeven Analysis page
2. Fill in the form and click calculate
3. To save your results, click "Login" in the top navigation
4. Click "Register here" to create a new account
5. After logging in, your calculations will automatically be saved
6. Visit your "Profile" page to view all your saved calculations

## Features

- ✅ Calculate your carbon footprint
- ✅ Analyze solar panel breakeven point
- ✅ Create account to save calculations
- ✅ View all your saved data on your profile
- ✅ Password-protected accounts with secure authentication

## Troubleshooting

**Server won't start:**
- Make sure you're in the `api` directory
- Check if port 3000 is already in use
- Ensure all dependencies are installed (`npm install`)

**Can't connect to API:**
- Verify the backend server is running on port 3000
- Check the browser console for errors
- Make sure CORS is enabled (should be by default)

**Database issues:**
- The database is automatically created on first run
- Located at `api/data/energy.db`
- Delete this file to reset the database

