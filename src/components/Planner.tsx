import React, { useState } from 'react';
import { useStore, Task } from '../store';
import { ScreenType } from './PhoneWrapper';
import { ChevronLeft, Plus, CheckCircle2, Circle, AlertCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export function Planner({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const [newTask, setNewTask] = useState('');
  const tasks = useStore(state => state.tasks);
  const addTask = useStore(state => state.addTask);
  const toggleTask = useStore(state => state.toggleTask);
  const deleteTask = useStore(state => state.deleteTask);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask({ title: newTask, dueDate: new Date().toISOString(), type: 'task' });
    setNewTask('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        <button onClick={() => onNavigate('launcher')} className="p-2 -ml-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-semibold tracking-widest uppercase text-black dark:text-white">Daily Plan</span>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        
        <div className="mb-8">
           <h2 className="text-2xl font-light text-black dark:text-white mb-2 transition-colors duration-300">Morning Routine</h2>
           <p className="text-xs text-neutral-500 font-medium tracking-wide">
             {format(new Date(), 'EEEE, MMMM do')}
           </p>
        </div>

        {/* Tasks List */}
        <div className="space-y-4 mb-8">
           {tasks.length === 0 ? (
              <div className="text-center py-8">
                 <AlertCircle className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
                 <p className="text-sm text-neutral-500">Your day is empty.</p>
              </div>
           ) : (
             tasks.map(task => (
                <div key={task.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${task.completed ? 'bg-neutral-100 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800' : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700/50'}`}>
                   <button onClick={() => toggleTask(task.id)} className="mt-0.5 text-neutral-400 dark:text-neutral-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex-shrink-0">
                      {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                   </button>
                   <div className="flex-1 min-w-0">
                      <p className={`text-sm tracking-wide ${task.completed ? 'text-neutral-400 dark:text-neutral-500 line-through' : 'text-neutral-800 dark:text-neutral-200'}`}>{task.title}</p>
                      {!task.completed && (
                        <p className="text-[10px] uppercase font-mono text-neutral-500 mt-2">XP +10</p>
                      )}
                   </div>
                   <button onClick={() => deleteTask(task.id)} className="mt-0.5 text-neutral-300 dark:text-neutral-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             ))
           )}
        </div>

        {/* Add input */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-20">
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add task (e.g. Learn React)..."
            className="flex-1 bg-neutral-100 dark:bg-neutral-900 text-sm text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-600 px-4 py-3 rounded-xl outline-none focus:ring-1 ring-black/10 dark:ring-white/20 transition-all font-medium border border-transparent focus:border-neutral-300 dark:focus:border-transparent"
          />
          <button type="submit" disabled={!newTask.trim()} className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-xl disabled:opacity-50 transition-opacity">
             <Plus className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
}
