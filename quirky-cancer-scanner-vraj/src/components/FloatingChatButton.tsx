import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  // Hide on login and signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }
  
  // If already on chatbot page, don't show button
  if (location.pathname === '/chatbot') {
    return null;
  }

  const handleClick = () => {
    navigate('/chatbot');
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-cancer-blue shadow-lg transition-all duration-300 hover:scale-105 pulse-animation"
      style={{
        width: isHovered ? '180px' : '60px',
        height: '60px',
      }}
    >
      <div className="flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        
        {isHovered && (
          <span className="ml-2 text-white font-medium whitespace-nowrap overflow-hidden transition-all duration-300" style={{ opacity: isHovered ? 1 : 0 }}>
            Cancer Assistant
          </span>
        )}
      </div>
    </button>
  );
};

export default FloatingChatButton; 