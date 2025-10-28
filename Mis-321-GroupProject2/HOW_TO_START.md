# 🚀 How to Start Your Site

## Step 1: Start the Backend Server

Open a NEW terminal window and run:
```bash
cd C:\cmder\MIS321-GroupProject2\Mis-321-GroupProject2\api
node server.js
```

You should see:
```
🚀 Server running on http://localhost:3000
📊 Database initialized: ...
✅ Database ready
```

## Step 2: Open the Website

Open `client/index.html` in your browser

OR use a simple local server:
```bash
cd C:\cmder\MIS321-GroupProject2\Mis-321-GroupProject2\client
python -m http.server 8080
```
Then visit: http://localhost:8080

## What Works:
✅ Carbon Footprint Calculator
✅ Breakeven Analysis Calculator  
✅ User Registration
✅ User Login
✅ Profile Page
✅ Data saves to local SQLite database
✅ All calculations persist after refresh

## Your Data:
All data is stored locally in: `api/data/energy.db`
- This is a FILE on your computer
- Nothing goes to the internet
- Data persists forever (until you delete the file)

## Troubleshooting:
- If server won't start: Make sure you're in the `api` folder
- If you get errors: Check that Node.js is in your PATH (restart terminal)
- Data not saving? Make sure you're logged in first!

