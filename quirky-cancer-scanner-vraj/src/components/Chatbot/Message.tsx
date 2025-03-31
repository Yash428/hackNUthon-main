import * as React from 'react';
const { useEffect, useRef } = React;

interface MessageData {
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

interface MessageProps {
  message: MessageData;
  key?: string | number;
}

function Message({ message }: MessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const isUser = message.sender === 'user';
  
  // Format time for display
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  useEffect(() => {
    if (messageRef.current) {
      const messageElement = messageRef.current;
      
      setTimeout(() => {
        if (messageElement) {
          messageElement.style.opacity = '1';
        }
      }, 50);
    }
  }, [isUser]);
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };
  
  const isImageFile = (type: string): boolean => {
    return type.startsWith('image/');
  };

  const containsCodeBlock = (text: string): boolean => {
    return text.includes('```') || 
           text.includes('    ') || 
           text.includes('\t');
  };
  
  // Improved formatting function with better parsing for bot responses
  const formatText = (text: string) => {
    if (isUser) {
      // Basic formatting for user messages
      const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="user-strong">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="user-em">$1</em>')
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
      
      return <p className="user-text" dangerouslySetInnerHTML={{ __html: formattedText }} />;
    } else {
      // Enhanced formatting for bot messages
      let formattedText = text;

      // First, handle existing Markdown formatting
      formattedText = formattedText
        .replace(/\*\*(.*?)\*\*/g, '<strong class="highlight-term">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

      // Additional terms to highlight (medical and cancer-related terms)
      const medicalTerms = [
        "cancer", "tumor", "malignant", "benign", "carcinoma", "metastasis", 
        "chemotherapy", "radiation", "biopsy", "diagnosis", "prognosis", 
        "oncology", "remission", "MRI", "CT scan", "ultrasound", "mammogram",
        "stage", "grade", "treatment", "therapy", "survival rate", "risk factor",
        "symptom", "screening", "prevention", "early detection", "lymph node",
        "melanoma", "leukemia", "lymphoma", "sarcoma", "metastatic", "invasive",
        "non-invasive", "in situ", "papillary", "ductal", "lobular", "squamous"
      ];
      
      // Highlight medical terms only if they're not already within tags
      const plainTextSegments = formattedText.split(/<\/?[^>]+>/);
      let processedText = formattedText;
      
      plainTextSegments.forEach((segment, i) => {
        if (segment.trim()) {
          let processedSegment = segment;
          
          medicalTerms.forEach(term => {
            const regex = new RegExp(`\\b(${term})\\b`, 'gi');
            processedSegment = processedSegment.replace(regex, '<strong class="medical-term">$1</strong>');
          });
          
          if (processedSegment !== segment) {
            // Replace the original segment with the processed one, respecting HTML tags
            const segmentRegex = new RegExp(segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            processedText = processedText.replace(segmentRegex, processedSegment);
          }
        }
      });
      
      formattedText = processedText;
      
      // Highlight statistics and numbers
      formattedText = formattedText.replace(
        /\b(\d+(?:\.\d+)?)\s*(%|percent|mg|mm|cm|years|months|weeks|days)\b/gi,
        '<span class="medical-value">$1 $2</span>'
      );
      
      // Improve list formatting
      formattedText = formattedText
        .replace(/^\s*\d+\.\s+(.*)$/gm, '<div class="list-item numbered"><span class="list-marker"></span>$1</div>')
        .replace(/^\s*[\*\-•]\s+(.*)$/gm, '<div class="list-item bullet"><span class="list-marker"></span>$1</div>');
      
      // Improve sentence spacing/structure
      formattedText = formattedText
        .replace(/\.(?=[A-Z])/g, '. ') // Add space after period if followed by capital letter
        .replace(/\.\s{2,}/g, '. ')    // Remove extra spaces after periods
        .replace(/\s+\./g, '.')        // Remove spaces before periods
        .replace(/\s+,/g, ',');        // Remove spaces before commas
      
      // Split into paragraphs on double newlines
      const paragraphs = formattedText.split(/\n\n+/);
      if (paragraphs.length > 1) {
        return (
          <div className="formatted-response">
            {paragraphs.map((paragraph, i) => {
              // Skip empty paragraphs
              if (!paragraph.trim()) return null;
              
              // Group consecutive list items
              if (paragraph.includes('<div class="list-item')) {
                const listItems = paragraph.split(/<\/div>\s*/).filter(item => item.includes('<div class="list-item'));
                return (
                  <div key={`para-${i}`} className="response-list-container">
                    {listItems.map((item, j) => (
                      <div key={`list-${i}-${j}`} dangerouslySetInnerHTML={{ __html: item + '</div>' }} />
                    ))}
                  </div>
                );
              }
              
              // Regular paragraph
              return (
                <p key={`para-${i}`} dangerouslySetInnerHTML={{ __html: paragraph }} className="response-paragraph" />
              );
            })}
          </div>
        );
      }
      
      // Convert single newlines to <br> tags for single paragraphs
      formattedText = formattedText.replace(/\n/g, '<br/>');
      
      return (
        <div className="formatted-response">
          <p dangerouslySetInnerHTML={{ __html: formattedText }} className="response-paragraph" />
        </div>
      );
    }
  };
  
  const renderFilePreview = () => {
    if (!message.file) return null;
    
    return (
      <div className="file-attachment">
        {isImageFile(message.file.type) ? (
          <div className="image-preview">
            <img src={message.file.url} alt={message.file.name} />
          </div>
        ) : (
          <div className="file-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
        )}
        <div className="file-info">
          <a href={message.file.url} target="_blank" rel="noopener noreferrer" className="file-name">
            {message.file.name}
          </a>
          <span className="file-size">{formatFileSize(message.file.size)}</span>
        </div>
      </div>
    );
  };

  // Render message content with better code block handling
  const renderMessageContent = () => {
    // Handle code blocks
    if (message.text.includes('```')) {
      const parts = message.text.split(/```(?:(\w+)\n)?/);
      const elements = [];
      
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          // Regular text
          if (parts[i].trim()) {
            elements.push(
              <div key={`text-${i}`} className="regular-text">
                {formatText(parts[i])}
              </div>
            );
          }
        } else {
          // Code block
          const language = parts[i-1] || '';
          const code = parts[i].trim();
          
          elements.push(
            <div key={`code-${i}`} className="code-block-wrapper">
              {language && (
                <div className="code-block-header">
                  <span>{language}</span>
                </div>
              )}
              <div className="code-block-content">
                <pre className="code-display">{code}</pre>
              </div>
            </div>
          );
        }
      }
      
      return <div className="message-text-with-code">{elements}</div>;
    }
    
    // Regular text message
    return formatText(message.text);
  };
  
  return (
    <div 
      ref={messageRef} 
      className={`message ${isUser ? 'user-message' : 'bot-message'} ${containsCodeBlock(message.text) ? 'contains-code' : ''}`}
      style={{ 
        opacity: 0, 
        transition: 'opacity 0.3s ease',
        width: '100%',
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start'
      }}
    >
      {!isUser && (
        <div className="message-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
      )}
      
      <div className="message-content">
        {renderMessageContent()}
        {message.file && renderFilePreview()}
        <span className="message-time">{formattedTime}</span>
      </div>
      
      {isUser && (
        <div className="message-avatar user-avatar">
          <span>{message.sender.charAt(0).toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

export default Message; 