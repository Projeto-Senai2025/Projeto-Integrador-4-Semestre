import { create } from 'zustand';

export type Greenhouse = {
  id: string;
  name: string;
  temperature: number;
  airHumidity: number;
  soilHumidity: number;
  tempThreshold: number;
};

type State = {
  items: Greenhouse[];
  add: (name: string) => Greenhouse;
  update: (id: string, patch: Partial<Greenhouse>) => void;
};

const initial: Greenhouse[] = [
  { id: '1', name: 'Estufa 1', temperature: 23, airHumidity: 23, soilHumidity: 23, tempThreshold: 30 },
];

export const useGreenhouses = create<State>((set) => ({
  items: initial,
  add: (name) => {
    const gh: Greenhouse = {
      id: String(Date.now()),
      name,
      temperature: 23,
      airHumidity: 23,
      soilHumidity: 23,
      tempThreshold: 30,
    };
    set((s) => ({ items: [...s.items, gh] }));
    return gh;
  },
  update: (id, patch) =>
    set((s) => ({ items: s.items.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
}));
