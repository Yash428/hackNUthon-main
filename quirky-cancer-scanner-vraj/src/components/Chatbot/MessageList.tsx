import React, { useEffect, useRef } from 'react';
import Message from './Message';
import './MessageList.css';

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

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const renderMessages = () => {
    return Object.keys(groupedMessages).map((date) => (
      <div key={date} className="message-group">
        <div className="date-divider">{date}</div>
        {groupedMessages[date].map((message) => (
          <Message key={message.id.toString()} message={message} />
        ))}
      </div>
    ));
  };

  return (
    <div className="message-list" ref={messageListRef}>
      {renderMessages()}
      <div ref={messagesEndRef} />
      
      {messages.length === 0 && (
        <div className="welcome-message">
          <h2>Welcome to the Cancer Detection Assistant</h2>
          <p>Ask questions about cancer detection, upload medical images for analysis, or inquire about symptoms and treatments. I'm here to provide information and assistance with your cancer-related queries.</p>
        </div>
      )}
    </div>
  );
}

export default MessageList; 