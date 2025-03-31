import React, { useState, useRef, useEffect } from 'react';
import './MessageInput.css';
import { useTranslation } from 'react-i18next';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onFileUpload: (file: File) => void;
}

function MessageInput({ onSendMessage, onFileUpload }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  // Auto resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
    
    if (selectedFile) {
      onFileUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Auto-focus the input field when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <form 
      className={`message-input-container ${isFocused ? 'focused' : ''}`} 
      onSubmit={handleSubmit}
    >
      <textarea
        className="message-input"
        placeholder={selectedFile 
          ? `${selectedFile.name} ${t('chatbot.fileSelected', 'selected')}` 
          : t('chatbot.inputPlaceholder', 'Ask about cancer diagnosis, treatment options, or upload a scan for analysis...')}
        value={message}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={textareaRef}
        rows={1}
      />
      
      {/* Hidden file input */}
      <input 
        type="file"
        className="file-input"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/dicom,application/dicom"
        style={{ display: 'none' }}
      />
      
      <button 
        type="button"
        className="file-button"
        onClick={handleFileButtonClick}
        title={t('chatbot.uploadMedicalImage', 'Upload a medical image for cancer analysis')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
        </svg>
      </button>
      
      <button 
        type="submit" 
        className="send-button"
        disabled={!message.trim() && !selectedFile}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
      
      {selectedFile && (
        <div className="file-preview">
          <span>{selectedFile.name}</span>
          <button 
            type="button" 
            className="remove-file-button"
            onClick={() => setSelectedFile(null)}
          >
            ×
          </button>
        </div>
      )}
    </form>
  );
}

export default MessageInput; 