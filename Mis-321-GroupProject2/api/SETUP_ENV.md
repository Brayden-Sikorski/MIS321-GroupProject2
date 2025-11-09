# Environment Setup

## Step 1: Create .env file

In the `api` folder, create a file named `.env` (not .env.example)

## Step 2: Add your OpenAI API Key

Open `.env` and add:

```
OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual key from https://platform.openai.com/api-keys

## Step 3: Add JWT secret (optional but recommended)

```
JWT_SECRET=choose_a_long_random_string
```

If omitted, the development default inside `appsettings.Development.json` is used.

## Step 4: Run the API

From `api/CrimsonEnergy.Api`:

```
dotnet run
```

The `.env` file is ignored by git so your keys stay local, and it will be loaded automatically on startup.

## Important Notes
- Keep `.env` out of version control (already handled via `.gitignore`).
- Update or recreate `.env` whenever you rotate keys.
- Restart the API after editing `.env` so .NET picks up the latest values.

