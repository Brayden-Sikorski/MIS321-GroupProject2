# Crimson Energy Initiative

Environmental education website with carbon footprint calculator and solar energy breakeven analysis.

## Features

- **Carbon Footprint Calculator**: Calculate your annual CO₂ emissions
- **Breakeven Analysis**: Determine when solar panels pay for themselves
- **User Accounts**: Login/register to save your calculations
- **Profile Page**: View your saved calculations and track your progress

## Project Structure

```
Mis-321-GroupProject2/
├── client/              # Frontend files
│   ├── index.html       # Main HTML file
│   └── resources/
│       ├── scripts/
│       │   └── app.js   # Frontend JavaScript
│       └── styles/
│           └── style.css # Custom styles
└── api/                 # Backend API
    ├── server.js        # Express server
    ├── database/        # Database setup
    ├── routes/          # API routes
    └── data/            # SQLite database (auto-generated)
```

## Getting Started

### 1. Setup Backend

```bash
cd api
npm install
npm start
```

The API server will run on http://localhost:3000

### 2. Open Frontend

Open `client/index.html` in a web browser. For best results, use a local server:

```bash
# Using Python
cd client
python -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080
```

Then navigate to http://localhost:8080

## Usage

1. **Browse as Guest**: Use the calculators without logging in
2. **Create Account**: Click "Login" → "Register here" to create an account
3. **Save Calculations**: After logging in, your calculations are automatically saved
4. **View Profile**: Go to "Profile" to see your saved calculations

## Technology Stack

- Frontend: HTML, CSS, JavaScript (vanilla), Bootstrap 5
- Backend: Node.js, Express
- Database: SQLite (better-sqlite3)
- Authentication: JWT tokens
- Password Security: bcrypt hashing

