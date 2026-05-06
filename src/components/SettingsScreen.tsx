import React from 'react';
import { useStore } from '../store';
import { ScreenType } from './PhoneWrapper';
import { ChevronLeft, Moon, Sun } from 'lucide-react';

export function SettingsScreen({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const { theme, setTheme } = useStore();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
        <button onClick={() => onNavigate('launcher')} className="p-2 -ml-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-semibold tracking-widest uppercase">Settings</span>
        <div className="w-6"></div>
      </div>
      
      <div className="p-6 flex flex-col gap-6">
         <div>
            <h3 className="text-xs tracking-widest uppercase text-neutral-500 font-semibold mb-4 text-center">Appearance</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setTheme('light')} 
                className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${theme === 'light' ? 'bg-neutral-100 border-neutral-300 text-black shadow-inner shadow-neutral-200' : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800'}`}
              >
                <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-amber-500' : ''}`} />
                <span className="text-sm font-medium">Light</span>
              </button>
              
              <button 
                onClick={() => setTheme('dark')} 
                className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${theme === 'dark' ? 'bg-neutral-900 border-neutral-700 text-white shadow-inner shadow-black' : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800'}`}
              >
                <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-400' : ''}`} />
                <span className="text-sm font-medium">Dark</span>
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
