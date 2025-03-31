import React from 'react';
import { safeToFixed } from '@/utils/typeUtils';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface ResultData {
  detectionResult: string;
  confidence: string;
  biomarkers: {
    p53: number | string;
    ki67: number | string;
    her2: number | string;
  };
  recommendations: string[];
  imageName: string;
  timestamp: string;
  imageUrl?: string;
}

interface ResultsSectionProps {
  results: ResultData | null;
  isLoading?: boolean;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  results, 
  isLoading = false 
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-center text-gray-500">
          {t('scans.noResultsToDisplay')}
        </p>
      </div>
    );
  }

  const { detectionResult, confidence, biomarkers, recommendations } = results;
  const probabilityValue = parseFloat(confidence.replace('%', ''));

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gradient bg-gradient-to-r from-cancer-purple to-cancer-pink bg-clip-text text-transparent">
        {t('scans.scanResults')}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">{t('scans.diagnosis')}:</span>
            <span 
              className={`font-bold ${
                detectionResult.toLowerCase().includes("normal") 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}
            >
              {t(`scans.detectionResults.${detectionResult.toLowerCase()}`)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">{t('scans.confidence')}:</span>
            <span className="font-bold">{confidence}</span>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-800 mb-2">{t('scans.biomarkers')}:</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">p53</div>
                <div className="font-medium">{safeToFixed(biomarkers.p53)}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">ki67</div>
                <div className="font-medium">{safeToFixed(biomarkers.ki67)}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">her2</div>
                <div className="font-medium">{safeToFixed(biomarkers.her2)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">{t('scans.recommendations')}:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{t('scans.riskAssessment')}</span>
              <span>{probabilityValue}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  probabilityValue < 50 ? "bg-green-500" : 
                  probabilityValue < 80 ? "bg-yellow-500" : "bg-red-500"
                }`} 
                style={{ width: `${probabilityValue}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
