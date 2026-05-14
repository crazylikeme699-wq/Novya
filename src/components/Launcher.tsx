import React from 'react';
import { useStore } from '../store';
import { ScreenType } from './PhoneWrapper';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { Brain, CalendarCheck, Settings2, Sparkles, ChevronUp, CheckCircle2, Circle, Sun, Moon, Clock, TrendingUp, FileText } from 'lucide-react';

export function Launcher({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const tasks = useStore((state) => state.tasks);
  const toggleTask = useStore((state) => state.toggleTask);
  const stats = useStore((state) => state.stats);
  const focusSession = useStore((state) => state.focusSession);
  const profilePicture = useStore((state) => state.profilePicture);
  const username = useStore((state) => state.username);
  const { theme, setTheme } = useStore();

  const pendingHabits = tasks.filter(t => !t.completed).slice(0, 3);
  const completedToday = tasks.filter(t => t.completed).length;

  return (
    <div className="flex flex-col h-full items-center px-6 pt-8 pb-8 text-neutral-800 dark:text-neutral-200 transition-colors duration-300 relative">
      
      {/* Profile in top left */}
      <div className="absolute top-4 left-6 pt-2">
        <button 
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {profilePicture ? (
             <img src={profilePicture} className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-800" alt="profile"/>
          ) : (
             <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                <span className="font-medium text-neutral-500 uppercase">{username?.charAt(0) || '?'}</span>
             </div>
          )}
        </button>
      </div>

      {/* Settings / Theme Toggle in top right */}
      <div className="absolute top-4 right-6 pt-2">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
        >
           {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Time & Date */}
      <div className="mt-12 text-center w-full flex flex-col items-center">
        <h1 className="text-6xl font-light tracking-tighter text-black dark:text-white transition-colors duration-300">
          {format(new Date(), 'HH:mm')}
        </h1>
        <p className="text-sm font-medium tracking-widest uppercase mt-2 text-neutral-500">
          {format(new Date(), 'EEEE, MMM do')}
        </p>
        
        {/* Gamification minimal bar */}
        <div className="mt-6 flex items-center gap-2">
           <div className="w-4 h-4 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-indigo-500 dark:text-indigo-400" />
           </div>
           <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Lvl {stats.level}</span>
           <div className="w-24 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden ml-2">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(stats.xp % 100)}%`}}></div>
           </div>
        </div>
      </div>

      <div className="flex-1 w-full flex justify-center items-center">
        {/* Core Tools Menu - Text Based */}
        <div className="flex flex-col gap-8 w-full max-w-[200px] mt-12">
          
          <button onClick={() => onNavigate('planner')} className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors group">
            <CalendarCheck className="w-5 h-5 text-neutral-400 dark:text-neutral-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
            <span className="text-lg font-medium tracking-wide">Plan Day</span>
          </button>

          <button onClick={() => onNavigate('alarm')} className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors group">
            <Clock className="w-5 h-5 text-neutral-400 dark:text-neutral-600 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" />
            <span className="text-lg font-medium tracking-wide">Alarms</span>
          </button>

          <button onClick={() => onNavigate('notes')} className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors group">
             <FileText className="w-5 h-5 text-neutral-400 dark:text-neutral-600 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors" />
             <span className="text-lg font-medium tracking-wide">Notes</span>
          </button>

          <button onClick={() => onNavigate('progress')} className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors group">
            <TrendingUp className="w-5 h-5 text-neutral-400 dark:text-neutral-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
            <span className="text-lg font-medium tracking-wide">Progress</span>
          </button>

        </div>
      </div>

      {/* Habits Widget */}
      <div className="w-full mt-auto mb-8 bg-neutral-100 dark:bg-neutral-900/50 rounded-2xl p-4 border border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => onNavigate('planner')}>
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Today's Habits</h2>
          <span className="text-xs font-mono text-neutral-500">{completedToday}/{tasks.length}</span>
        </div>
        
        {tasks.length === 0 ? (
          <p className="text-xs text-neutral-500 italic">No tasks set. Open Planner.</p>
        ) : pendingHabits.length > 0 ? (
          <div className="flex flex-col gap-3">
            {pendingHabits.map(task => (
              <div key={task.id} className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id)} className="text-neutral-400 dark:text-neutral-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  <Circle className="w-5 h-5" />
                </button>
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{task.title}</span>
              </div>
            ))}
          </div>
        ) : (
             <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400/80">
                 <CheckCircle2 className="w-4 h-4" />
                 <span className="text-xs font-medium">All completed!</span>
             </div>
        )}
      </div>

      {/* Swipe up hint */}
      {!focusSession.active ? (
        <button onClick={() => onNavigate('drawer')} className="flex flex-col items-center text-neutral-400 dark:text-neutral-600 hover:text-black dark:hover:text-white transition-colors pb-2">
          <ChevronUp className="w-5 h-5 animate-bounce" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Apps</span>
        </button>
      ) : (
        <div className="flex flex-col items-center text-rose-500/50 pb-2">
          <span className="text-[10px] uppercase tracking-widest font-bold">Focus Mode Active</span>
        </div>
      )}

    </div>
  );
}
