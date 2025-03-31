// API endpoint for sending files to the chatbot
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
    // Check if file exists in the request
    if (!req.body || !req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const message = req.body.message || `Analyze this ${file.mimetype} file`;

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

    // For image files, use vision model
    if (file.mimetype.startsWith('image/')) {
      // Initialize the model
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-pro-vision',
        generationConfig: modelConfig
      });

      // Convert file to base64
      const fileData = file.data.toString('base64');

      // Create content parts with image
      const parts = [
        { text: message },
        {
          inlineData: {
            mimeType: file.mimetype,
            data: fileData
          }
        }
      ];

      // Generate content
      const result = await model.generateContent({ contents: [{ parts }] });
      const response = result.response;
      const text = response.text();
      
      return res.json({
        text,
        sender: 'bot',
        timestamp: new Date(),
      });
    } else {
      // For non-image files, just acknowledge receipt
      // Initialize the model
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: modelConfig
      });
      
      const fileInfo = `File received: ${file.name} (${file.size} bytes, ${file.mimetype})`;
      
      // Generate content
      const result = await model.generateContent(`A user has uploaded a file: ${fileInfo}. 
        The file is of type ${file.mimetype}. 
        Please provide an appropriate response acknowledging receipt of this file.`);
      
      const response = result.response;
      const text = response.text();
      
      return res.json({
        text,
        sender: 'bot',
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error('Error processing file message:', error);
    return res.status(500).json({ 
      error: 'Failed to process file',
      details: error.message
    });
  }
} 