
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import DashboardSidebar from "@/components/DashboardSidebar";
import { ArrowLeft, Calendar, FileText, Check, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanData {
  id: string;
  timestamp: string;
  image_name: string;
  detection_result: string;
  confidence: string;
  image_url?: string;
  biomarkers?: any;
  recommendations?: string[];
}

const ScanDetails = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const { scanId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScanDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('scan_results')
          .select('*')
          .eq('id', scanId)
          .single();
        
        if (error) throw error;
        
        setScanData(data);
      } catch (error: any) {
        console.error("Error fetching scan details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load scan details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (scanId) {
      fetchScanDetails();
    }
  }, [scanId, toast]);

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const downloadImage = () => {
    if (!scanData?.image_url) return;
    
    window.open(scanData.image_url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-cancer-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6">
          <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                className="mr-4 text-gray-600 hover:text-cancer-blue"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="text-gradient bg-gradient-to-r from-cancer-blue to-cancer-purple bg-clip-text text-transparent">
                  Scan Details
                </span>
              </h1>
            </div>
            
            {scanData ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <FileText size={20} className="mr-2 text-cancer-blue" />
                        Scan Information
                      </h2>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Image Name</p>
                          <p className="font-medium">{scanData.image_name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Scan Date</p>
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-gray-400" />
                            <p>{formatDate(scanData.timestamp)}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Result</p>
                          <div className="flex items-center mt-1">
                            {scanData.detection_result.toLowerCase() === "normal" ? (
                              <>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 mr-2">
                                  <Check className="w-4 h-4 text-green-600" />
                                </span>
                                <span className="font-medium text-green-600">Normal</span>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 mr-2">
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                </span>
                                <span className="font-medium text-red-600">Abnormal</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Confidence</p>
                          <p className={`font-medium ${
                            scanData.detection_result.toLowerCase() === "normal" 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {scanData.confidence}
                          </p>
                        </div>
                        
                        {scanData.biomarkers && (
                          <div>
                            <p className="text-sm text-gray-500">Biomarkers</p>
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <pre className="text-sm overflow-x-auto">
                                {JSON.stringify(scanData.biomarkers, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                        
                        {scanData.recommendations && scanData.recommendations.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Recommendations</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              {scanData.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm">{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      {scanData.image_url && (
                        <Button 
                          variant="outline" 
                          className="flex items-center" 
                          onClick={downloadImage}
                        >
                          <Download size={16} className="mr-2" />
                          Download Image
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Image Preview</h2>
                    {scanData.image_url ? (
                      <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 flex items-center justify-center">
                        <img 
                          src={scanData.image_url} 
                          alt={scanData.image_name} 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg overflow-hidden h-64 flex items-center justify-center bg-gray-50">
                        <p className="text-gray-400">No image available</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl border border-cancer-blue/10 shadow-sm p-6 text-center">
                <p className="text-gray-500">Scan not found. It may have been deleted or you don't have permission to view it.</p>
                <Button variant="outline" onClick={handleBack} className="mt-4">
                  Return to dashboard
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanDetails;
