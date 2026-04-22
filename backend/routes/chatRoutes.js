const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: req.body.system },
          ...req.body.messages,
        ],
      }),
    });

    const data = await response.json();
    res.json({
      content: [{ text: data.choices?.[0]?.message?.content || 'Kuch problem aayi!' }]
    });
  } catch (err) {
    res.status(500).json({ message: 'Chat error', error: err.message });
  }
});

module.exports = router;