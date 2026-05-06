import React from 'react';
import { ScreenType } from './PhoneWrapper';
import { ChevronLeft, Trophy, Flame, Target, Star } from 'lucide-react';
import { useStore } from '../store';

export function ProgressReport({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const stats = useStore(state => state.stats);
  const tasks = useStore(state => state.tasks);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
      <div className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        <button onClick={() => onNavigate('launcher')} className="p-2 -ml-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-semibold tracking-widest uppercase text-black dark:text-white">Intelligence</span>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        
        {/* User Level Banner */}
        <div className="bg-gradient-to-br from-indigo-100/50 dark:from-indigo-900/40 to-transparent dark:to-black border border-indigo-500/20 rounded-3xl p-6 mb-8 flex flex-col items-center">
           <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
             <Trophy className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
           </div>
           <h2 className="text-3xl font-light text-black dark:text-white mb-1">Level {stats.level}</h2>
           <p className="text-sm text-indigo-600/70 dark:text-indigo-300/70">{stats.xp % 100} / 100 XP to next level</p>
           
           <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-900 rounded-full overflow-hidden mt-6">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(stats.xp % 100)}%`}}></div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-black/5 dark:border-white/5">
             <Flame className="w-5 h-5 text-orange-500 mb-3" />
             <div className="text-2xl font-light text-black dark:text-white mb-1">{stats.streak}</div>
             <div className="text-xs text-neutral-500 tracking-wide">Day Streak</div>
           </div>
           
           <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-black/5 dark:border-white/5">
             <Target className="w-5 h-5 text-emerald-500 mb-3" />
             <div className="text-2xl font-light text-black dark:text-white mb-1">{completionRate}%</div>
             <div className="text-xs text-neutral-500 tracking-wide">Completion Rate</div>
           </div>
        </div>

        {/* AI Insight */}
        <div className="mb-8">
           <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3">AI Insight</h3>
           <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 border border-black/5 dark:border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 text-black dark:text-white">
                <Star className="w-20 h-20" />
             </div>
             <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed relative z-10">
                You're building momentum. Your completion rate is higher on mornings where you plan ahead. Keep optimizing your day before 9 AM.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}
