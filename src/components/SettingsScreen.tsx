import React, { useState, useRef } from 'react';
import { useStore } from '../store';
import { ScreenType } from './PhoneWrapper';
import { ChevronLeft, Moon, Sun, ImagePlus } from 'lucide-react';

export function SettingsScreen({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const { theme, setTheme, username, setUsername, profilePicture, setProfilePicture } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
        <button onClick={() => onNavigate('launcher')} className="p-2 -ml-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-semibold tracking-widest uppercase">Settings</span>
        <div className="w-6"></div>
      </div>
      
      <div className="p-6 flex flex-col gap-6 overflow-y-auto">
         {/* Profile Edit */}
         <div className="flex flex-col items-center mb-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-teal-500/50 flex items-center justify-center cursor-pointer hover:border-teal-400 transition-colors group bg-neutral-100 dark:bg-neutral-900 mb-4"
            >
              {profilePicture ? (
                <>
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ImagePlus className="w-6 h-6 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-teal-500/50 group-hover:text-teal-400 transition-colors">
                  <ImagePlus className="w-6 h-6 mb-1" />
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />

            <input 
              type="text" 
              placeholder="Username"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-center font-medium placeholder:text-neutral-500 focus:outline-none focus:border-teal-500 transition-colors px-2 py-1 w-full max-w-[200px]"
            />
         </div>

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
