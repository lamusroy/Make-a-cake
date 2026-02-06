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
import { useCakeStore, decorationOptions } from '../src/store/cakeStore';
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

// Recipe generator based on selections
const generateRecipe = (cake: any) => {
  const recipes: any = {
    // Base recipes for different flavors
    'Vanilla': {
      base: '2½ cups all-purpose flour, 2 cups sugar, 1 cup butter, 4 eggs, 1 cup milk, 2 tsp vanilla extract, 3 tsp baking powder, ½ tsp salt',
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        'Cream butter and sugar until light and fluffy.',
        'Add eggs one at a time, beating well after each addition.',
        'Mix in vanilla extract.',
        'Combine flour, baking powder, and salt. Add alternately with milk.',
        'Pour into prepared pans and bake for 30-35 minutes.',
      ],
    },
    'Chocolate': {
      base: '2 cups flour, 2 cups sugar, ¾ cup cocoa powder, 2 tsp baking soda, 1 tsp salt, 2 eggs, 1 cup buttermilk, 1 cup hot coffee, ½ cup vegetable oil, 2 tsp vanilla',
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        'Mix all dry ingredients in a large bowl.',
        'Add eggs, buttermilk, oil, and vanilla. Beat for 2 minutes.',
        'Stir in hot coffee (batter will be thin).',
        'Pour into prepared pans and bake for 30-35 minutes.',
        'Cool completely before frosting.',
      ],
    },
    'Red Velvet': {
      base: '2½ cups flour, 2 cups sugar, 1 cup buttermilk, 1½ cups vegetable oil, 2 eggs, 2 tbsp cocoa powder, 1 oz red food coloring, 1 tsp vanilla, 1 tsp baking soda, 1 tsp vinegar',
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        'Mix flour and cocoa powder in a bowl.',
        'Beat sugar, oil, and eggs until smooth.',
        'Add food coloring and vanilla to egg mixture.',
        'Alternate adding flour mixture and buttermilk.',
        'Mix baking soda with vinegar and fold into batter.',
        'Pour into pans and bake for 25-30 minutes.',
      ],
    },
    'Strawberry': {
      base: '2½ cups flour, 2 cups sugar, ¾ cup butter, 4 eggs, 1 cup strawberry puree, ½ cup milk, 3 tsp baking powder, ½ tsp salt, 1 tsp vanilla',
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        'Blend fresh strawberries to make puree.',
        'Cream butter and sugar until fluffy.',
        'Add eggs one at a time, then vanilla.',
        'Alternate adding dry ingredients with strawberry puree and milk.',
        'Bake for 30-35 minutes until done.',
      ],
    },
    'Lemon': {
      base: '3 cups flour, 2 cups sugar, 1 cup butter, 4 eggs, 1 cup milk, ¼ cup lemon juice, 2 tbsp lemon zest, 3 tsp baking powder, ½ tsp salt',
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        'Cream butter and sugar until light.',
        'Add eggs one at a time, then lemon juice and zest.',
        'Combine dry ingredients. Add alternately with milk.',
        'Pour into pans and bake for 30-35 minutes.',
        'Let cool before adding frosting.',
      ],
    },
    'Carrot': {
      base: '2 cups flour, 2 cups sugar, 2 cups shredded carrots, 1 cup vegetable oil, 4 eggs, 2 tsp cinnamon, 1 tsp baking soda, 1 tsp baking powder, ½ cup chopped walnuts (optional)',
      instructions: [
        'Preheat oven to 350°F (175°C). Grease and flour cake pans.',
        'Mix flour, sugar, cinnamon, baking soda, and baking powder.',
        'Add oil and eggs, beat until combined.',
        'Fold in shredded carrots and walnuts if using.',
        'Pour into pans and bake for 35-40 minutes.',
        'Cool completely before frosting.',
      ],
    },
  };

  const frostings: any = {
    'Buttercream': '1 cup softened butter, 4 cups powdered sugar, 2-4 tbsp milk, 2 tsp vanilla. Beat butter, add sugar gradually, then milk and vanilla until fluffy.',
    'Cream Cheese': '8 oz cream cheese, ½ cup butter, 4 cups powdered sugar, 1 tsp vanilla. Beat cream cheese and butter, add sugar and vanilla.',
    'Chocolate Ganache': '12 oz chocolate chips, 1 cup heavy cream. Heat cream, pour over chocolate, stir until smooth. Cool before pouring.',
    'Whipped Cream': '2 cups heavy whipping cream, ¼ cup powdered sugar, 1 tsp vanilla. Whip cream until stiff peaks form.',
    'Fondant': 'Store-bought fondant or: 1 bag marshmallows, 2 lb powdered sugar, water. Melt marshmallows, knead in sugar.',
    'Caramel': '1 cup sugar, 6 tbsp butter, ½ cup heavy cream. Cook sugar until amber, add butter and cream.',
  };

  const fillings: any = {
    'Strawberry Jam': 'Spread 1 cup strawberry preserves between layers.',
    'Chocolate Mousse': 'Beat 2 cups heavy cream with 1 cup melted chocolate until thick.',
    'Lemon Curd': 'Cook ½ cup lemon juice, ¾ cup sugar, 3 eggs, 6 tbsp butter until thick.',
    'Fresh Berries': 'Layer fresh mixed berries between cake layers with whipped cream.',
    'Vanilla Custard': 'Make pastry cream: 2 cups milk, ½ cup sugar, 4 egg yolks, 3 tbsp cornstarch, 2 tsp vanilla.',
    'Caramel': 'Use store-bought or homemade caramel sauce between layers.',
  };

  return {
    base: recipes[cake.flavor || 'Vanilla'],
    frosting: frostings[cake.frosting || 'Buttercream'],
    filling: fillings[cake.filling || 'Strawberry Jam'],
    layers: cake.layers,
    decorations: cake.decorations.map((id: string) => decorationOptions.find(d => d.id === id)?.name).filter(Boolean),
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
    
    const recipeText = `
🎂 My Custom ${cake.flavor} Cake Recipe 🎂

📋 INGREDIENTS:
${recipe.base.base}

🧁 FROSTING (${cake.frosting}):
${recipe.frosting}

🍰 FILLING (${cake.filling}):
${recipe.filling}

📝 INSTRUCTIONS:
${recipe.base.instructions.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}

🎨 Decorations: ${recipe.decorations.length > 0 ? recipe.decorations.join(', ') : 'None'}

Made with Make a Cake app! 🍰
    `;
    
    try {
      await Share.share({
        message: recipeText,
        title: `My ${cake.flavor} Cake Recipe`,
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
          <Ionicons name="arrow-back" size={24} color="#8B5A2B" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Celebration */}
        <Animated.View style={[styles.celebrationContainer, celebrationStyle]}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>Your Cake is Ready!</Text>
          <Text style={styles.celebrationSubtitle}>
            Here's the recipe for your {cake.layers}-layer {cake.flavor} cake
          </Text>
        </Animated.View>
        
        {/* Cake Preview */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.previewSection}
        >
          <CakePreview size="large" />
        </Animated.View>
        
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
        
        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <View style={styles.recipeCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="color-palette" size={24} color="#E85A4F" />
              <Text style={styles.cardTitle}>Frosting - {cake.frosting}</Text>
            </View>
            <Text style={styles.cardContent}>{recipe.frosting}</Text>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(700).duration(500)}>
          <View style={styles.recipeCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="layers" size={24} color="#E85A4F" />
              <Text style={styles.cardTitle}>Filling - {cake.filling}</Text>
            </View>
            <Text style={styles.cardContent}>{recipe.filling}</Text>
          </View>
        </Animated.View>
        
        {recipe.decorations.length > 0 && (
          <Animated.View entering={FadeInDown.delay(800).duration(500)}>
            <View style={styles.recipeCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="sparkles" size={24} color="#E85A4F" />
                <Text style={styles.cardTitle}>Decorations</Text>
              </View>
              <View style={styles.decorationsList}>
                {recipe.decorations.map((dec: string, index: number) => (
                  <View key={index} style={styles.decorationBadge}>
                    <Text style={styles.decorationText}>{dec}</Text>
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
              <Ionicons name="bulb" size={24} color="#FFB74D" />
              <Text style={[styles.cardTitle, { color: '#8B5A2B' }]}>Pro Tips</Text>
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
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={22} color="#FFF" />
          <Text style={styles.startOverText}>Make Another Cake</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E4',
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
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E85A4F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E85A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
    fontSize: 48,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8B5A2B',
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: '#A0785C',
    marginTop: 4,
    textAlign: 'center',
  },
  previewSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E85A4F',
  },
  cardContent: {
    fontSize: 15,
    color: '#5D4037',
    lineHeight: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E85A4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#5D4037',
    lineHeight: 22,
  },
  decorationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  decorationBadge: {
    backgroundColor: '#FFF0D4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  decorationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5A2B',
  },
  tipsCard: {
    backgroundColor: '#FFF9E8',
    borderWidth: 2,
    borderColor: '#FFE082',
  },
  tipsText: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF5E4',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8DDD4',
  },
  startOverButton: {
    backgroundColor: '#E85A4F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#E85A4F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    gap: 10,
  },
  startOverText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
