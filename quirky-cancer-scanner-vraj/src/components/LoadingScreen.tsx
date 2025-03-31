
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white to-cancer-blue/5 z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-32 h-32 mb-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cancer-blue to-cancer-purple rounded-full opacity-20 animate-pulse-glow"></div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="w-5 h-5 bg-cancer-blue rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-4 h-4 bg-cancer-purple rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"></div>
          <div className="w-4 h-4 bg-cancer-teal rounded-full absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-3 h-3 bg-cancer-pink rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
        <div className="absolute inset-2 rounded-full border-4 border-dashed border-cancer-blue/30 animate-rotate-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-cancer-dark font-exo">
            {progress}%
          </span>
        </div>
      </motion.div>
      
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-cancer-blue to-cancer-purple"
        ></motion.div>
      </div>
      
      <h2 className="mt-6 text-xl font-exo font-bold text-cancer-dark">
        Initializing CellScan
      </h2>
      <p className="text-sm text-gray-500 mt-2">Calibrating quantum scanners...</p>
    </div>
  );
};

export default LoadingScreen;
