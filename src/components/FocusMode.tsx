import React, { useState, useEffect } from 'react';
import { ScreenType } from './PhoneWrapper';
import { ChevronLeft, Play, XSquare, Grip, Flame, ShieldAlert, Lock, Unlock, Timer } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

export function FocusMode({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const [timerDuration, setTimerDuration] = useState(25);
  // For pure timer
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerTimeLeft, setTimerTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timerTimeLeft !== null && timerTimeLeft > 0) {
      interval = setInterval(() => {
        setTimerTimeLeft(prev => prev !== null ? Math.max(0, prev - 1000) : 0);
      }, 1000);
    } else if (timerTimeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerTimeLeft]);

  const handleStartTimer = () => {
    setIsTimerActive(true);
    setTimerTimeLeft(timerDuration * 60 * 1000);
  };

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
      <div className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-white/5 z-10 bg-black">
        <button onClick={() => onNavigate('launcher')} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex text-white items-center gap-2 font-bold tracking-wide">
          <Timer className="w-4 h-4" /> Deep Focus Timer
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col pt-6 overflow-y-auto pb-8 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div key="timer" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center w-full px-8 mt-12">
             {!isTimerActive ? (
               <>
                 <div className="w-48 h-48 rounded-full border-2 border-indigo-500/20 flex items-center justify-center mb-12">
                    <div className="text-6xl font-light tracking-tighter text-white">
                      {timerDuration}
                    </div>
                 </div>

                 <div className="w-full flex justify-between gap-4 mb-12">
                   {[15, 25, 45, 60].map(mins => (
                     <button key={mins} onClick={() => setTimerDuration(mins)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${timerDuration === mins ? 'bg-indigo-500 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}>
                       {mins}
                     </button>
                   ))}
                 </div>

                 <button onClick={handleStartTimer} className="w-full bg-white text-black py-4 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors">
                   <Play className="w-5 h-5" fill="currentColor" /> START TIMER
                 </button>
               </>
             ) : (
               <div className="flex flex-col items-center mt-8">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                     <div className="absolute inset-0 border-[6px] border-indigo-500/20 rounded-full"></div>
                     <motion.div className="absolute inset-0 border-[6px] border-indigo-500 rounded-full border-t-transparent border-r-transparent animate-spin" style={{ animationDuration: '3s' }}></motion.div>
                     <div className="flex flex-col items-center">
                       <Flame className="w-8 h-8 text-indigo-500 mb-2 animate-pulse" />
                       <span className="text-5xl font-mono tracking-tight text-white">
                         {timerTimeLeft !== null ? formatTime(timerTimeLeft) : '...'}
                       </span>
                     </div>
                  </div>
                  <button onClick={() => setIsTimerActive(false)} className="mt-16 flex flex-col items-center gap-2 text-neutral-500 hover:text-indigo-400 transition-colors group">
                    <XSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] tracking-widest uppercase font-bold">Stop</span>
                  </button>
               </div>
             )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
