# Crimson Energy Initiative – .NET Backend

ASP.NET Core Web API that powers authentication, user persistence, renewable-energy calculators, and the OpenAI-backed chat assistant for the Crimson Energy site.

## Prerequisites

- .NET SDK 9.0+
- SQLite (bundled with .NET; no separate install required)

## Getting Started

```bash
cd api/CrimsonEnergy.Api
dotnet restore
dotnet run
```

The API listens on the standard ASP.NET Core development port (check console output, usually `http://localhost:5000`). OpenAPI docs are available at `/openapi/v1.json` when `ASPNETCORE_ENVIRONMENT=Development`.

## Configuration

The server reads settings from `appsettings*.json`, environment variables, and optional `.env` files located in either `api/.env` or `api/CrimsonEnergy.Api/.env`. Key settings:

- `JWT_SECRET` (or `JwtSettings:Secret`): HMAC secret for signing tokens.
- `OPENAI_API_KEY` (or `OpenAI:ApiKey`): Required for `/api/chat/message`.
- `Database:Path`: Custom path for the SQLite DB (defaults to `api/data/energy.db`).
- `ASPNETCORE_URLS`: Override the listening URL if you need a specific port.

Example `.env`:

```bash
JWT_SECRET=super-secret
OPENAI_API_KEY=sk-...
```

## Database

- SQLite file stored at `api/data/energy.db` (auto-created on startup).
- Tables:
  - `users` – email + bcrypt password hash + timestamps
  - `calculations` – per-user carbon and breakeven results with JSON detail blobs

## API Surface

`POST /api/auth/register`  
Create an account. Body: `{ "email": "...", "password": "..." }`

`POST /api/auth/login`  
Authenticate and receive JWT + user payload.

`GET /api/auth/verify` *(auth required)*  
Validate token; returns decoded token metadata.

`POST /api/user/save-calculation` *(auth required)*  
Persist latest calculator results for the user.

`GET /api/user/profile` *(auth required)*  
Load profile info plus most recent carbon + breakeven runs.

`POST /api/chat/message`  
Proxy to OpenAI Chat Completions with the same prompt as the previous Node service.

`GET /api/health`  
Lightweight health check for monitoring.

All responses mirror the previous Node.js backend so the existing front-end continues working without changes.
