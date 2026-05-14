import React, { useState, useEffect } from 'react';
import { Launcher } from './Launcher';
import { AICoach } from './AICoach';
import { Planner } from './Planner';
import { FocusMode } from './FocusMode';
import { ProgressReport } from './ProgressReport';
import { AppDrawer } from './AppDrawer';
import { SplashScreen } from './SplashScreen';
import { NotesScreen } from './NotesScreen';
import { SettingsScreen } from './SettingsScreen';
import { AlarmScreen } from './AlarmScreen';
import { Battery, Wifi, Signal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';

export type ScreenType = 'splash' | 'launcher' | 'drawer' | 'coach' | 'planner' | 'focus' | 'progress' | 'notes' | 'settings' | 'alarm';

export function PhoneWrapper() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [time, setTime] = useState(new Date());
  const theme = useStore(state => state.theme);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative w-full max-w-[380px] h-[800px] ${theme} bg-white dark:bg-black rounded-[50px] border-[14px] border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden shadow-black/50 ring-1 ring-black/10 dark:ring-white/10 flex flex-col font-sans transition-colors duration-300`}>
      
      {/* Status Bar */}
      <div className="absolute top-0 w-full h-[40px] px-6 flex justify-between items-center z-50 text-black dark:text-white text-xs font-medium transition-colors duration-300">
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[26px] bg-neutral-300 dark:bg-neutral-800 rounded-b-3xl transition-colors duration-300"></div>
        
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 w-full h-full pt-[40px] relative bg-white dark:bg-black transition-colors duration-300">
        <AnimatePresence mode="wait">
          {currentScreen === 'splash' && (
             <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-50 bg-black">
               <SplashScreen onNavigate={setCurrentScreen} />
             </motion.div>
          )}
          {currentScreen === 'launcher' && (
             <motion.div key="launcher" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full">
               <Launcher onNavigate={setCurrentScreen} />
             </motion.div>
          )}
          {currentScreen === 'drawer' && (
             <motion.div key="drawer" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md">
               <AppDrawer onClose={() => setCurrentScreen('launcher')} onNavigate={setCurrentScreen} />
             </motion.div>
          )}
          {currentScreen === 'coach' && (
             <motion.div key="coach" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full bg-white dark:bg-black">
               <AICoach onNavigate={setCurrentScreen} />
             </motion.div>
          )}
          {currentScreen === 'planner' && (
             <motion.div key="planner" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full bg-white dark:bg-black">
               <Planner onNavigate={setCurrentScreen} />
             </motion.div>
          )}
          {currentScreen === 'focus' && (
             <motion.div key="focus" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="h-full bg-white dark:bg-black">
               <FocusMode onNavigate={setCurrentScreen} />
             </motion.div>
          )}
          {currentScreen === 'progress' && (
             <motion.div key="progress" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="h-full bg-white dark:bg-black">
               <ProgressReport onNavigate={setCurrentScreen} />
             </motion.div>
          )}
          {currentScreen === 'notes' && (
             <motion.div key="notes" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full bg-white dark:bg-black">
               <NotesScreen onNavigate={setCurrentScreen} />
             </motion.div>
          )}
          {currentScreen === 'settings' && (
             <motion.div key="settings" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full bg-white dark:bg-black">
               <SettingsScreen onNavigate={setCurrentScreen} />
             </motion.div>
          )}
          {currentScreen === 'alarm' && (
             <motion.div key="alarm" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full bg-white dark:bg-black">
               <AlarmScreen onNavigate={setCurrentScreen} />
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-black/30 dark:bg-white/30 rounded-full cursor-pointer hover:bg-black/50 dark:hover:bg-white/50 transition-colors z-50 animate-pulse" onClick={() => setCurrentScreen('launcher')}></div>
    </div>
  );
}
