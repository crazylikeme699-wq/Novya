import React, { useState } from 'react';
import { useStore } from '../store';
import { ScreenType } from './PhoneWrapper';
import { ChevronLeft, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { format } from 'date-fns';

export function NotesScreen({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = () => {
    setEditingId('new');
    setTitle('');
    setContent('');
  };

  const handleEdit = (note: any) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      setEditingId(null);
      return;
    }
    
    if (editingId === 'new') {
      addNote(title || 'Untitled', content);
    } else if (editingId) {
      updateNote(editingId, title || 'Untitled', content);
    }
    setEditingId(null);
  };

  if (editingId !== null) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
        <div className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors duration-300">
          <button onClick={() => setEditingId(null)} className="p-2 -ml-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <span className="text-sm font-semibold tracking-widest uppercase text-black dark:text-white">Edit Note</span>
          <button onClick={handleSave} className="p-2 -mr-2 text-emerald-500 hover:text-emerald-400 transition-colors">
            <Save className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 flex flex-col p-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-2xl font-light text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 outline-none mb-4"
          />
          <textarea
            autoFocus
            placeholder="Start typing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-transparent text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 dark:placeholder-neutral-600 outline-none resize-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300 relative">
      <div className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        <button onClick={() => onNavigate('launcher')} className="p-2 -ml-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-semibold tracking-widest uppercase text-black dark:text-white">Notes</span>
        <button onClick={handleCreate} className="p-2 -mr-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 dark:text-neutral-600 mt-20">
            <Edit3 className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm">No notes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {notes.map(note => (
              <div 
                key={note.id} 
                onClick={() => handleEdit(note)}
                className="bg-neutral-50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/5 p-4 rounded-2xl flex flex-col cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group relative"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} 
                     className="p-1.5 bg-rose-500/10 text-rose-500 rounded-md hover:bg-rose-500/20"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </div>
                <h3 className="font-semibold text-neutral-800 dark:text-white text-sm mb-2 line-clamp-1 pr-6">{note.title}</h3>
                <p className="text-xs text-neutral-500 line-clamp-3 mb-4 flex-1">{note.content}</p>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono mt-auto pt-2 border-t border-black/5 dark:border-white/5">
                  {format(note.updatedAt, 'MMM d, HH:mm')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
