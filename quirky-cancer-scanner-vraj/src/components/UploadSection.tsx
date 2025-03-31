import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import axios from "axios";

const UploadSection = ({ onUploadComplete }: { onUploadComplete: (result: any) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(t("errors.fileType"));
      toast({
        variant: "destructive",
        title: t("errors.invalidFileType"),
        description: t("errors.pleaseUploadImage"),
      });
      return;
    }
    
    setError(null);
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const saveToSupabase = async (result: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('scan_results')
        .insert([
          {
            user_id: user.id,
            image_name: file?.name,
            results: result.result.results.findings,
            category: result.result.category,
            timestamp: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Supabase error:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      });

      setProgress(100);
      
      // Save to Supabase
      const supabaseData = await saveToSupabase(response.data);
      
      // Set analysis result for display
      setAnalysisResult(response.data.result);
      
      setTimeout(() => {
        setUploading(false);
        onUploadComplete(response.data);
        
        toast({
          title: t("scans.analysisComplete"),
          description: t("scans.scanSuccessfullyAnalyzed"),
        });
      }, 1000);
      
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.message || t("errors.uploadFailed"));
      toast({
        variant: "destructive",
        title: t("errors.uploadFailed"),
        description: error.message || t("errors.errorDuringUpload"),
      });
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        <span className="text-gradient bg-gradient-to-r from-cancer-blue to-cancer-purple bg-clip-text text-transparent">
          {t("scans.uploadAndDiagnose")}
        </span>
      </h2>
      
      {!file ? (
        <div
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            className="hidden"
            accept="image/*"
          />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="mb-4 w-20 h-20 rounded-full bg-cancer-blue/10 flex items-center justify-center mx-auto">
              <Upload className="w-10 h-10 text-cancer-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t("scans.dragDropHere")}</h3>
            <p className="text-gray-500 mb-4">{t("scans.orClickToBrowse")}</p>
          </motion.div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative">
            {preview && <img src={preview} alt={t("scans.imagePreview")} className="w-full object-contain max-h-[400px]" />}
            <button 
              onClick={resetUpload} 
              className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="p-4">
            {uploading ? (
              <div className="space-y-3">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-gray-500">{t("scans.analyzing")}</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  analysisResult.results.cancer_status === "cancer" 
                    ? "bg-red-50 border border-red-200" 
                    : "bg-green-50 border border-green-200"
                }`}>
                  <h3 className="text-lg font-semibold mb-2">Analysis Results:</h3>
                  <div className="space-y-2">
                    <p><strong>Category:</strong> {analysisResult.category}</p>
                    <p><strong>Finding:</strong> {analysisResult.results.findings}</p>
                    <p><strong>Status:</strong> 
                      <span className={
                        analysisResult.results.findings === "cancer" 
                          ? "text-red-600 font-semibold" 
                          : "text-green-600 font-semibold"
                      }>
                        {" "}{analysisResult.results.findings === "cancer" ? "Cancer Detected" : "No Cancer Detected"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={resetUpload}>{t("common.newScan")}</Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Button variant="outline" onClick={resetUpload}>{t("common.cancel")}</Button>
                <Button className="bg-cancer-blue hover:bg-cancer-blue/90" onClick={handleUpload}>
                  {t("scans.analyze")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;