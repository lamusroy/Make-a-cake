import { create } from 'zustand';

export interface CakeConfig {
  flavor: string | null;
  flavorColor: string | null;
  dessertType: 'cake' | 'brownie' | 'cheesecake';
  cakeSize: string | null;
  sizeMultiplier: number;
  frosting: string | null;
  frostingColor: string | null;
  filling: string | null;
  fillingColor: string | null;
  decorations: string[];
  // Brownie-specific
  mixIns: string[];
  brownieTexture: 'fudgy' | 'balanced' | 'cakey' | null;
  brownieIntensity: 'dark' | 'milk' | 'white' | null;
  brownieFlavorProfile: string[]; // espresso, vanilla, cardamom
  // Cheesecake-specific
  cheesecakeStyle: 'new-york' | 'japanese' | 'basque' | 'no-bake' | null;
  crust: string | null;
  crustColor: string | null;
  cheesecakeTopping: string | null;
  cheesecakeToppingColor: string | null;
  // Cake fine-tuning options
  fatType: number;
  fluffiness: number;
  sweetness: number;
  richness: number;
  moistureBoost: string;
  riseIntensity: number;
}

interface CakeStore {
  cake: CakeConfig;
  setFlavor: (flavor: string, color: string, type: 'cake' | 'brownie' | 'cheesecake') => void;
  setCakeSize: (size: string, multiplier: number) => void;
  setFrosting: (frosting: string, color: string) => void;
  setFilling: (filling: string, color: string) => void;
  setDecorations: (decorations: string[]) => void;
  toggleDecoration: (decoration: string) => void;
  setMixIns: (mixIns: string[]) => void;
  toggleMixIn: (mixIn: string) => void;
  setBrownieTexture: (texture: 'fudgy' | 'balanced' | 'cakey') => void;
  setBrownieIntensity: (intensity: 'dark' | 'milk' | 'white') => void;
  toggleBrownieFlavorProfile: (profile: string) => void;
  setCheesecakeStyle: (style: 'new-york' | 'japanese' | 'basque' | 'no-bake') => void;
  setCrust: (crust: string, color: string) => void;
  setCheesecakeTopping: (topping: string, color: string) => void;
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
  dessertType: 'cake',
  cakeSize: null,
  sizeMultiplier: 1,
  frosting: null,
  frostingColor: null,
  filling: null,
  fillingColor: null,
  decorations: [],
  mixIns: [],
  brownieTexture: null,
  brownieIntensity: null,
  brownieFlavorProfile: [],
  cheesecakeStyle: null,
  crust: null,
  crustColor: null,
  cheesecakeTopping: null,
  cheesecakeToppingColor: null,
  fatType: 0,
  fluffiness: 0,
  sweetness: 0,
  richness: 0,
  moistureBoost: 'none',
  riseIntensity: 50,
};

export const useCakeStore = create<CakeStore>((set) => ({
  cake: initialCake,
  setFlavor: (flavor, color, type) =>
    set((state) => ({ cake: { ...state.cake, flavor, flavorColor: color, dessertType: type } })),
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
  setMixIns: (mixIns) =>
    set((state) => ({ cake: { ...state.cake, mixIns } })),
  toggleMixIn: (mixIn) =>
    set((state) => {
      const current = state.cake.mixIns;
      const newMixIns = current.includes(mixIn)
        ? current.filter((m) => m !== mixIn)
        : [...current, mixIn];
      return { cake: { ...state.cake, mixIns: newMixIns } };
    }),
  setBrownieTexture: (brownieTexture) =>
    set((state) => ({ cake: { ...state.cake, brownieTexture } })),
  setBrownieIntensity: (brownieIntensity) =>
    set((state) => ({ cake: { ...state.cake, brownieIntensity } })),
  toggleBrownieFlavorProfile: (profile) =>
    set((state) => {
      const current = state.cake.brownieFlavorProfile;
      const updated = current.includes(profile)
        ? current.filter((p) => p !== profile)
        : [...current, profile];
      return { cake: { ...state.cake, brownieFlavorProfile: updated } };
    }),
  setCheesecakeStyle: (cheesecakeStyle) =>
    set((state) => ({ cake: { ...state.cake, cheesecakeStyle } })),
  setCrust: (crust, color) =>
    set((state) => ({ cake: { ...state.cake, crust, crustColor: color } })),
  setCheesecakeTopping: (cheesecakeTopping, color) =>
    set((state) => ({ cake: { ...state.cake, cheesecakeTopping, cheesecakeToppingColor: color } })),
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

// Brownie mix-ins
export const mixInOptions = [
  { id: 'walnuts', name: 'Walnuts', icon: 'leaf' },
  { id: 'pecans', name: 'Pecans', icon: 'leaf-outline' },
  { id: 'chocolate-chips', name: 'Choco Chips', icon: 'ellipse' },
  { id: 'white-chocolate', name: 'White Choco', icon: 'ellipse-outline' },
  { id: 'peanut-butter', name: 'PB Swirl', icon: 'infinite' },
  { id: 'dried-cranberries', name: 'Cranberries', icon: 'nutrition' },
  { id: 'dried-cherries', name: 'Cherries', icon: 'heart' },
  { id: 'espresso', name: 'Espresso', icon: 'cafe' },
];

// Cheesecake crust options
export const crustOptions = [
  { id: 'graham-cracker', name: 'Graham Cracker', color: '#D7A86E', icon: 'square-outline' },
  { id: 'oreo', name: 'Oreo', color: '#2D2D2D', icon: 'moon' },
  { id: 'vanilla-wafer', name: 'Vanilla Wafer', color: '#F5E6D3', icon: 'ellipse-outline' },
  { id: 'shortbread', name: 'Shortbread', color: '#EED9A5', icon: 'albums' },
  { id: 'pretzel', name: 'Pretzel', color: '#C4A35A', icon: 'infinite' },
  { id: 'lotus', name: 'Lotus (Biscoff)', color: '#C8762B', icon: 'flower' },
  { id: 'maria', name: 'María Cookies', color: '#F0D9A0', icon: 'ellipse' },
  { id: 'no-crust', name: 'No Crust', color: '#FAFAFA', icon: 'close-circle-outline' },
];

// Cheesecake topping options
export const cheesecakeToppingOptions = [
  { id: 'none', name: 'Plain', color: '#F5F5F5', icon: 'close-circle-outline' },
  { id: 'strawberry', name: 'Strawberry Compote', color: '#E91E63', icon: 'heart' },
  { id: 'blueberry', name: 'Blueberry Compote', color: '#3949AB', icon: 'ellipse' },
  { id: 'mango', name: 'Mango Coulis', color: '#FF8F00', icon: 'sunny' },
  { id: 'caramel', name: 'Caramel', color: '#D4A055', icon: 'flame' },
  { id: 'dulce-de-leche', name: 'Dulce de Leche', color: '#C47A35', icon: 'water' },
  { id: 'chocolate-ganache', name: 'Chocolate Ganache', color: '#3E2723', icon: 'moon' },
  { id: 'whipped-cream', name: 'Whipped Cream', color: '#FFFFFF', icon: 'cloud' },
  { id: 'biscoff', name: 'Biscoff Spread', color: '#C8762B', icon: 'flower' },
];
