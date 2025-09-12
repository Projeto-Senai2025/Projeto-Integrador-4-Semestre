import { create } from 'zustand';

export type Notification = {
  id: string;
  title: string;
  body: string;
  date: string;
  level: 'info' | 'warning' | 'danger';
};

type State = {
  list: Notification[];
  add: (n: Omit<Notification, 'id' | 'date'> & { date?: string }) => void;
  clear: () => void;
};

export const useNotifications = create<State>((set) => ({
  list: [],
  add: (n) =>
    set((s) => ({
      list: [
        { id: String(Date.now()), date: n.date ?? new Date().toLocaleString(), ...n },
        ...s.list,
      ],
    })),
  clear: () => set({ list: [] }),
}));
