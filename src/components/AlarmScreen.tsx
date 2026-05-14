import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { ScreenType } from './PhoneWrapper';
import { ChevronLeft, Plus, Trash2, Clock, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AlarmScreen({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const alarms = useStore((state) => state.alarms);
  const addAlarm = useStore((state) => state.addAlarm);
  const toggleAlarm = useStore((state) => state.toggleAlarm);
  const deleteAlarm = useStore((state) => state.deleteAlarm);

  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('08:00');
  const [newLabel, setNewLabel] = useState('Wake Up');
  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);

  // Play alarm sound if an alarm matches current time and is enabled
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const currentSeconds = now.getSeconds();

      // Only check at the beginning of the minute to avoid multiple triggers
      if (currentSeconds === 0) {
        const ringingAlarm = alarms.find(a => a.enabled && a.time === currentTimeStr);
        if (ringingAlarm && !ringingAlarmId) {
          setRingingAlarmId(ringingAlarm.id);
          playAlarmSound();
        }
      }
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms, ringingAlarmId]);

  const playAlarmSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);

      // Play continuous beeps
      let beepCount = 0;
      const beepInterval = setInterval(() => {
        if (beepCount > 10) {
          clearInterval(beepInterval);
          return;
        }
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
        beepCount++;
      }, 1000);

      // Stop after 12 seconds
      setTimeout(() => {
        clearInterval(beepInterval);
      }, 12000);

    } catch (e) {
      console.error("Audio playback not supported or user hasn't interacted");
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTime) {
      addAlarm(newTime, newLabel);
      setIsAdding(false);
      setNewTime('08:00');
      setNewLabel('Wake Up');
    }
  };

  const handleStopRinging = () => {
    setRingingAlarmId(null);
  };

  // Sort alarms by time
  const sortedAlarms = [...alarms].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300 relative">
      {/* Header */}
      <div className="flex items-center px-4 py-4 z-10 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-300">
        <button onClick={() => onNavigate('launcher')} className="p-2 -ml-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-lg font-bold tracking-tight ml-2 text-black dark:text-white">Alarms</span>
        <button onClick={() => setIsAdding(true)} className="ml-auto p-2 -mr-2 text-orange-500 hover:text-orange-400 transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-2 pb-24 scrollbar-hide">
        {alarms.length === 0 && !isAdding ? (
          <div className="flex flex-col items-center justify-center h-48 text-neutral-400 dark:text-neutral-500 mt-12">
            <Clock className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm font-medium tracking-wide">No alarms set</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAlarms.map((alarm) => (
              <div key={alarm.id} className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 flex flex-col transition-colors duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className={`text-4xl font-light tracking-tighter ${alarm.enabled ? 'text-black dark:text-white' : 'text-neutral-400 dark:text-neutral-600'} transition-colors`}>
                      {alarm.time}
                    </h2>
                    {alarm.label && (
                      <p className={`text-sm mt-1 font-medium ${alarm.enabled ? 'text-orange-500 dark:text-orange-400' : 'text-neutral-400 dark:text-neutral-600'} transition-colors`}>
                        {alarm.label}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button 
                      onClick={() => toggleAlarm(alarm.id)} 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${alarm.enabled ? 'bg-orange-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alarm.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <button onClick={() => deleteAlarm(alarm.id)} className="text-neutral-400 hover:text-rose-500 transition-colors p-1 -mr-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Alarm Overlay */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="absolute inset-0 z-50 bg-white dark:bg-black p-6 flex flex-col transition-colors duration-300"
          >
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => setIsAdding(false)} className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Cancel</button>
              <h3 className="text-lg font-bold text-black dark:text-white">Add Alarm</h3>
              <button onClick={handleAddSubmit} className="text-sm font-bold text-orange-500 dark:text-orange-400">Save</button>
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 transition-colors">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-transparent text-5xl font-light tracking-tighter text-center text-black dark:text-white focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 px-2">Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Alarm label"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ringing Overlay */}
      <AnimatePresence>
        {ringingAlarmId && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-[100] bg-orange-500 flex flex-col items-center justify-center p-6 text-white"
          >
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-64 h-64 border-8 border-white/20 rounded-full animate-ping"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <Bell className="w-20 h-20 mb-6 animate-bounce" />
              <h2 className="text-6xl font-light tracking-tighter mb-4">
                {alarms.find(a => a.id === ringingAlarmId)?.time}
              </h2>
              <p className="text-xl font-medium tracking-wide mb-16 opacity-90">
                 {alarms.find(a => a.id === ringingAlarmId)?.label || "Alarm"}
              </p>

              <button 
                onClick={handleStopRinging}
                className="bg-white text-orange-500 w-full py-4 rounded-full font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors shadow-2xl"
              >
                <BellOff className="w-5 h-5" />
                Stop
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
