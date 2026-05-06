import React, { useState } from 'react';
import { useStore } from '../store';
import { Search, ChevronDown, MonitorOff, Briefcase, User, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';

export function AppDrawer({ onClose, onNavigate }: { onClose: () => void, onNavigate: (screen: string) => void }) {
  const apps = useStore(state => state.apps);
  const profile = useStore(state => state.profile);
  const setProfile = useStore(state => state.setProfile);
  const focusSession = useStore(state => state.focusSession);
  const [search, setSearch] = useState('');

  const distractingIds = ['insta', 'tiktok', 'fb', 'youtube'];

  const filteredApps = apps.filter(app => {
    const isSearchMatch = app.name.toLowerCase().includes(search.toLowerCase());
    const isDistracting = distractingIds.includes(app.id);
    const isBlockedByWork = profile === 'work' && isDistracting;
    
    return isSearchMatch && !isBlockedByWork;
  });

  const handleAppClick = (appId: string) => {
    if (appId === 'notes') {
      onNavigate('notes');
    } else if (appId === 'settings') {
      onNavigate('settings');
    }
  };

  return (
    <div className="flex flex-col h-full px-6 pt-12 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onClose} className="p-2 -ml-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <ChevronDown className="w-6 h-6" />
        </button>
        <div className="flex bg-neutral-200 dark:bg-neutral-800 p-1 rounded-full">
           <button onClick={() => setProfile('personal')} className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors ${profile === 'personal' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-neutral-500'}`}>
              <User className="w-3.5 h-3.5" /> Personal
           </button>
           <button onClick={() => setProfile('work')} className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors ${profile === 'work' ? 'bg-indigo-500 text-white shadow-sm' : 'text-neutral-500'}`}>
              <Briefcase className="w-3.5 h-3.5" /> Work
           </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input 
          type="text" 
          placeholder="Search apps..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-neutral-800/50 text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-1 ring-black/10 dark:ring-white/20 transition-all shadow-sm dark:shadow-none"
        />
      </div>

      {/* App List - Text Based for Minimal Distraction */}
      <div className="flex-1 overflow-y-auto scrollbar-hide -mx-2 px-2 pb-20 space-y-1">
        {filteredApps.length === 0 ? (
          <p className="text-center text-sm text-neutral-500 mt-10">No apps found</p>
        ) : (
          filteredApps.map(app => {
            const Icon = (Icons as any)[app.icon] || MonitorOff;
            const isDistracting = distractingIds.includes(app.id);
            const isFocusBlocked = focusSession.active && focusSession.blockedApps.includes(app.id);
            const isCalendar = app.id === 'calendar';

            return (
              <button 
                key={app.id} 
                onClick={() => handleAppClick(app.id)}
                disabled={isFocusBlocked}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors text-left ${isFocusBlocked ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/50 group'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center opacity-80 ${!isFocusBlocked && 'group-hover:opacity-100'} transition-opacity bg-neutral-200 dark:bg-neutral-800`}>
                  {isCalendar ? (
                    <div className="flex flex-col items-center justify-center leading-none">
                       <span className="text-[8px] font-bold text-red-500 uppercase">{new Date().toLocaleString('en-US', { month: 'short' })}</span>
                       <span className="text-xs font-bold text-neutral-900 dark:text-white">{new Date().getDate()}</span>
                    </div>
                  ) : (
                    <Icon className={`w-4 h-4 ${isDistracting ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-700 dark:text-neutral-300'}`} />
                  )}
                </div>
                <span className={`text-sm font-medium tracking-wide ${isDistracting ? 'text-neutral-500' : 'text-neutral-800 dark:text-neutral-200'}`}>
                  {app.name}
                </span>
                {isFocusBlocked ? (
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                     <Lock className="w-3 h-3" /> LOCKED
                  </span>
                ) : isDistracting && profile === 'personal' ? (
                  <span className="ml-auto text-[10px] font-mono text-rose-500/80 bg-rose-500/10 px-2 py-0.5 rounded">Limit: 15m</span>
                ) : null}
              </button>
            )
          })
        )}
      </div>
    </div>
  );
}
