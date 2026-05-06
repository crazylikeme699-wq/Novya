import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType } from './PhoneWrapper';

export function SplashScreen({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isQuit, setIsQuit] = useState(false);

  useEffect(() => {
    // Show prompt after 2.8 seconds instead of navigating directly
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleYes = () => {
    onNavigate('launcher');
  };

  const handleNo = () => {
    setIsQuit(true);
  };

  if (isQuit) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black z-50 overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
          className="text-neutral-600 font-mono text-sm tracking-widest uppercase"
        >
          System Terminated.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black z-50 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!showPrompt ? (
          <motion.div
            key="logo"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center absolute inset-0"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="relative w-48 h-48 flex items-center justify-center"
            >
              <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="w-full h-full relative flex items-center justify-center"
              >
                <img 
                  src="/logo.png" 
                  alt="Novya Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(94,234,212,0.4)]"
                  onError={(e) => {
                     e.currentTarget.style.display = 'none';
                     const fallback = e.currentTarget.parentElement?.querySelector('.fallback-svg') as HTMLElement;
                     if (fallback) fallback.style.display = 'block';
                  }}
                />
                
                <div className="fallback-svg absolute inset-0 hidden">
                   <svg viewBox="0 0 100 100" className="w-full h-full text-teal-300">
                      <path d="M50 25 C50 45, 45 50, 25 50 C45 50, 50 55, 50 75 C50 55, 55 50, 75 50 C55 50, 50 45, 50 25 Z" fill="currentColor" />
                      {[...Array(8)].map((_, i) => (
                        <g key={i} transform={`rotate(${i * 45} 50 50)`}>
                          <polygon points="50,5 55,15 45,15" fill="currentColor" />
                        </g>
                      ))}
                   </svg>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 flex flex-col items-center"
            >
              <h1 className="text-4xl font-light tracking-[0.2em] text-white uppercase ml-3">
                Novya
              </h1>
              <p className="text-teal-400/60 mt-3 text-xs tracking-widest uppercase">
                Reclaim Your Focus
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center px-8 text-center absolute inset-0"
          >
             <h2 className="text-2xl font-light text-white mb-12 leading-relaxed">
               Are you ready for this <br/>
               <span className="text-teal-400 font-medium italic">difficult</span> and <span className="text-teal-400 font-medium italic">adventurous</span><br/>
               journey?
             </h2>
             <div className="flex gap-4 w-full max-w-xs">
                <button 
                  onClick={handleYes} 
                  className="flex-1 bg-white text-black py-4 rounded-2xl font-semibold tracking-wide hover:bg-teal-50 hover:text-teal-900 transition-colors"
                >
                   Yes
                </button>
                <button 
                  onClick={handleNo} 
                  className="flex-1 bg-neutral-900 border border-white/10 text-white py-4 rounded-2xl font-semibold tracking-wide hover:bg-neutral-800 transition-colors"
                >
                   No
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
