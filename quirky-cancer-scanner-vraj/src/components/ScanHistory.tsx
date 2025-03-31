import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Check,
  AlertCircle,
  ChevronRight,
  Clock,
  Search,
  SortAsc,
  SortDesc,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface ScanResult {
  id: string;
  timestamp: string;
  image_name: string;
  results: string;
  image_url?: string;
}

const ScanHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    const fetchScanHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No authenticated user found");
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('scan_results')
          .select('id, timestamp, image_name,results, image_url')
          .order('timestamp', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setScanHistory(data || []);
      } catch (error: any) {
        console.error("Error fetching scan history:", error);
        toast({
          variant: "destructive",
          title: t('errors.failedToLoadScanHistory'),
          description: error.message || t('errors.unexpectedError'),
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchScanHistory();
  }, [toast, t]);
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const locale = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleViewDetails = (scanId: string) => {
    navigate(`/scan-details/${scanId}`);
  };
  
  const filteredHistory = scanHistory
    .filter(scan => 
      scan.image_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(scan.timestamp).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">
        <span className="text-cancer-purple">
          {t('scans.scanHistory')}
        </span>
      </h2>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('common.searchScans')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cancer-blue/30"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="flex items-center"
          >
            {sortDirection === "asc" ? (
              <SortAsc className="w-4 h-4 mr-1" />
            ) : (
              <SortDesc className="w-4 h-4 mr-1" />
            )}
            {sortDirection === "asc" ? t('scans.oldest') : t('scans.newest')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Filter className="w-4 h-4 mr-1" />
            {t('common.filter')}
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider grid grid-cols-12 gap-4">
          <div className="col-span-1">{t('common.status')}</div>
          <div className="col-span-3">{t('common.date')}</div>
          <div className="col-span-4">{t('scans.fileName')}</div>
          <div className="col-span-2">{t('scans.results')}</div>
          <div className="col-span-2 text-right">{t('common.actions')}</div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">{t('common.loading')}</p>
            </div>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50"
              >
                <div className="col-span-1">
                  {scan.results?.toLowerCase() === "not_cancer" ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100">
                      <Check className="w-4 h-4 text-green-600" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </span>
                  )}
                </div>
                
                <div className="col-span-3 flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{formatDate(scan.timestamp)}</span>
                </div>
                
                <div className="col-span-4">
                  <span className="text-sm font-medium text-gray-700">{scan.image_name}</span>
                </div>
                
                <div className="col-span-2">
                  <span className={`text-sm font-medium ${
                    scan.results?.toLowerCase() === "normal" 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {scan.results}
                  </span>
                </div>
                
                <div className="col-span-2 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-cancer-blue hover:text-cancer-purple"
                    onClick={() => handleViewDetails(scan.id)}
                  >
                    {t('common.viewDetails')}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">{t('scans.noScanHistoryFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanHistory;
