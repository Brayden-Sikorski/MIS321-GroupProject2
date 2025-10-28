const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY not set. Chat feature will not work.');
}

router.post('/message', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in .env file' });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful solar energy and clean energy expert assistant for Crimson Energy Initiative. Help users with questions about solar panels, renewable energy options, local pricing, installation advice, and environmental benefits. Be informative, friendly, and encourage sustainable practices."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    let errorMessage = 'Failed to get response from AI';
    if (error.status === 401) {
      errorMessage = 'Invalid API key. Please check your OpenAI API key in the .env file';
    } else if (error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
});

module.exports = router;

