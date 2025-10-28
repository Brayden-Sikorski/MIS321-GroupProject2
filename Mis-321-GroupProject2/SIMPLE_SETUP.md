# Simple Setup - NO Node.js Required!

Since you don't need Node.js installed, I've created a **localStorage-only version** that works entirely in your browser.

## How to Use

1. **Just open the HTML file:**
   - Open `client/index.html` directly in your browser
   - Or use a simple local server:
     ```bash
     cd client
     python -m http.server 8080
     ```
     Then visit http://localhost:8080

2. **That's it!** Everything runs in the browser.

## How It Works

- **Authentication**: Usernames and passwords stored in browser localStorage
- **Data Storage**: All calculations saved locally in your browser
- **No Backend**: No server needed, everything runs client-side
- **Privacy**: Data stays on your computer only

## What You Can Do

- Register/login to save calculations
- Calculate your carbon footprint
- Analyze solar breakeven points  
- View your saved data in your profile

## Note

This is a simpler version than the full backend setup. Your data is stored only in your browser's localStorage, so:
- If you clear browser data, calculations are lost
- Data doesn't sync across devices
- Perfect for learning/demo purposes!

If you want the full version with SQLite database later, you can still install Node.js and use the `/api` folder I created.

