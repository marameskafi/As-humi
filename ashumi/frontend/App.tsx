import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './app/navigation/AppNavigator';
import { AuthProvider } from './app/context/AuthContext';
import { FamilyProfileProvider } from './app/context/FamilyProfileContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <FamilyProfileProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </FamilyProfileProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}