# Crimson Energy Initiative - Backend API

Backend API server for the environmental education site with user authentication and data persistence.

## Setup

1. Install dependencies:
```bash
cd api
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000` by default.

## Database

- Uses SQLite database stored in `api/data/energy.db`
- Database is automatically created on first run
- Tables:
  - `users`: User accounts (email, hashed password)
  - `calculations`: Saved user calculations (carbon emissions, breakeven analysis)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### User Data
- `POST /api/user/save-calculation` - Save calculation (requires auth)
- `GET /api/user/profile` - Get user profile with latest calculation (requires auth)
- `GET /api/user/calculations` - Get all user calculations (requires auth)

## Environment Variables

Optional environment variables:
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT tokens (default: development key)

