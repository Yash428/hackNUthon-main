import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatContainer.css';
import { useTranslation } from 'react-i18next';

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

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onFileUpload: (file: File) => void;
}

function ChatContainer({ messages, isTyping, onSendMessage, onFileUpload }: ChatContainerProps) {
  const { t } = useTranslation();

  // Cancer-specific suggestions
  const suggestions = [
    t('chatbot.suggestions.breastCancerSigns', "What are the early signs of breast cancer?"),
    t('chatbot.suggestions.melanomaDiagnosis', "How is melanoma diagnosed?"),
    t('chatbot.suggestions.lungCancerRisks', "What are the risk factors for lung cancer?"),
    t('chatbot.suggestions.chemotherapyExplained', "How does chemotherapy work?"),
    t('chatbot.suggestions.pancreaticCancerSurvival', "What is the survival rate for pancreatic cancer?"),
    t('chatbot.suggestions.brainTumorTreatments', "Are there new treatments for brain tumors?"),
    t('chatbot.suggestions.mammogramInterpretation', "How to interpret my mammogram results?"),
    t('chatbot.suggestions.oncologistQuestions', "What questions should I ask my oncologist?")
  ];

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  return (
    <div className="chat-container">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h2>{t('chatbot.welcomeTitle', 'Welcome to Cancer Assistant')}</h2>
          <p>
            {t('chatbot.welcomeDescription', 'I am specialized in cancer-related topics only. I can help you understand cancer detection, diagnosis, treatment options, and preventive measures. Please note that I cannot provide general medical advice or discuss non-cancer related health topics.')}
          </p>
          <div className="empty-state-suggestions">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      
      {isTyping && (
        <div className="typing-indicator">
          <span>{t('chatbot.typing', 'AI is typing')}</span>
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
      
      <MessageInput onSendMessage={onSendMessage} onFileUpload={onFileUpload} />
    </div>
  );
}

export default ChatContainer; 