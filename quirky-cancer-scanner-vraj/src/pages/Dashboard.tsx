import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/DashboardSidebar";
import ResultsSection from "@/components/ResultsSection";
import ScanHistory from "@/components/ScanHistory";
import { useTranslation } from "react-i18next";
import { ClipboardList, BrainCircuit, Scan } from "lucide-react";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [userData, setUserData] = useState({ name: "Guest" });
  const { t } = useTranslation();
  
  useEffect(() => {
    // Get user data from Supabase
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const fullName = user.user_metadata?.full_name || "User";
        setUserData({ name: fullName });
      }
    };
    
    getUserData();
    
    // Also check localStorage as a fallback
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.name !== "Guest") {
        setUserData(parsedUser);
      }
    }
  }, []);
  
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
                  <span className="text-gray-800">{t('common.hey')}, </span>
                  <span className="text-gradient bg-gradient-to-r from-cancer-blue to-cancer-purple bg-clip-text text-transparent">
                    {userData.name}!
                  </span>
                </h1>
                <p className="text-gray-600">
                  {t('dashboard.welcomeMessage')}
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/scans">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer h-full"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-cancer-teal/10 rounded-lg">
                      <Scan className="w-6 h-6 text-cancer-teal" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Upload Scan</h2>
                      <p className="text-gray-600 mt-1">Upload and analyze medical images for cancer detection</p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              <Link to="/quiz">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer h-full"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-cancer-blue/10 rounded-lg">
                      <BrainCircuit className="w-6 h-6 text-cancer-blue" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Take Risk Assessment Quiz</h2>
                      <p className="text-gray-600 mt-1">Evaluate your cancer risk factors through our interactive quiz</p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6"
            >
              <ScanHistory />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
