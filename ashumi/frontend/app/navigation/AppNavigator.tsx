import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Import screens
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { FamilyMembersScreen } from '../screens/FamilyMembersScreen';
import { AddEditMemberScreen } from '../screens/AddEditMemberScreen';
import { ContributionPlanScreen } from '../screens/ContributionPlanScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Family: undefined;
  Plans: undefined;
  Chat: undefined;
  Settings: undefined;
};

export type FamilyStackParamList = {
  FamilyMembers: undefined;
  AddEditMember: { memberId?: string };
};

const RootStack = createStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const FamilyStack = createStackNavigator<FamilyStackParamList>();

const FamilyNavigator = () => {
  return (
    <FamilyStack.Navigator>
      <FamilyStack.Screen 
        name="FamilyMembers" 
        component={FamilyMembersScreen}
        options={{ title: 'Family Members' }}
      />
      <FamilyStack.Screen 
        name="AddEditMember" 
        component={AddEditMemberScreen}
        options={{ title: 'Add/Edit Member' }}
      />
    </FamilyStack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Dashboard' }}
      />
      <MainTab.Screen 
        name="Family" 
        component={FamilyNavigator}
        options={{ title: 'Family', headerShown: false }}
      />
      <MainTab.Screen 
        name="Plans" 
        component={ContributionPlanScreen}
        options={{ title: 'Plans' }}
      />
      <MainTab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
      <MainTab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </MainTab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // You could show a loading screen here
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <>
          <RootStack.Screen name="Welcome" component={WelcomeScreen} />
          <RootStack.Screen name="SignIn" component={SignInScreen} />
          <RootStack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </RootStack.Navigator>
  );
};