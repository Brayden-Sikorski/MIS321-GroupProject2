# Environment Setup

## Step 1: Create .env file

In the `api` folder, create a file named `.env` (not .env.example)

## Step 2: Add your OpenAI API Key

Open `.env` and add:

```
OPENAI_API_KEY=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
```

## Step 3: Restart Server

The `.env` file is automatically ignored by git, so your key stays private!

## Important Notes:
- Never commit `.env` to git (it's in .gitignore)
- The `.env.example` file shows what variables are needed
- Restart your server after creating .env

