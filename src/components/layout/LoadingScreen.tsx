import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3500; // 3.5s
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min(100, (currentStep / steps) * 100));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 500); // Slight delay after 100%
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-game-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-6xl font-black tracking-tighter mb-8">
          <span className="bg-gradient-to-r from-game-brick via-game-highlight to-game-tile bg-clip-text text-transparent animate-pulse">
            GEMINI
          </span>
          <span className="text-white ml-4">ARCADE</span>
        </h1>

        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto relative">
          <motion.div
            className="h-full bg-gradient-to-r from-game-brick to-game-highlight"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="mt-4 text-game-brick font-mono text-sm">
            LOADING ASSETS... {Math.round(progress)}%
        </p>
      </motion.div>
    </div>
  );
};

