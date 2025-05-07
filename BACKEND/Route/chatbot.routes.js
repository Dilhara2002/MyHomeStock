import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios'; // ✅ Only one import

dotenv.config(); // Load environment variables

const router = express.Router();

// POST: /chatbot/chat - Handle AI message requests
router.post('/chat', async (req, res) => {
  const { message } = req.body;

  console.log('Received message:', message);

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: message }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );

    console.log('Gemini API Response:', response.data);

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: 'No reply received from AI' });
    }

    res.json({ reply });
  } catch (error) {
    console.error('Error with Gemini API request:', error.message);
    res.status(500).json({ error: 'AI failed to respond', details: error.message });
  }
});

export default router;