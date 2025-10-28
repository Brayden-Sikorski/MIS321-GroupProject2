const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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'
});

router.post('/message', async (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

module.exports = router;

