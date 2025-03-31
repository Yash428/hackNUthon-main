import { useState } from "react";
import { motion } from "framer-motion";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  HelpCircle, 
  MessageSquare, 
  Book, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Mail,
  PlusCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full text-left p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

const Help = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const handleContactSupport = () => {
    toast({
      title: t('help.supportRequestSent'),
      description: t('help.supportRequestConfirmation'),
    });
  };
  
  const faqs = [
    {
      question: t('faq.accuracyQuestion'),
      answer: t('faq.accuracyAnswer')
    },
    {
      question: t('faq.interpretationQuestion'),
      answer: t('faq.interpretationAnswer')
    },
    {
      question: t('faq.sharingQuestion'),
      answer: t('faq.sharingAnswer')
    },
    {
      question: t('faq.imageTypesQuestion'),
      answer: t('faq.imageTypesAnswer')
    },
    {
      question: t('faq.dataProtectionQuestion'),
      answer: t('faq.dataProtectionAnswer')
    }
  ];
  
  const filteredFAQs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6">
          <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  <span className="text-gradient bg-gradient-to-r from-cancer-blue to-cancer-purple bg-clip-text text-transparent">
                    {t('help.title')}
                  </span>
                </h1>
                <p className="text-gray-600">
                  {t('help.subtitle')}
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-1"
              >
                <div className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">{t('help.topics')}</h2>
                    
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start text-cancer-blue bg-cancer-blue/5">
                        <HelpCircle className="w-5 h-5 mr-3" />
                        {t('help.faqs')}
                      </Button>
                      
                      <Button variant="ghost" className="w-full justify-start">
                        <Book className="w-5 h-5 mr-3" />
                        {t('help.userGuide')}
                      </Button>
                      
                      <Button variant="ghost" className="w-full justify-start">
                        <MessageSquare className="w-5 h-5 mr-3" />
                        {t('help.contactSupport')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-medium mb-3">{t('help.needMoreHelp')}</h3>
                    <Button 
                      className="w-full"
                      onClick={handleContactSupport}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {t('help.contactSupport')}
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-2"
              >
                <div className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-cancer-blue" />
                    {t('help.frequentlyAskedQuestions')}
                  </h2>
                  
                  <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder={t('help.searchFaqs')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cancer-blue/30"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">{t('help.noFaqsFound')}</p>
                        <Button 
                          variant="outline" 
                          className="mt-4 flex items-center"
                          onClick={() => setSearchQuery("")}
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          {t('help.askNewQuestion')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
