// API endpoint for sending messages to the chatbot
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Google Generative AI with API key
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || '');

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get message and history from the request body
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Configure model
    const modelConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    };

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: modelConfig
    });
    
    // Process history if available
    let chatHistory = [];
    if (history && Array.isArray(history)) {
      chatHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));
    }
    
    // Start a chat session
    const chat = model.startChat({
      history: chatHistory,
    });
    
    // Generate content
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();
    
    return res.json({ 
      text,
      sender: 'bot',
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message
    });
  }
} 