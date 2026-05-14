import React, { useState } from 'react';
import { useStore } from '../store';
import { Search, ChevronDown, MonitorOff } from 'lucide-react';
import * as Icons from 'lucide-react';

export function AppDrawer({ onClose, onNavigate }: { onClose: () => void, onNavigate: (screen: string) => void }) {
  const apps = useStore(state => state.apps);
  const [search, setSearch] = useState('');

  const filteredApps = apps.filter(app => {
    return app.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleAppClick = (appId: string) => {
    if (appId === 'notes') {
      onNavigate('notes');
    } else if (appId === 'settings') {
      onNavigate('settings');
    } else if (appId === 'alarm') {
      onNavigate('alarm');
    }
  };

  return (
    <div className="flex flex-col h-full px-6 pt-12 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onClose} className="p-2 -ml-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <ChevronDown className="w-6 h-6" />
        </button>
        <span className="text-sm font-medium tracking-widest uppercase text-neutral-500">Apps</span>
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
            const isCalendar = app.id === 'calendar';

            return (
              <button 
                key={app.id} 
                onClick={() => handleAppClick(app.id)}
                className="w-full flex items-center gap-4 p-3 rounded-xl transition-colors text-left hover:bg-neutral-100 dark:hover:bg-neutral-800/50 group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity bg-neutral-200 dark:bg-neutral-800">
                  {isCalendar ? (
                    <div className="flex flex-col items-center justify-center leading-none">
                       <span className="text-[8px] font-bold text-red-500 uppercase">{new Date().toLocaleString('en-US', { month: 'short' })}</span>
                       <span className="text-xs font-bold text-neutral-900 dark:text-white">{new Date().getDate()}</span>
                    </div>
                  ) : (
                    <Icon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  )}
                </div>
                <span className="text-sm font-medium tracking-wide text-neutral-800 dark:text-neutral-200">
                  {app.name}
                </span>
              </button>
            )
          })
        )}
      </div>
    </div>
  );
}
