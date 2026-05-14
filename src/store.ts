import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppIcon {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  isSystem?: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  type: 'habit' | 'task';
  streak?: number;
}

export interface FocusSession {
  active: boolean;
  endTime: number | null;
  blockedApps: string[];
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  label?: string;
}

export interface NovyaState {
  apps: AppIcon[];
  tasks: Task[];
  stats: UserStats;
  notes: Note[];
  focusSession: FocusSession;
  alarms: Alarm[];
  profile: 'personal' | 'work';
  hasPermissions: boolean;
  theme: 'dark' | 'light';
  username: string;
  profilePicture: string | null;
  hasCompletedSetup: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  setPermissions: (val: boolean) => void;
  setUsername: (username: string) => void;
  setProfilePicture: (pic: string | null) => void;
  setHasCompletedSetup: (val: boolean) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  addXP: (amount: number) => void;
  startFocusSession: (durationMinutes: number, blockedApps: string[]) => void;
  endFocusSession: () => void;
  setProfile: (profile: 'personal' | 'work') => void;
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  deleteTask: (id: string) => void;
  addAlarm: (time: string, label: string) => void;
  toggleAlarm: (id: string) => void;
  deleteAlarm: (id: string) => void;
}

const defaultApps: AppIcon[] = [
  { id: 'calendar', name: 'Calendar', icon: 'Calendar', bgColor: 'bg-red-500' },
  { id: 'notes', name: 'Notes', icon: 'FileText', bgColor: 'bg-yellow-500' },
  { id: 'alarm', name: 'Alarms', icon: 'Clock', bgColor: 'bg-orange-500' },
  { id: 'settings', name: 'Settings', icon: 'Settings', bgColor: 'bg-gray-700', isSystem: true },
];

export const useStore = create<NovyaState>()(
  persist(
    (set) => ({
      apps: defaultApps,
      alarms: [],
      tasks: [],
      notes: [],
      stats: {
        xp: 0,
        level: 1,
        streak: 0,
      },
      focusSession: {
        active: false,
        endTime: null,
        blockedApps: [],
      },
      profile: 'personal',
      hasPermissions: false,
      theme: 'dark',
      username: '',
      profilePicture: null,
      hasCompletedSetup: false,

      setTheme: (theme) => set({ theme }),
      setPermissions: (val) => set({ hasPermissions: val }),
      setUsername: (username) => set({ username }),
      setProfilePicture: (profilePicture) => set({ profilePicture }),
      setHasCompletedSetup: (hasCompletedSetup) => set({ hasCompletedSetup }),

      addNote: (title, content) =>
        set((state) => ({
          notes: [
            { id: Math.random().toString(36).substr(2, 9), title, content, updatedAt: Date.now() },
            ...state.notes,
          ],
        })),

      updateNote: (id, title, content) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, title, content, updatedAt: Date.now() } : note
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),

      setTasks: (tasks) => set({ tasks }),

      addTask: (taskInfo) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...taskInfo, id: Math.random().toString(36).substr(2, 9), completed: false },
          ],
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      addAlarm: (time, label) =>
        set((state) => ({
          alarms: [
            ...state.alarms,
            { id: Math.random().toString(36).substr(2, 9), time, label, enabled: true },
          ],
        })),

      toggleAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.map((a) =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
          ),
        })),

      deleteAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.filter((a) => a.id !== id),
        })),

      toggleTask: (id) =>
        set((state) => {
          let xpGained = 0;
          const newTasks = state.tasks.map((task) => {
            if (task.id === id) {
              if (!task.completed) xpGained = 10;
              return { ...task, completed: !task.completed };
            }
            return task;
          });
          
          const newXp = state.stats.xp + xpGained;
          const newLevel = Math.floor(newXp / 100) + 1;

          return {
            tasks: newTasks,
            stats: {
              ...state.stats,
              xp: newXp,
              level: newLevel,
            },
          };
        }),

      addXP: (amount) =>
        set((state) => {
          const newXp = state.stats.xp + amount;
          return {
            stats: {
              ...state.stats,
              xp: newXp,
              level: Math.floor(newXp / 100) + 1,
            },
          };
        }),

      startFocusSession: (durationMinutes, blockedApps) =>
        set(() => ({
          focusSession: {
            active: true,
            endTime: Date.now() + durationMinutes * 60 * 1000,
            blockedApps,
          },
        })),

      endFocusSession: () =>
        set(() => ({
          focusSession: {
            active: false,
            endTime: null,
            blockedApps: [],
          },
        })),

      setProfile: (profile) => set({ profile }),
    }),
    {
      name: 'novya-storage',
      partialize: (state) => {
        const { apps, ...rest } = state;
        return rest;
      },
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        apps: defaultApps, // Force apps to always be defaultApps, ignoring old storage
      }),
    }
  )
);
