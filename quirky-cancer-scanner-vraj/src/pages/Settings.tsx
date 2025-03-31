import { useState } from "react";
import { motion } from "framer-motion";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Key, 
  Save, 
  Moon, 
  Sun, 
  Smartphone,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const handleSaveSettings = () => {
    toast({
      title: t('settings.settingsSaved'),
      description: t('settings.preferencesUpdated'),
    });
  };
  
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
                    {t('settings.title')}
                  </span>
                </h1>
                <p className="text-gray-600">
                  {t('settings.customizePreferences')}
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
                <div className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">{t('settings.categories')}</h2>
                  
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-cancer-blue bg-cancer-blue/5">
                      <SettingsIcon className="w-5 h-5 mr-3" />
                      {t('settings.general')}
                    </Button>
                    
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="w-5 h-5 mr-3" />
                      {t('settings.notifications')}
                    </Button>
                    
                    <Button variant="ghost" className="w-full justify-start">
                      <Lock className="w-5 h-5 mr-3" />
                      {t('settings.privacy')}
                    </Button>
                    
                    <Button variant="ghost" className="w-full justify-start">
                      <Key className="w-5 h-5 mr-3" />
                      {t('settings.security')}
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
                    <SettingsIcon className="w-5 h-5 mr-2 text-cancer-blue" />
                    {t('settings.generalSettings')}
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{t('settings.darkMode')}</h3>
                        <p className="text-sm text-gray-500">{t('settings.switchTheme')}</p>
                      </div>
                      <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full"
                      >
                        {darkMode ? (
                          <Moon className="w-6 h-6 text-cancer-purple" />
                        ) : (
                          <Sun className="w-6 h-6 text-cancer-blue" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{t('settings.emailNotifs')}</h3>
                        <p className="text-sm text-gray-500">{t('settings.receiveEmails')}</p>
                      </div>
                      <button 
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className="p-2 rounded-full"
                      >
                        {emailNotifications ? (
                          <ToggleRight className="w-6 h-6 text-cancer-blue" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{t('settings.mobileSyncLabel')}</h3>
                        <p className="text-sm text-gray-500">{t('settings.syncWithMobile')}</p>
                      </div>
                      <button className="p-2 rounded-full">
                        <Smartphone className="w-6 h-6 text-gray-400" />
                      </button>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <Button 
                        className="flex items-center"
                        onClick={handleSaveSettings}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {t('settings.saveSettings')}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-6">{t('settings.account')}</h2>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {t('settings.accountSettingsWarning')}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">{t('settings.changePassword')}</Button>
                  <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">{t('settings.deleteAccount')}</Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
