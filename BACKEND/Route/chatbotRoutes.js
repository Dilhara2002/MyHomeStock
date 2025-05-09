import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import InventoryItem from '../Model/InventoryModel.js'; // Make sure this path is correct

dotenv.config();

const router = express.Router();

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// POST: /api/chatbot/chat
router.post('/chat', authenticateToken, async (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();

  try {
    // === Intent: Low Stock ===
    if (
      lowerMsg.includes('low stock') ||
      lowerMsg.includes('low count') ||
      lowerMsg.includes('running low')
    ) {
      const lowStockItems = await InventoryItem.find({ quantity: { $lt: 5 } });

      if (lowStockItems.length === 0) {
        return res.json({ reply: 'All items are well-stocked.' });
      }

      const reply = `Here are the low stock items:\n${lowStockItems
        .map((item) => `- ${item.name}: ${item.quantity}`)
        .join('\n')}`;

      return res.json({ reply });
    }

    // === Intent: Expiring Items ===
    if (
      lowerMsg.includes('expire') ||
      lowerMsg.includes('expired') ||
      lowerMsg.includes('about to expire')
    ) {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const expiringSoon = await InventoryItem.find({
        expiryDate: { $lt: nextWeek },
      });

      if (expiringSoon.length === 0) {
        return res.json({ reply: 'No items are near expiration.' });
      }

      const reply = `Items near expiration:\n${expiringSoon
        .map((item) => `- ${item.name}: expires on ${item.expiryDate.toDateString()}`)
        .join('\n')}`;

      return res.json({ reply });
    }

    // === Fallback: Gemini API ===
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: message }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
      }
    );

    const reply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: 'No reply from Gemini' });
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chatbot Error:', error.message);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;
