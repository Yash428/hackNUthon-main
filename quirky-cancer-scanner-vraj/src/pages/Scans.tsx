import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardSidebar from "@/components/DashboardSidebar";
import UploadSection from "@/components/UploadSection";
import ScanHistory from "@/components/ScanHistory";
import { useTranslation } from "react-i18next";

const Scans = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const { t } = useTranslation();
  
  const handleUploadComplete = (results: any) => {
    setScanResults(results);
    
    // Scroll to scan history section after a short delay
    setTimeout(() => {
      const historySection = document.getElementById("history-section");
      if (historySection) {
        historySection.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
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
                    {t('scans.scanManagement')}
                  </span>
                </h1>
                <p className="text-gray-600">
                  {t('scans.uploadOrViewHistory')}
                </p>
              </div>
            </motion.div>
            
            <UploadSection onUploadComplete={handleUploadComplete} />
            
            <motion.div
              id="history-section"
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

export default Scans;
