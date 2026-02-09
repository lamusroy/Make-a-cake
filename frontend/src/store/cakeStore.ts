import { create } from 'zustand';

export interface CakeConfig {
  flavor: string | null;
  flavorColor: string | null;
  cakeSize: string | null; // 'small' | 'medium' | 'large' | 'party'
  sizeMultiplier: number; // Recipe multiplier based on size
  frosting: string | null;
  frostingColor: string | null;
  filling: string | null;
  fillingColor: string | null;
  decorations: string[];
  // Fine-tuning options
  fatType: number; // 0 = Butter, 100 = Oil
  fluffiness: number; // 0 = Whole eggs (dense), 100 = Whipped whites (fluffy)
  sweetness: number; // 0 = Less sweet, 100 = Extra sweet
  richness: number; // 0 = Standard, 100 = Extra yolks
  moistureBoost: string; // 'none' | 'sour-cream' | 'yogurt' | 'buttermilk'
  riseIntensity: number; // 0 = Low rise, 100 = High rise
}

interface CakeStore {
  cake: CakeConfig;
  setFlavor: (flavor: string, color: string) => void;
  setCakeSize: (size: string, multiplier: number) => void;
  setFrosting: (frosting: string, color: string) => void;
  setFilling: (filling: string, color: string) => void;
  setDecorations: (decorations: string[]) => void;
  toggleDecoration: (decoration: string) => void;
  setFatType: (value: number) => void;
  setFluffiness: (value: number) => void;
  setSweetness: (value: number) => void;
  setRichness: (value: number) => void;
  setMoistureBoost: (value: string) => void;
  setRiseIntensity: (value: number) => void;
  resetCake: () => void;
}

const initialCake: CakeConfig = {
  flavor: null,
  flavorColor: null,
  cakeSize: null,
  sizeMultiplier: 1,
  frosting: null,
  frostingColor: null,
  filling: null,
  fillingColor: null,
  decorations: [],
  fatType: 0, // Butter by default
  fluffiness: 0, // Whole eggs by default
  sweetness: 0, // Standard
  richness: 0, // Standard
  moistureBoost: 'none',
  riseIntensity: 50, // Medium
};

export const useCakeStore = create<CakeStore>((set) => ({
  cake: initialCake,
  setFlavor: (flavor, color) =>
    set((state) => ({ cake: { ...state.cake, flavor, flavorColor: color } })),
  setCakeSize: (cakeSize, sizeMultiplier) =>
    set((state) => ({ cake: { ...state.cake, cakeSize, sizeMultiplier } })),
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
  setFatType: (fatType) =>
    set((state) => ({ cake: { ...state.cake, fatType } })),
  setFluffiness: (fluffiness) =>
    set((state) => ({ cake: { ...state.cake, fluffiness } })),
  setSweetness: (sweetness) =>
    set((state) => ({ cake: { ...state.cake, sweetness } })),
  setRichness: (richness) =>
    set((state) => ({ cake: { ...state.cake, richness } })),
  setMoistureBoost: (moistureBoost) =>
    set((state) => ({ cake: { ...state.cake, moistureBoost } })),
  setRiseIntensity: (riseIntensity) =>
    set((state) => ({ cake: { ...state.cake, riseIntensity } })),
  resetCake: () => set({ cake: initialCake }),
}));

// Cake options data
export const flavorOptions = [
  { id: 'vanilla', name: 'Vanilla', color: '#F5E6D3', icon: 'snow-outline', type: 'cake' },
  { id: 'chocolate', name: 'Chocolate', color: '#5D4037', icon: 'square', type: 'cake' },
  { id: 'red-velvet', name: 'Red Velvet', color: '#B71C1C', icon: 'heart', type: 'cake' },
  { id: 'carrot', name: 'Carrot', color: '#FF9800', icon: 'nutrition', type: 'cake' },
  { id: 'lemon', name: 'Lemon', color: '#FFF59D', icon: 'sunny', type: 'cake' },
  { id: 'orange', name: 'Orange', color: '#FFB74D', icon: 'ellipse', type: 'cake' },
  { id: 'brownie', name: 'Brownie', color: '#3E2723', icon: 'grid', type: 'brownie' },
  { id: 'cheesecake', name: 'Cheesecake', color: '#FFF8E1', icon: 'pie-chart', type: 'cheesecake' },
];

export const frostingOptions = [
  { id: 'none', name: 'None (Plain)', color: '#F5F5F5', icon: 'close-circle-outline' },
  { id: 'buttercream', name: 'Buttercream', color: '#FFF8DC', icon: 'water' },
  { id: 'cream-cheese', name: 'Cream Cheese', color: '#FFFAF0', icon: 'cube' },
  { id: 'chocolate-ganache', name: 'Chocolate Ganache', color: '#3E2723', icon: 'moon' },
  { id: 'whipped-cream', name: 'Whipped Cream', color: '#FFFFFF', icon: 'cloud' },
  { id: 'zesty-glaze', name: 'Zesty Glaze', color: '#FFFDE7', icon: 'sunny' },
  { id: 'caramel', name: 'Caramel', color: '#D4A055', icon: 'flame' },
  { id: 'fondant', name: 'Fondant', color: '#E8F5E9', icon: 'ellipse' },
];

export const fillingOptions = [
  { id: 'none', name: 'None (Plain)', color: '#F5F5F5', icon: 'close-circle-outline' },
  { id: 'strawberry-jam', name: 'Strawberry Jam', color: '#E91E63', icon: 'rose' },
  { id: 'chocolate-mousse', name: 'Chocolate Mousse', color: '#5D4037', icon: 'moon' },
  { id: 'lemon-curd', name: 'Lemon Curd', color: '#FFEB3B', icon: 'sunny' },
  { id: 'fresh-berries', name: 'Fresh Berries', color: '#7B1FA2', icon: 'nutrition' },
  { id: 'vanilla-custard', name: 'Vanilla Custard', color: '#FFF9C4', icon: 'ellipse' },
  { id: 'caramel', name: 'Caramel', color: '#D4A055', icon: 'flame' },
];

export const decorationOptions = [
  { id: 'powdered-sugar', name: 'Powdered Sugar', icon: 'snow' },
  { id: 'sprinkles', name: 'Sprinkles', icon: 'sparkles' },
  { id: 'chocolate-chips', name: 'Choco Chips', icon: 'ellipse' },
  { id: 'fresh-fruits', name: 'Fresh Fruits', icon: 'nutrition' },
  { id: 'edible-flowers', name: 'Edible Flowers', icon: 'flower' },
  { id: 'nuts', name: 'Nuts', icon: 'baseball' },
  { id: 'caramel-drizzle', name: 'Caramel Drizzle', icon: 'water' },
  { id: 'whipped-cream-dollops', name: 'Cream Dollops', icon: 'cloud' },
  { id: 'candles', name: 'Candles', icon: 'flame' },
];

export const moistureBoostOptions = [
  { id: 'none', name: 'None', description: 'Standard recipe' },
  { id: 'sour-cream', name: 'Sour Cream', description: 'Tangy & tender' },
  { id: 'yogurt', name: 'Greek Yogurt', description: 'Light & moist' },
  { id: 'buttermilk', name: 'Buttermilk', description: 'Classic & fluffy' },
];
