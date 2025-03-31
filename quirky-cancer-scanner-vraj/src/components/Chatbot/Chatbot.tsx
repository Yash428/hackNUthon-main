import React, { useEffect, useState } from 'react';
import ChatContainer from './ChatContainer';
import './Chatbot.css';
import { useTranslation } from 'react-i18next';

// Define message type
interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  file?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
}

// Define ImportMeta interface to fix TypeScript error
interface ImportMeta {
  env: Record<string, string>;
}

// API URL - change to your backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Cancer-related keywords to filter messages
const CANCER_KEYWORDS = [
  'cancer', 'tumor', 'carcinoma', 'oncology', 'malignant', 'benign', 'metastasis', 'biopsy',
  'chemotherapy', 'radiation', 'therapy', 'treatment', 'diagnosis', 'prognosis', 'screening',
  'mammogram', 'ultrasound', 'scan', 'ct', 'mri', 'pet', 'symptom', 'lump', 'lesion', 'growth',
  'remission', 'recurrence', 'stage', 'grade', 'oncologist', 'pathology', 'risk', 'breast',
  'lung', 'colon', 'prostate', 'melanoma', 'lymphoma', 'leukemia', 'surgery', 'immunotherapy',
  'survival', 'rate', 'marker', 'biomarker', 'genetic', 'mutation', 'cell', 'checkup', 'examination'
];

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('chatbot-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme as 'light' | 'dark';
    }
    
    // Check for system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    const oldTheme = theme === 'dark' ? 'light' : 'dark';
    
    root.classList.remove(`chatbot-${oldTheme}`);
    root.classList.add(`chatbot-${theme}`);
    
    // Save to localStorage
    localStorage.setItem('chatbot-theme', theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Ensure messages are visible without 3D effects
    document.querySelectorAll('.message').forEach(msg => {
      const messageElement = msg as HTMLElement;
      messageElement.style.opacity = '1';
      messageElement.style.transform = 'none';
    });
    
    // Clean up previous event listeners if any
    document.removeEventListener('mousemove', () => {});
  }, [messages]);

  // Function to check if a message is cancer-related
  const isCancerRelated = (text: string): boolean => {
    const lowercaseText = text.toLowerCase();
    
    // Check for keywords
    for (const keyword of CANCER_KEYWORDS) {
      if (lowercaseText.includes(keyword.toLowerCase())) {
        return true;
      }
    }
    
    // If no keywords found, consider it not cancer-related
    return false;
  };

  const sendMessage = async (text: string): Promise<void> => {
    const newUserMessage: Message = { 
      id: Date.now(), 
      text, 
      sender: 'user', 
      timestamp: new Date() 
    };
    
    setMessages((prev: Message[]) => [...prev, newUserMessage]);
    
    // Check if message is cancer-related
    if (!isCancerRelated(text)) {
      // Add bot response redirecting user to cancer topics
      const redirectMessage: Message = {
        id: Date.now() + 1,
        text: t('chatbot.cancerTopicsOnly', 'I\'m specialized in cancer-related topics only. Please ask me questions about cancer diagnosis, treatments, symptoms, or preventive measures. If you need general medical advice, please consult with a healthcare professional.'),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, redirectMessage]);
      return;
    }
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Get all previous messages for context (for Gemini to remember conversation)
      const history = messages.map(msg => ({
        text: msg.text,
        sender: msg.sender,
      }));
      
      // Get current language
      const currentLang = i18n.language;
      
      // Call backend API to get bot response
      const response = await fetch(`${API_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: history,
          language: currentLang // Pass language to backend
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }
      
      const data = await response.json();
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add bot response to messages
      let responseText = data.text || t('chatbot.defaultResponse', "I'm sorry, I couldn't generate a response.");
      
      // Add language-specific response formatting based on medical terminology
      if (currentLang !== 'en') {
        // Use medical terms from translation files for key medical terms
        const medicalTerms = [
          { en: 'cancer', key: 'medicalTerms.cancer' },
          { en: 'tumor', key: 'medicalTerms.tumor' },
          { en: 'benign', key: 'medicalTerms.benign' },
          { en: 'malignant', key: 'medicalTerms.malignant' },
          { en: 'carcinoma', key: 'medicalTerms.carcinoma' },
          { en: 'metastasis', key: 'medicalTerms.metastasis' },
          { en: 'biopsy', key: 'medicalTerms.biopsy' },
          { en: 'chemotherapy', key: 'medicalTerms.chemotherapy' },
          { en: 'radiation', key: 'medicalTerms.radiation' },
          { en: 'mri', key: 'medicalTerms.mri' },
          { en: 'ct scan', key: 'medicalTerms.ctScan' },
          { en: 'pet scan', key: 'medicalTerms.petScan' }
        ];
        
        // Replace key medical terms with translated versions
        medicalTerms.forEach(term => {
          const regex = new RegExp(`\\b${term.en}\\b`, 'gi');
          responseText = responseText.replace(regex, t(term.key));
        });
        
        // Also replace common medical phrases with their translated versions
        const medicalPhrases = [
          { en: 'early detection', key: 'chatbot.phrases.earlyDetection' },
          { en: 'screening test', key: 'chatbot.phrases.screeningTest' },
          { en: 'survival rate', key: 'chatbot.phrases.survivalRate' },
          { en: 'risk factor', key: 'chatbot.phrases.riskFactor' },
          { en: 'side effect', key: 'chatbot.phrases.sideEffect' },
          { en: 'treatment option', key: 'chatbot.phrases.treatmentOption' }
        ];
        
        medicalPhrases.forEach(phrase => {
          const regex = new RegExp(phrase.en, 'gi');
          responseText = responseText.replace(regex, t(phrase.key, phrase.en));
        });
      }
      
      const botReply: Message = { 
        id: Date.now() + 1, 
        text: responseText, 
        sender: 'bot', 
        timestamp: new Date(data.timestamp) || new Date(),
      };
      
      setMessages((prev: Message[]) => [...prev, botReply]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add error message
      const errorMessage: Message = { 
        id: Date.now() + 1, 
        text: t('errors.networkError', "Sorry, there was an error connecting to the chatbot. Please try again later."), 
        sender: 'bot', 
        timestamp: new Date(),
      };
      
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    }
  };
  
  const handleFileUpload = async (file: File): Promise<void> => {
    // Check if file is a medical image type
    const validMedicalImageTypes = ['image/jpeg', 'image/png', 'image/dicom', 'application/dicom'];
    
    if (!validMedicalImageTypes.includes(file.type.toLowerCase())) {
      // Add message indicating only medical images are allowed
      const fileErrorMessage: Message = {
        id: Date.now(),
        text: t('chatbot.uploadMedicalImagesOnly', 'Please upload only medical images (JPEG, PNG, DICOM) for cancer-related analysis.'),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages((prev: Message[]) => [...prev, fileErrorMessage]);
      return;
    }
    
    // Create object URL for preview
    const fileUrl = URL.createObjectURL(file);
    
    // Create a message with the file
    const fileMessage: Message = {
      id: Date.now(),
      text: t('chatbot.uploadedFile', 'Uploaded file') + ': ' + file.name,
      sender: 'user',
      timestamp: new Date(),
      file: {
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl
      }
    };
    
    setMessages((prev: Message[]) => [...prev, fileMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Get current language
      const currentLang = i18n.language;
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('message', `I've uploaded a file called ${file.name}. Please analyze it for cancer-related findings.`);
      formData.append('language', currentLang); // Pass language to backend
      
      // Send file to backend
      const response = await fetch(`${API_URL}/api/chat/send-file`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response for file upload');
      }
      
      const data = await response.json();
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add bot response to messages
      let responseText = data.text || t('chatbot.fileAnalysisMessage', {
        filename: file.name
      });
      
      // Add language-specific response formatting based on medical terminology
      if (currentLang !== 'en') {
        // Use medical terms from translation files for key medical terms
        const medicalTerms = [
          { en: 'cancer', key: 'medicalTerms.cancer' },
          { en: 'tumor', key: 'medicalTerms.tumor' },
          { en: 'benign', key: 'medicalTerms.benign' },
          { en: 'malignant', key: 'medicalTerms.malignant' },
          { en: 'carcinoma', key: 'medicalTerms.carcinoma' },
          { en: 'metastasis', key: 'medicalTerms.metastasis' },
          { en: 'biopsy', key: 'medicalTerms.biopsy' },
          { en: 'chemotherapy', key: 'medicalTerms.chemotherapy' },
          { en: 'radiation', key: 'medicalTerms.radiation' },
          { en: 'mri', key: 'medicalTerms.mri' },
          { en: 'ct scan', key: 'medicalTerms.ctScan' },
          { en: 'pet scan', key: 'medicalTerms.petScan' }
        ];
        
        // Replace key medical terms with translated versions
        medicalTerms.forEach(term => {
          const regex = new RegExp(`\\b${term.en}\\b`, 'gi');
          responseText = responseText.replace(regex, t(term.key));
        });
        
        // Also replace common medical phrases with their translated versions
        const medicalPhrases = [
          { en: 'early detection', key: 'chatbot.phrases.earlyDetection' },
          { en: 'screening test', key: 'chatbot.phrases.screeningTest' },
          { en: 'survival rate', key: 'chatbot.phrases.survivalRate' },
          { en: 'risk factor', key: 'chatbot.phrases.riskFactor' },
          { en: 'side effect', key: 'chatbot.phrases.sideEffect' },
          { en: 'treatment option', key: 'chatbot.phrases.treatmentOption' }
        ];
        
        medicalPhrases.forEach(phrase => {
          const regex = new RegExp(phrase.en, 'gi');
          responseText = responseText.replace(regex, t(phrase.key, phrase.en));
        });
      }
      
      const botReply: Message = { 
        id: Date.now() + 1, 
        text: responseText, 
        sender: 'bot', 
        timestamp: new Date(data.timestamp) || new Date(),
      };
      
      setMessages((prev: Message[]) => [...prev, botReply]);
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add error message
      const errorMessage: Message = { 
        id: Date.now() + 1, 
        text: t('errors.uploadFailed', "Sorry, there was an error processing your file. Please try again later."), 
        sender: 'bot', 
        timestamp: new Date(),
      };
      
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      messages.forEach(message => {
        if (message.file?.url && message.file.url.startsWith('blob:')) {
          URL.revokeObjectURL(message.file.url);
        }
      });
    };
  }, [messages]);

  return (
    <div className="chatbot">
      <header className="chatbot-header">
        <div className="chatbot-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h1>{t('chatbot.title', 'Cancer Detection Assistant')}</h1>
        
        {/* Theme toggle button */}
        <button 
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </header>
      
      <ChatContainer 
        messages={messages} 
        isTyping={isTyping} 
        onSendMessage={sendMessage} 
        onFileUpload={handleFileUpload}
      />
    </div>
  );
}

export default Chatbot; 