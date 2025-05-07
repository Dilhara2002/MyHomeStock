import express from 'express';
import axios from 'axios'; // For making HTTP requests
import dotenv from 'dotenv'; // To use environment variables

dotenv.config(); // Load environment variables from .env

const router = express.Router();

// POST request handler for the chatbot interaction
router.post('/chat', async (req, res) => {
  const { message } = req.body; // Extract the message from the body of the request

  // Log the incoming message for debugging
  console.log('Received message:', message);

  try {
    // Sending the request to the Gemini API
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', // Ensure this is the correct endpoint
      {
        contents: [{ parts: [{ text: message }] }] // Format the message as per Gemini's API requirements
      },
      {
        headers: {
          'Content-Type': 'application/json', // Specify content type
          'x-goog-api-key': process.env.GEMINI_API_KEY // Get API key from .env file
        }
      }
    );

    // Log the response from Gemini API for debugging
    console.log('Gemini API Response:', response.data);

    // Extract the response from the API (Ensure the structure is correct)
    const reply = response.data.candidates[0]?.content?.parts[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: 'No reply received from AI' });
    }

    // Send the AI response back to the client
    res.json({ reply });
  } catch (error) {
    // Log the error
    console.error('Error with Gemini API request:', error.message);
    
    // Send error response
    res.status(500).json({ error: 'AI failed to respond', details: error.message });
  }
});

export default router;
