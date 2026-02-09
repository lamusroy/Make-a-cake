import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCakeStore, decorationOptions, moistureBoostOptions, mixInOptions, crustOptions } from '../src/store/cakeStore';
import { CakePreview } from '../src/components/CakePreview';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Helper functions for fine-tuning
const getFatTypeText = (value: number) => {
  if (value < 33) return { name: 'Butter', amount: '1 cup softened butter', tip: 'Rich, flavorful - perfect for milky cakes' };
  if (value > 66) return { name: 'Vegetable Oil', amount: '1 cup vegetable oil', tip: 'Extra moist - ideal for carrot cake, stays fresh longer' };
  return { name: 'Lard', amount: '1 cup lard (room temperature)', tip: 'Balanced - rich flavor with good moisture' };
};

const getFluffinessText = (value: number) => {
  if (value < 33) return { method: 'whole eggs', tip: 'Dense, fudgy texture' };
  if (value > 66) return { method: 'separated eggs (whip whites to stiff peaks, fold in last)', tip: 'Light, airy angel food texture' };
  return { method: 'eggs (beat until pale and fluffy)', tip: 'Classic cake texture' };
};

const getSweetnessAdjustment = (value: number) => {
  if (value < 33) return 'Reduce sugar by ¼ cup for less sweetness';
  if (value > 66) return 'Add extra ¼ cup sugar for decadent sweetness';
  return 'Standard sugar amount';
};

const getRichnessAdjustment = (value: number) => {
  if (value < 33) return 'Use recipe as-is';
  if (value > 66) return 'Add 2 extra egg yolks for richer texture';
  return 'Standard egg amount';
};

const getMoistureBoostText = (value: string) => {
  const options: any = {
    'none': '',
    'sour-cream': 'Add ½ cup sour cream for tangy moisture',
    'yogurt': 'Add ½ cup Greek yogurt for light moisture',
    'buttermilk': 'Replace milk with buttermilk for classic tang',
  };
  return options[value] || '';
};

const getRiseAdjustment = (value: number) => {
  if (value < 33) return 'Reduce baking powder by ½ tsp for denser cake';
  if (value > 66) return 'Add extra ½ tsp baking powder for higher rise';
  return 'Standard leavening';
};

// Size info for display
const getSizeInfo = (cakeSize: string | null) => {
  const sizes: any = {
    'small': { name: 'Small', servings: '6-8', volume: '4 cups batter' },
    'medium': { name: 'Medium', servings: '10-14', volume: '6 cups batter' },
    'large': { name: 'Large', servings: '16-20', volume: '8 cups batter' },
    'party': { name: 'Party Size', servings: '24-30', volume: '12 cups batter' },
  };
  return sizes[cakeSize || 'medium'] || sizes['medium'];
};

// Recipe generator based on selections
const generateRecipe = (cake: any) => {
  const fatInfo = getFatTypeText(cake.fatType);
  const fluffInfo = getFluffinessText(cake.fluffiness);
  const sizeInfo = getSizeInfo(cake.cakeSize);
  const multiplier = cake.sizeMultiplier || 1;
  
  // Scale ingredients based on size
  const scaleAmount = (base: string, mult: number) => {
    if (mult === 1) return base;
    if (mult === 0.75) return base.replace(/2½/g, '2').replace(/2/g, '1½').replace(/1 cup/g, '¾ cup').replace(/4 eggs/g, '3 eggs').replace(/3 tsp/g, '2 tsp');
    if (mult === 1.5) return base.replace(/2½/g, '3¾').replace(/2 cups/g, '3 cups').replace(/1 cup/g, '1½ cups').replace(/4 eggs/g, '6 eggs').replace(/3 tsp/g, '4½ tsp');
    if (mult === 2) return base.replace(/2½/g, '5').replace(/2 cups/g, '4 cups').replace(/1 cup/g, '2 cups').replace(/4 eggs/g, '8 eggs').replace(/3 tsp/g, '6 tsp');
    return base;
  };
  
  const recipes: any = {
    // Base recipes for different flavors
    'Vanilla': {
      base: `2½ cups all-purpose flour, 2 cups sugar, ${fatInfo.amount}, 4 eggs (${fluffInfo.method}), 1 cup milk, 2 tsp vanilla extract, 3 tsp baking powder, ½ tsp salt`,
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        `Cream ${fatInfo.name.toLowerCase()} and sugar until light and fluffy.`,
        `Add eggs ${cake.fluffiness > 50 ? '(yolks first, fold in whipped whites at end)' : 'one at a time, beating well after each addition'}.`,
        'Mix in vanilla extract.',
        'Combine flour, baking powder, and salt. Add alternately with milk.',
        cake.fluffiness > 50 ? 'Gently fold in whipped egg whites until just combined.' : '',
        'Pour into prepared pans and bake for 30-35 minutes.',
      ].filter(Boolean),
    },
    'Chocolate': {
      base: `2 cups flour, 2 cups sugar, ¾ cup cocoa powder, 2 tsp baking soda, 1 tsp salt, ${cake.fluffiness > 50 ? '4 eggs (separated)' : '2 eggs'}, 1 cup buttermilk, 1 cup hot coffee, ${fatInfo.amount}, 2 tsp vanilla`,
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        'Mix all dry ingredients in a large bowl.',
        `Add ${cake.fluffiness > 50 ? 'egg yolks' : 'eggs'}, buttermilk, ${fatInfo.name.toLowerCase()}, and vanilla. Beat for 2 minutes.`,
        'Stir in hot coffee (batter will be thin).',
        cake.fluffiness > 50 ? 'Whip egg whites to stiff peaks and gently fold into batter.' : '',
        'Pour into prepared pans and bake for 30-35 minutes.',
        'Cool completely before frosting.',
      ].filter(Boolean),
    },
    'Red Velvet': {
      base: `2½ cups flour, 2 cups sugar, 1 cup buttermilk, ${fatInfo.amount}, ${cake.fluffiness > 50 ? '4 eggs (separated)' : '2 eggs'}, 2 tbsp cocoa powder, 1 oz red food coloring, 1 tsp vanilla, 1 tsp baking soda, 1 tsp vinegar`,
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        'Mix flour and cocoa powder in a bowl.',
        `Beat sugar, ${fatInfo.name.toLowerCase()}, and ${cake.fluffiness > 50 ? 'egg yolks' : 'eggs'} until smooth.`,
        'Add food coloring and vanilla to mixture.',
        'Alternate adding flour mixture and buttermilk.',
        'Mix baking soda with vinegar and fold into batter.',
        cake.fluffiness > 50 ? 'Fold in stiffly whipped egg whites.' : '',
        'Pour into pans and bake for 25-30 minutes.',
      ].filter(Boolean),
    },
    'Orange': {
      base: `2½ cups flour, 2 cups sugar, ${fatInfo.amount}, 4 eggs (${fluffInfo.method}), ¾ cup fresh orange juice, ¼ cup milk, 2 tbsp orange zest, 3 tsp baking powder, ½ tsp salt`,
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        `Cream ${fatInfo.name.toLowerCase()} and sugar until fluffy.`,
        `Add eggs ${cake.fluffiness > 50 ? '(yolks first)' : 'one at a time'}, then orange zest.`,
        'Combine dry ingredients. Add alternately with orange juice and milk.',
        cake.fluffiness > 50 ? 'Fold in whipped egg whites gently.' : '',
        'Pour into pans and bake for 30-35 minutes.',
        'Pairs wonderfully with Zesty Glaze!',
      ].filter(Boolean),
    },
    'Lemon': {
      base: `3 cups flour, 2 cups sugar, ${fatInfo.amount}, 4 eggs (${fluffInfo.method}), 1 cup milk, ¼ cup lemon juice, 2 tbsp lemon zest, 3 tsp baking powder, ½ tsp salt`,
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        `Cream ${fatInfo.name.toLowerCase()} and sugar until light.`,
        `Add eggs ${cake.fluffiness > 50 ? '(yolks first)' : 'one at a time'}, then lemon juice and zest.`,
        'Combine dry ingredients. Add alternately with milk.',
        cake.fluffiness > 50 ? 'Gently fold in whipped egg whites.' : '',
        'Pour into pans and bake for 30-35 minutes.',
        'Pairs wonderfully with Zesty Glaze!',
      ].filter(Boolean),
    },
    'Carrot': {
      base: `2 cups flour, 2 cups sugar, 2 cups shredded carrots, ${fatInfo.amount}, 4 eggs (${fluffInfo.method}), 2 tsp cinnamon, 1 tsp baking soda, 1 tsp baking powder, ½ cup chopped walnuts (optional)`,
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        'Mix flour, sugar, cinnamon, baking soda, and baking powder.',
        `Add ${fatInfo.name.toLowerCase()} and ${cake.fluffiness > 50 ? 'egg yolks' : 'eggs'}, beat until combined.`,
        'Fold in shredded carrots and walnuts if using.',
        cake.fluffiness > 50 ? 'Fold in stiffly whipped egg whites for lighter texture.' : '',
        'Pour into pans and bake for 35-40 minutes.',
        'Cool completely before frosting.',
      ].filter(Boolean),
    },
    'Brownie': {
      base: `1 cup butter, 2 cups sugar, 4 eggs, 1 cup cocoa powder, 1 cup flour, ½ tsp salt, 1 tsp vanilla${cake.mixIns.length > 0 ? ', plus your mix-ins' : ''}`,
      instructions: [
        'Preheat oven to 350°F (175°C). Line a 9x13" pan with parchment paper.',
        'Melt butter and mix with sugar.',
        'Add eggs one at a time, then vanilla.',
        'Fold in cocoa powder, flour, and salt until just combined.',
        cake.mixIns.length > 0 ? `Fold in your mix-ins: ${cake.mixIns.map((id: string) => mixInOptions.find(m => m.id === id)?.name).join(', ')}.` : '',
        cake.sweetness > 50 ? 'For extra fudgy brownies, slightly underbake.' : '',
        'Pour into prepared pan and bake for 25-30 minutes.',
        'Cool completely before cutting into squares.',
      ].filter(Boolean),
    },
    'Cheesecake': {
      base: `For crust: 2 cups crushed ${cake.crust || 'graham crackers'}, ½ cup melted butter, ¼ cup sugar. For filling: 32 oz cream cheese, 1 cup sugar, 4 eggs, 1 cup sour cream, 2 tsp vanilla`,
      instructions: [
        'Preheat oven to 325°F (160°C). Wrap springform pan bottom with foil.',
        `Make crust: Mix crushed ${cake.crust || 'graham crackers'} with melted butter and sugar.`,
        'Press crust mixture firmly into bottom of pan. Bake 10 minutes.',
        'Beat cream cheese until smooth. Add sugar gradually.',
        'Add eggs one at a time on low speed.',
        'Mix in sour cream and vanilla.',
        'Pour over crust. Place pan in water bath.',
        'Bake 55-65 minutes until center barely jiggles.',
        'Turn off oven, crack door, leave cheesecake inside 1 hour.',
        'Refrigerate at least 4 hours or overnight before serving.',
      ],
    },
  };

  // Mix-in instructions for brownies
  const mixInInstructions: any = {
    'walnuts': 'Fold in 1 cup chopped walnuts for classic nutty brownies.',
    'pecans': 'Add 1 cup chopped pecans for Southern-style brownies.',
    'chocolate-chips': 'Mix in 1 cup chocolate chips for extra chocolate pockets.',
    'white-chocolate': 'Swirl in 1 cup white chocolate chips for contrast.',
    'peanut-butter': 'Dollop ½ cup peanut butter on top and swirl with a knife.',
    'dried-cranberries': 'Fold in ¾ cup dried cranberries for tartness.',
    'dried-cherries': 'Add ¾ cup dried cherries for a cherry-chocolate combo.',
    'espresso': 'Dissolve 2 tsp instant espresso in the melted butter to intensify chocolate flavor.',
  };

  const frostings: any = {
    'None (Plain)': null,
    'Buttercream': '1 cup softened butter, 4 cups powdered sugar, 2-4 tbsp milk, 2 tsp vanilla. Beat butter, add sugar gradually, then milk and vanilla until fluffy.',
    'Cream Cheese': '8 oz cream cheese, ½ cup butter, 4 cups powdered sugar, 1 tsp vanilla. Beat cream cheese and butter, add sugar and vanilla.',
    'Chocolate Ganache': '12 oz chocolate chips, 1 cup heavy cream. Heat cream, pour over chocolate, stir until smooth. Cool before pouring.',
    'Whipped Cream': '2 cups heavy whipping cream, ¼ cup powdered sugar, 1 tsp vanilla. Whip cream until stiff peaks form.',
    'Zesty Glaze': '2 cups powdered sugar, 3-4 tbsp fresh lemon or orange juice, 1 tsp zest. Mix until smooth and pourable. Drizzle over cooled cake. Perfect for citrus cakes!',
    'Caramel': '1 cup sugar, 6 tbsp butter, ½ cup heavy cream. Cook sugar until amber, add butter and cream.',
    'Fondant': 'Store-bought fondant or: 1 bag marshmallows, 2 lb powdered sugar, water. Melt marshmallows, knead in sugar.',
  };

  const fillings: any = {
    'None (Plain)': null,
    'Strawberry Jam': 'Spread 1 cup strawberry preserves between layers.',
    'Chocolate Mousse': 'Beat 2 cups heavy cream with 1 cup melted chocolate until thick.',
    'Lemon Curd': 'Cook ½ cup lemon juice, ¾ cup sugar, 3 eggs, 6 tbsp butter until thick.',
    'Fresh Berries': 'Layer fresh mixed berries between cake layers with whipped cream.',
    'Vanilla Custard': 'Make pastry cream: 2 cups milk, ½ cup sugar, 4 egg yolks, 3 tbsp cornstarch, 2 tsp vanilla.',
    'Caramel': 'Use store-bought or homemade caramel sauce between layers.',
  };

  const toppings: any = {
    'powdered-sugar': 'Dust generously with powdered sugar through a fine sieve for an elegant finish.',
    'sprinkles': 'Add colorful sprinkles while frosting is still soft.',
    'chocolate-chips': 'Press chocolate chips into frosting or sprinkle on top.',
    'fresh-fruits': 'Arrange fresh berries, sliced strawberries, or kiwi on top.',
    'edible-flowers': 'Decorate with food-safe flowers like pansies, violets, or roses.',
    'nuts': 'Toast chopped walnuts, pecans, or almonds and press onto sides.',
    'caramel-drizzle': 'Drizzle warm caramel sauce in decorative patterns.',
    'whipped-cream-dollops': 'Pipe rosettes of whipped cream around the top edge.',
    'candles': 'Add birthday candles for celebration!',
  };

  // Build fine-tuning tips
  const fineTuningTips = [
    fatInfo.tip,
    fluffInfo.tip,
    getSweetnessAdjustment(cake.sweetness),
    getRichnessAdjustment(cake.richness),
    getMoistureBoostText(cake.moistureBoost),
    getRiseAdjustment(cake.riseIntensity),
  ].filter(tip => tip && tip !== 'Standard sugar amount' && tip !== 'Use recipe as-is' && tip !== 'Standard leavening' && tip !== 'Standard egg amount');

  // Get mix-in instructions for brownies
  const mixInInstructionsList = cake.mixIns.map((id: string) => mixInInstructions[id]).filter(Boolean);

  return {
    base: recipes[cake.flavor || 'Vanilla'],
    frosting: cake.dessertType === 'cake' ? frostings[cake.frosting || 'Buttercream'] : null,
    filling: cake.dessertType === 'cake' ? fillings[cake.filling || 'None (Plain)'] : null,
    sizeInfo: sizeInfo,
    dessertType: cake.dessertType,
    decorations: cake.decorations.map((id: string) => decorationOptions.find(d => d.id === id)?.name).filter(Boolean),
    toppingInstructions: cake.decorations.map((id: string) => toppings[id]).filter(Boolean),
    // Brownie specific
    mixIns: cake.mixIns.map((id: string) => mixInOptions.find(m => m.id === id)?.name).filter(Boolean),
    mixInInstructions: mixInInstructionsList,
    // Cheesecake specific
    crust: cake.crust,
    fineTuning: {
      fatType: fatInfo.name,
      fluffiness: cake.fluffiness > 50 ? 'Extra Fluffy (whipped whites)' : 'Dense (whole eggs)',
      tips: fineTuningTips,
    },
  };
};

export default function RecipeResult() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cake = useCakeStore((state) => state.cake);
  const resetCake = useCakeStore((state) => state.resetCake);
  const [recipe, setRecipe] = useState<any>(null);

  const celebrationScale = useSharedValue(0);

  useEffect(() => {
    setRecipe(generateRecipe(cake));
    celebrationScale.value = withSequence(
      withTiming(1.2, { duration: 300 }),
      withSpring(1)
    );
  }, [cake]);

  const celebrationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));

  const handleShare = async () => {
    if (!recipe) return;
    
    // Format ingredients as a list
    const formatIngredients = (ingredientsStr: string) => {
      return ingredientsStr
        .split(', ')
        .map(ing => `• ${ing.trim()}`)
        .join('\n');
    };

    // Format instructions as a list
    const formatInstructions = (instructions: string[]) => {
      return instructions
        .map(step => `• ${step}`)
        .join('\n');
    };

    // Format frosting/filling recipe as list (split by periods or commas for ingredients)
    const formatRecipeText = (recipeStr: string) => {
      // Split by period to separate ingredients from instructions
      const parts = recipeStr.split('. ');
      if (parts.length > 1) {
        // First part is ingredients, rest is instructions
        const ingredients = parts[0].split(', ').map(ing => `• ${ing.trim()}`).join('\n');
        const instructions = parts.slice(1).map(inst => `• ${inst.trim().replace(/\.$/, '')}`).join('\n');
        return `${ingredients}\n${instructions}`;
      }
      // If no clear separation, just list by commas
      return recipeStr.split(', ').map(item => `• ${item.trim()}`).join('\n');
    };

    // Get dessert type emoji
    const getEmoji = () => {
      if (cake.dessertType === 'brownie') return '🍫';
      if (cake.dessertType === 'cheesecake') return '🧀';
      return '🎂';
    };

    // Build recipe text dynamically, skipping null sections
    let recipeText = `${getEmoji()} ${cake.flavor} ${cake.dessertType === 'cake' ? 'Cake' : cake.dessertType === 'brownie' ? 'Brownie' : 'Cheesecake'}\n`;
    recipeText += `${recipe.sizeInfo.name} • ${recipe.sizeInfo.servings} servings\n\n`;
    
    // Ingredients
    recipeText += `INGREDIENTS\n${formatIngredients(recipe.base.base)}\n`;
    
    // Instructions
    recipeText += `\nINSTRUCTIONS\n${formatInstructions(recipe.base.instructions)}\n`;
    
    // Frosting (only if exists and not "None")
    if (recipe.frosting && cake.frosting && !cake.frosting.includes('None')) {
      recipeText += `\nFROSTING — ${cake.frosting}\n${formatRecipeText(recipe.frosting)}\n`;
    }
    
    // Filling (only if exists and not "None")
    if (recipe.filling && cake.filling && !cake.filling.includes('None')) {
      recipeText += `\nFILLING — ${cake.filling}\n${formatRecipeText(recipe.filling)}\n`;
    }
    
    // Crust for cheesecake
    if (recipe.crust && cake.dessertType === 'cheesecake') {
      recipeText += `\nCRUST\n• ${recipe.crust}\n`;
    }
    
    // Mix-ins for brownies
    if (recipe.mixIns && recipe.mixIns.length > 0) {
      recipeText += `\nMIX-INS\n${recipe.mixIns.map((m: string) => `• ${m}`).join('\n')}\n`;
    }
    
    // Toppings (only if any selected)
    if (recipe.decorations && recipe.decorations.length > 0) {
      recipeText += `\nTOPPINGS\n${recipe.decorations.map((d: string) => `• ${d}`).join('\n')}\n`;
    }
    
    // Tips (only if any)
    if (recipe.fineTuning && recipe.fineTuning.tips && recipe.fineTuning.tips.length > 0) {
      recipeText += `\nTIPS\n${recipe.fineTuning.tips.map((t: string) => `• ${t}`).join('\n')}`;
    }
    
    try {
      await Share.share({
        message: recipeText.trim(),
        title: `${cake.flavor} Recipe`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartOver = () => {
    resetCake();
    router.replace('/');
  };

  if (!recipe) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#6B5B4F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Celebration */}
        <Animated.View style={[styles.celebrationContainer, celebrationStyle]}>
          <Text style={styles.celebrationEmoji}>{cake.dessertType === 'brownie' ? '🍫' : cake.dessertType === 'cheesecake' ? '🧀' : '🎉'}</Text>
          <Text style={styles.celebrationTitle}>
            {cake.dessertType === 'brownie' ? 'Your Brownies are Ready!' : 
             cake.dessertType === 'cheesecake' ? 'Your Cheesecake is Ready!' : 
             'Your Cake is Ready!'}
          </Text>
          <Text style={styles.celebrationSubtitle}>
            {recipe.sizeInfo.name} {cake.flavor} ({recipe.sizeInfo.servings} servings)
          </Text>
        </Animated.View>
        
        {/* Cake Preview - only for regular cakes */}
        {cake.dessertType === 'cake' && (
          <Animated.View 
            entering={FadeInDown.delay(200).duration(500)}
            style={styles.previewSection}
          >
            <CakePreview size="large" />
          </Animated.View>
        )}
        
        {/* Recipe Cards */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.recipeCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="list" size={24} color="#E85A4F" />
              <Text style={styles.cardTitle}>Ingredients</Text>
            </View>
            <Text style={styles.cardContent}>{recipe.base.base}</Text>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <View style={styles.recipeCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="reader" size={24} color="#E85A4F" />
              <Text style={styles.cardTitle}>Instructions</Text>
            </View>
            {recipe.base.instructions.map((step: string, index: number) => (
              <View key={index} style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
        
        {recipe.frosting && (
          <Animated.View entering={FadeInDown.delay(600).duration(500)}>
            <View style={styles.recipeCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="color-palette" size={24} color="#E85A4F" />
                <Text style={styles.cardTitle}>Frosting - {cake.frosting}</Text>
              </View>
              <Text style={styles.cardContent}>{recipe.frosting}</Text>
            </View>
          </Animated.View>
        )}
        
        {recipe.filling && (
          <Animated.View entering={FadeInDown.delay(700).duration(500)}>
            <View style={styles.recipeCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="layers" size={24} color="#E85A4F" />
                <Text style={styles.cardTitle}>Filling - {cake.filling}</Text>
              </View>
              <Text style={styles.cardContent}>{recipe.filling}</Text>
            </View>
          </Animated.View>
        )}
        
        {/* Brownie Mix-ins */}
        {recipe.mixIns && recipe.mixIns.length > 0 && (
          <Animated.View entering={FadeInDown.delay(700).duration(500)}>
            <View style={[styles.recipeCard, styles.brownieCard]}>
              <View style={styles.cardHeader}>
                <Ionicons name="grid" size={24} color="#5D4037" />
                <Text style={[styles.cardTitle, { color: '#5D4037' }]}>Mix-ins</Text>
              </View>
              <View style={styles.decorationsList}>
                {recipe.mixIns.map((mixIn: string, index: number) => (
                  <View key={index} style={[styles.decorationBadge, styles.mixInBadge]}>
                    <Text style={[styles.decorationText, { color: '#5D4037' }]}>{mixIn}</Text>
                  </View>
                ))}
              </View>
              {recipe.mixInInstructions && recipe.mixInInstructions.length > 0 && (
                <View style={styles.toppingInstructions}>
                  {recipe.mixInInstructions.map((instruction: string, index: number) => (
                    <View key={index} style={styles.toppingInstructionRow}>
                      <Ionicons name="checkmark-circle" size={16} color="#5D4037" />
                      <Text style={styles.toppingInstructionText}>{instruction}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Animated.View>
        )}
        
        {/* Cheesecake Crust */}
        {recipe.crust && (
          <Animated.View entering={FadeInDown.delay(650).duration(500)}>
            <View style={[styles.recipeCard, styles.cheesecakeCard]}>
              <View style={styles.cardHeader}>
                <Ionicons name="albums" size={24} color="#FF8F00" />
                <Text style={[styles.cardTitle, { color: '#FF8F00' }]}>Crust - {recipe.crust}</Text>
              </View>
              <Text style={styles.cardContent}>
                Crush cookies/crackers finely, mix with melted butter and sugar, press firmly into pan bottom.
              </Text>
            </View>
          </Animated.View>
        )}
        
        {recipe.decorations.length > 0 && (
          <Animated.View entering={FadeInDown.delay(800).duration(500)}>
            <View style={styles.recipeCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="sparkles" size={24} color="#E85A4F" />
                <Text style={styles.cardTitle}>Toppings</Text>
              </View>
              <View style={styles.decorationsList}>
                {recipe.decorations.map((dec: string, index: number) => (
                  <View key={index} style={styles.decorationBadge}>
                    <Text style={styles.decorationText}>{dec}</Text>
                  </View>
                ))}
              </View>
              {recipe.toppingInstructions && recipe.toppingInstructions.length > 0 && (
                <View style={styles.toppingInstructions}>
                  {recipe.toppingInstructions.map((instruction: string, index: number) => (
                    <View key={index} style={styles.toppingInstructionRow}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.toppingInstructionText}>{instruction}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Animated.View>
        )}
        
        {/* Fine-Tuning Adjustments */}
        {recipe.fineTuning && recipe.fineTuning.tips.length > 0 && (
          <Animated.View entering={FadeInDown.delay(850).duration(500)}>
            <View style={[styles.recipeCard, styles.fineTuningCard]}>
              <View style={styles.cardHeader}>
                <Ionicons name="options" size={24} color="#9C27B0" />
                <Text style={[styles.cardTitle, { color: '#9C27B0' }]}>Your Adjustments</Text>
              </View>
              <View style={styles.fineTuningBadges}>
                <View style={styles.fineTuningBadge}>
                  <Ionicons name="water" size={16} color="#8B5A2B" />
                  <Text style={styles.fineTuningBadgeText}>{recipe.fineTuning.fatType}</Text>
                </View>
                <View style={styles.fineTuningBadge}>
                  <Ionicons name="cloud" size={16} color="#8B5A2B" />
                  <Text style={styles.fineTuningBadgeText}>{recipe.fineTuning.fluffiness}</Text>
                </View>
              </View>
              <View style={styles.fineTuningTips}>
                {recipe.fineTuning.tips.map((tip: string, index: number) => (
                  <View key={index} style={styles.fineTuningTipRow}>
                    <Ionicons name="checkmark-circle" size={16} color="#9C27B0" />
                    <Text style={styles.fineTuningTipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* Tips */}
        <Animated.View entering={FadeInDown.delay(900).duration(500)}>
          <View style={[styles.recipeCard, styles.tipsCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="bulb" size={24} color="#D4A055" />
              <Text style={[styles.cardTitle, { color: '#6B5B4F' }]}>Pro Tips</Text>
            </View>
            <Text style={styles.tipsText}>
              • Room temperature ingredients mix better{"\n"}
              • Don't overmix the batter{"\n"}
              • Let cakes cool completely before frosting{"\n"}
              • Use a serrated knife to level cake layers
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Bottom Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.startOverButton}
          onPress={handleStartOver}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#FFF" />
          <Text style={styles.startOverText}>Make Another</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#C4704F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C4704F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  celebrationEmoji: {
    fontSize: 42,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A3F35',
  },
  celebrationSubtitle: {
    fontSize: 15,
    color: '#8B7355',
    marginTop: 4,
    textAlign: 'center',
  },
  previewSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C4704F',
  },
  cardContent: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 22,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#C4704F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 20,
  },
  decorationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  decorationBadge: {
    backgroundColor: '#F5EEE6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mixInBadge: {
    backgroundColor: '#E8E0D8',
  },
  decorationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B5B4F',
  },
  brownieCard: {
    backgroundColor: '#F5F0EB',
    borderWidth: 1,
    borderColor: '#E0D6CC',
  },
  cheesecakeCard: {
    backgroundColor: '#FFFCF5',
    borderWidth: 1,
    borderColor: '#F0E6D2',
  },
  toppingInstructions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDE6DC',
    gap: 8,
  },
  toppingInstructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  toppingInstructionText: {
    flex: 1,
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 18,
  },
  tipsCard: {
    backgroundColor: '#FFFCF5',
    borderWidth: 1,
    borderColor: '#F0E6D2',
  },
  tipsText: {
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 22,
  },
  fineTuningCard: {
    backgroundColor: '#FAF8FF',
    borderWidth: 1,
    borderColor: '#E8E0F0',
  },
  fineTuningBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  fineTuningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  fineTuningBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B5B4F',
  },
  fineTuningTips: {
    gap: 8,
  },
  fineTuningTipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  fineTuningTipText: {
    flex: 1,
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDE6DC',
  },
  startOverButton: {
    backgroundColor: '#C4704F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#C4704F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    gap: 8,
  },
  startOverText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
