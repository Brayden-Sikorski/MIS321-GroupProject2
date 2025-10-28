# Environment Setup

## Step 1: Create .env file

In the `api` folder, create a file named `.env` (not .env.example)

## Step 2: Add your OpenAI API Key

Open `.env` and add:

```
OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual key from https://platform.openai.com/api-keys

## Step 3: Restart Server

The `.env` file is automatically ignored by git, so your key stays private!

## Important Notes:
- Never commit `.env` to git (it's in .gitignore)
- The `.env.example` file shows what variables are needed
- Restart your server after creating .env

