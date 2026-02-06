import { create } from 'zustand';

export interface CakeConfig {
  flavor: string | null;
  flavorColor: string | null;
  layers: number;
  frosting: string | null;
  frostingColor: string | null;
  filling: string | null;
  fillingColor: string | null;
  decorations: string[];
}

interface CakeStore {
  cake: CakeConfig;
  setFlavor: (flavor: string, color: string) => void;
  setLayers: (layers: number) => void;
  setFrosting: (frosting: string, color: string) => void;
  setFilling: (filling: string, color: string) => void;
  setDecorations: (decorations: string[]) => void;
  toggleDecoration: (decoration: string) => void;
  resetCake: () => void;
}

const initialCake: CakeConfig = {
  flavor: null,
  flavorColor: null,
  layers: 2,
  frosting: null,
  frostingColor: null,
  filling: null,
  fillingColor: null,
  decorations: [],
};

export const useCakeStore = create<CakeStore>((set) => ({
  cake: initialCake,
  setFlavor: (flavor, color) =>
    set((state) => ({ cake: { ...state.cake, flavor, flavorColor: color } })),
  setLayers: (layers) =>
    set((state) => ({ cake: { ...state.cake, layers } })),
  setFrosting: (frosting, color) =>
    set((state) => ({ cake: { ...state.cake, frosting, frostingColor: color } })),
  setFilling: (filling, color) =>
    set((state) => ({ cake: { ...state.cake, filling, fillingColor: color } })),
  setDecorations: (decorations) =>
    set((state) => ({ cake: { ...state.cake, decorations } })),
  toggleDecoration: (decoration) =>
    set((state) => {
      const current = state.cake.decorations;
      const newDecorations = current.includes(decoration)
        ? current.filter((d) => d !== decoration)
        : [...current, decoration];
      return { cake: { ...state.cake, decorations: newDecorations } };
    }),
  resetCake: () => set({ cake: initialCake }),
}));

// Cake options data
export const flavorOptions = [
  { id: 'vanilla', name: 'Vanilla', color: '#F5E6D3', icon: 'snow-outline' },
  { id: 'chocolate', name: 'Chocolate', color: '#5D4037', icon: 'square' },
  { id: 'red-velvet', name: 'Red Velvet', color: '#B71C1C', icon: 'heart' },
  { id: 'strawberry', name: 'Strawberry', color: '#F48FB1', icon: 'rose' },
  { id: 'lemon', name: 'Lemon', color: '#FFF59D', icon: 'sunny' },
  { id: 'carrot', name: 'Carrot', color: '#FF9800', icon: 'nutrition' },
];

export const frostingOptions = [
  { id: 'buttercream', name: 'Buttercream', color: '#FFF8DC', icon: 'water' },
  { id: 'cream-cheese', name: 'Cream Cheese', color: '#FFFAF0', icon: 'cube' },
  { id: 'chocolate-ganache', name: 'Chocolate Ganache', color: '#3E2723', icon: 'moon' },
  { id: 'whipped-cream', name: 'Whipped Cream', color: '#FFFFFF', icon: 'cloud' },
  { id: 'fondant', name: 'Fondant', color: '#E8F5E9', icon: 'ellipse' },
  { id: 'caramel', name: 'Caramel', color: '#D4A055', icon: 'flame' },
];

export const fillingOptions = [
  { id: 'strawberry-jam', name: 'Strawberry Jam', color: '#E91E63', icon: 'rose' },
  { id: 'chocolate-mousse', name: 'Chocolate Mousse', color: '#5D4037', icon: 'moon' },
  { id: 'lemon-curd', name: 'Lemon Curd', color: '#FFEB3B', icon: 'sunny' },
  { id: 'fresh-berries', name: 'Fresh Berries', color: '#7B1FA2', icon: 'nutrition' },
  { id: 'vanilla-custard', name: 'Vanilla Custard', color: '#FFF9C4', icon: 'ellipse' },
  { id: 'caramel', name: 'Caramel', color: '#D4A055', icon: 'flame' },
];

export const decorationOptions = [
  { id: 'sprinkles', name: 'Sprinkles', icon: 'sparkles' },
  { id: 'chocolate-chips', name: 'Choco Chips', icon: 'ellipse' },
  { id: 'fresh-fruits', name: 'Fresh Fruits', icon: 'nutrition' },
  { id: 'edible-flowers', name: 'Edible Flowers', icon: 'flower' },
  { id: 'nuts', name: 'Nuts', icon: 'baseball' },
  { id: 'caramel-drizzle', name: 'Caramel Drizzle', icon: 'water' },
  { id: 'whipped-cream-dollops', name: 'Cream Dollops', icon: 'cloud' },
  { id: 'candles', name: 'Candles', icon: 'flame' },
];
