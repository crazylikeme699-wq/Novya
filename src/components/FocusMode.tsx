import React, { useState, useEffect } from 'react';
import { ScreenType } from './PhoneWrapper';
import { ChevronLeft, Play, XSquare, Grip, Flame, ShieldAlert, Lock, Unlock, Timer } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

export function FocusMode({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const { focusSession, startFocusSession, endFocusSession, apps, hasPermissions, setPermissions } = useStore();
  const distractingApps = apps.filter(a => ['insta', 'tiktok', 'fb', 'youtube'].includes(a.id));
  
  const [tab, setTab] = useState<'timer' | 'blocker'>('timer');
  const [timerDuration, setTimerDuration] = useState(25);
  const [blockDuration, setBlockDuration] = useState(60);
  const [selectedApps, setSelectedApps] = useState<string[]>(['insta', 'tiktok', 'fb', 'youtube']);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // For pure timer
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerTimeLeft, setTimerTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let interval: any;
    if (focusSession.active && focusSession.endTime) {
      interval = setInterval(() => {
        const remaining = Math.max(0, focusSession.endTime! - Date.now());
        setTimeLeft(remaining);
        if (remaining === 0) endFocusSession();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [focusSession, endFocusSession]);

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


  const handleStartBlocker = () => {
    startFocusSession(blockDuration, selectedApps);
  };

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
        <div className="flex bg-neutral-900 rounded-lg p-1">
          <button onClick={() => setTab('timer')} className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-2 transition-colors ${tab === 'timer' ? 'bg-neutral-700 text-white' : 'text-neutral-500'}`}>
            <Timer className="w-3.5 h-3.5" /> Timer
          </button>
          <button onClick={() => setTab('blocker')} className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-2 transition-colors ${tab === 'blocker' ? 'bg-rose-500/20 text-rose-500' : 'text-neutral-500'}`}>
            <ShieldAlert className="w-3.5 h-3.5" /> Blocker
          </button>
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col pt-6 overflow-y-auto pb-8 scrollbar-hide">
        <AnimatePresence mode="wait">
          {tab === 'timer' ? (
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
          ) : (
            <motion.div key="blocker" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col items-center w-full px-8">
               
               {!hasPermissions ? (
                 <div className="flex flex-col items-center text-center mt-12 bg-neutral-900 p-6 rounded-3xl border border-neutral-800">
                    <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
                    <h2 className="text-lg font-bold text-white mb-2">Permissions Required</h2>
                    <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                       App Blocker needs Device Accessibility and Usage Access to prevent distracting apps from opening.
                    </p>
                    <button onClick={() => setPermissions(true)} className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl font-bold tracking-wide transition-colors">
                      Grant Permissions
                    </button>
                 </div>
               ) : !focusSession.active ? (
                 <>
                   <div className="w-full flex justify-between gap-4 mb-8 mt-12">
                     {[15, 30, 60, 120].map(mins => (
                       <button key={mins} onClick={() => setBlockDuration(mins)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${blockDuration === mins ? 'bg-rose-500 text-white' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'}`}>
                         {mins}m
                       </button>
                     ))}
                   </div>

                   <div className="mb-10 w-full">
                      <h3 className="text-xs tracking-widest uppercase text-neutral-500 mb-4 font-semibold text-center">Select Apps to Lock</h3>
                      <div className="flex flex-col gap-2">
                        {distractingApps.map(app => (
                           <button
                             key={app.id}
                             onClick={() => setSelectedApps(prev => prev.includes(app.id) ? prev.filter(id => id !== app.id) : [...prev, app.id])}
                             className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedApps.includes(app.id) ? 'bg-rose-500/10 text-white border border-rose-500/30' : 'bg-neutral-900 text-neutral-500 border border-neutral-800'}`}
                           >
                             <span className="flex items-center gap-3">
                                <Lock className={`w-4 h-4 ${selectedApps.includes(app.id) ? 'text-rose-500' : 'text-neutral-600'}`} />
                                {app.name}
                             </span>
                             {selectedApps.includes(app.id) && (
                                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                             )}
                           </button>
                        ))}
                      </div>
                   </div>

                   <button onClick={handleStartBlocker} disabled={selectedApps.length === 0} className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:grayscale">
                     <Lock className="w-5 h-5" /> LOCK APPS
                   </button>
                 </>
               ) : (
                 <div className="flex flex-col items-center mt-12 w-full">
                    <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-full mb-8 relative">
                       <div className="absolute inset-0 rounded-full border border-rose-500 animate-ping opacity-20"></div>
                       <Lock className="w-12 h-12 text-rose-500" />
                    </div>
                    
                    <h2 className="text-4xl font-mono tracking-tight text-white mb-2">
                      {timeLeft !== null ? formatTime(timeLeft) : '...'}
                    </h2>
                    <p className="text-xs text-rose-500/70 font-semibold tracking-widest uppercase mb-12">Apps Locked</p>
                    
                    <div className="w-full bg-neutral-900 rounded-3xl p-6 border border-neutral-800">
                       <h3 className="text-xs text-neutral-500 mb-4 font-medium uppercase tracking-wider text-center">Locked Applications</h3>
                       <div className="flex flex-wrap gap-2 justify-center">
                          {apps.filter(a => focusSession.blockedApps.includes(a.id)).map(app => (
                            <div key={app.id} className="bg-black border border-neutral-800 px-3 py-1.5 rounded-lg text-xs text-neutral-400 flex items-center gap-1.5 grayscale opacity-70">
                               <Unlock className="w-3 h-3 text-neutral-600" />
                               {app.name}
                            </div>
                          ))}
                       </div>
                    </div>

                    <button onClick={endFocusSession} className="mt-12 text-[10px] text-neutral-600 hover:text-rose-400 uppercase tracking-widest font-bold underline underline-offset-4 transition-colors">
                       Emergency Unlock
                    </button>
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
