import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#FFF5E4' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="step1-flavor" />
          <Stack.Screen name="step2-size" />
          <Stack.Screen name="step3-frosting" />
          <Stack.Screen name="step4-filling" />
          <Stack.Screen name="step5-decorations" />
          <Stack.Screen name="step6-finetune" />
          <Stack.Screen name="recipe-result" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
