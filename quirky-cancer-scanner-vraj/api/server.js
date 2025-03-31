import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

// Check if API key is set
if (!process.env.GOOGLE_API_KEY) {
  console.error('❌ Google Generative AI API key is not set!');
  console.error('Please set GOOGLE_API_KEY in your .env file');
  process.exit(1);
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// System prompt to improve formatting and clarity of responses
const SYSTEM_PROMPT = `
You are a helpful, clear, and concise cancer information assistant. You must follow these strict formatting guidelines:

1. USE **bold text** (with double asterisks) for ALL important terms, including:
   - Cancer types (e.g., **breast cancer**, **melanoma**)
   - Medical procedures (e.g., **chemotherapy**, **radiation**)
   - Anatomical parts (e.g., **lymph nodes**, **tumor**)
   - Key concepts (e.g., **diagnosis**, **treatment**, **symptoms**)

2. SEPARATE content with paragraph breaks:
   - Put a BLANK LINE between different topics or sections
   - Each paragraph should address ONE concept or idea
   - ALWAYS include paragraph breaks between sections

3. For STATISTICS and NUMBERS, format as:
   - "The 5-year survival rate is **75%**"
   - "Tumors larger than **2 cm** may require..."

4. For LISTS, use proper formatting:
   - For steps or numbered sequences, use numbered lists (1., 2., 3.)
   - For symptoms or related items, use bullet points (* or -)
   - ALWAYS put a line break before and after lists

5. END each thought or sentence properly with punctuation.

6. KEEP answers informative but concise.

7. For MEDICAL TERMS, briefly define them when first used.

8. Use MARKDOWN FORMATTING:
   - **bold** for emphasis and important terms
   - *italic* for mild emphasis
   - \`code\` for medical values or measurements

9. Structure longer answers with clear SECTIONS using paragraph breaks.

10. EXAMPLE of proper formatting:

**Breast cancer** is a type of cancer that forms in the cells of the breasts. It's the second most common cancer diagnosed in women.

**Key symptoms** include:
* A breast lump or thickening
* Change in the size, shape or appearance of a breast
* **Dimpling** or irritation of breast skin

The treatment for breast cancer depends on the **stage**. Early-stage breast cancer (stages 0-2) has a **5-year survival rate** of over **90%**.

Remember that your formatting will be directly displayed to users, so structure your text accordingly.
`;

// Image analysis prompt
const IMAGE_ANALYSIS_PROMPT = `
Analyze this medical image in detail, especially if it contains any potential cancer cells or medical scan.

You MUST format your response following these strict guidelines:

1. Start with a clear SUMMARY stating what type of image this is.

2. Organize your observations in SEPARATE PARAGRAPHS with blank lines between them.

3. Use **bold text** (with double asterisks) for ALL key findings and important medical terms.

4. When describing measurements or values, format them as **X cm** or **X%**.

5. If you identify any concerning features, clearly explain why they are significant.

6. End with a concise ASSESSMENT that summarizes the key points.

7. EXAMPLE format:

This appears to be a **mammogram** of the right breast.

The image shows an **irregular mass** in the upper outer quadrant, measuring approximately **2.5 cm** in diameter. The mass has **spiculated borders** which is often associated with **malignancy**.

There are no visible **calcifications** or signs of **lymph node involvement**.

**Assessment**: This image shows features consistent with a **suspicious breast lesion** that requires further investigation, including **biopsy** for definitive diagnosis.
`;

// File acknowledgment prompt
const FILE_ACKNOWLEDGMENT_PROMPT = `
I've received your file. Please format your response with:

1. A clear ACKNOWLEDGMENT stating the file has been received.

2. Use **bold text** (with double asterisks) for ALL important terms and key information.

3. Organize your response with PARAGRAPH BREAKS between different topics.

4. End with a clear CONCLUSION or next steps.

5. EXAMPLE format:

I've received your file named **patient_scan.jpg**.

This appears to be a **medical scan image**. I can analyze this image for potential signs of abnormalities or cancer indicators.

Please let me know if you have any specific questions about this file or if you'd like me to examine any particular aspect of it.
`;

// Handle text-only chat endpoint
app.post('/api/chat/send', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Configure model parameters
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });
    
    let result;
    
    // Handle chat history if provided
    if (history && history.length > 0) {
      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        systemInstruction: SYSTEM_PROMPT,
      });
      
      result = await chat.sendMessage(message);
    } else {
      // No history, just send a single message with system prompt
      const chat = model.startChat({
        systemInstruction: SYSTEM_PROMPT,
      });
      
      result = await chat.sendMessage(message);
    }
    
    const response = result.response;
    const text = response.text();
    
    res.json({
      text,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle file upload endpoint
app.post('/api/chat/send-file', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const message = req.body.message || '';
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Configure model parameters
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      systemInstruction: SYSTEM_PROMPT,
    });
    
    let result;
    
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      // Convert file to base64 for image processing
      const base64Image = file.buffer.toString('base64');
      
      // Generate content based on the image
      result = await model.generateContent([
        message ? `${message}\n\n${IMAGE_ANALYSIS_PROMPT}` : IMAGE_ANALYSIS_PROMPT,
        {
          inlineData: {
            data: base64Image,
            mimeType: file.mimetype,
          },
        },
      ]);
    } else {
      // Handle non-image files with formatting instructions
      const filePrompt = `
      I've received a file named "${file.originalname}" of type ${file.mimetype} and size ${file.size} bytes. ${message}
      
      ${FILE_ACKNOWLEDGMENT_PROMPT}
      `;
      
      result = await model.generateContent(filePrompt);
    }
    
    const response = result.response;
    const text = response.text();
    
    res.json({
      text,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in file upload endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cancer Detection Assistant API running on port ${PORT}`);
  console.log(`📝 Text chat endpoint: http://localhost:${PORT}/api/chat/send`);
  console.log(`🖼️ File upload endpoint: http://localhost:${PORT}/api/chat/send-file`);
}); 