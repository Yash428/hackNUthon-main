import React, { useState } from 'react';
import Chatbot from '../components/Chatbot/Chatbot';
import DashboardSidebar from '../components/DashboardSidebar';
import { useTranslation } from 'react-i18next';

const ChatbotPage: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex h-screen">
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{t('chatbot.title')}</h1>
        <p className="text-gray-700 mb-6">
          {t('chatbot.description')}
        </p>
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/20">
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage; 