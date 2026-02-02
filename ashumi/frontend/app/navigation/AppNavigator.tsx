import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Logo, ProfileSwitcher } from '../../components';

// Import screens
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { StocksScreen } from '../screens/StocksScreen';
import { BasketsScreen } from '../screens/BasketsScreen';
import { FundingScreen } from '../screens/FundingScreen';
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
  Dashboard: undefined;
  Stocks: undefined;
  Baskets: undefined;
  Funding: undefined;
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
        tabBarActiveTintColor: '#4A7C59',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E9ECEF',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomColor: '#E9ECEF',
        },
        headerTitle: '', // Remove page titles
        headerLeft: () => (
          <View style={{ marginLeft: 16, justifyContent: 'center' }}>
            <Logo size="small" />
          </View>
        ),
        headerRight: () => (
          <View style={{ marginRight: 16, justifyContent: 'center' }}>
            <ProfileSwitcher showName={false} compact={true} />
          </View>
        ),
      }}
    >
      <MainTab.Screen 
        name="Dashboard" 
        component={HomeScreen}
        options={{ 
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />
      <MainTab.Screen 
        name="Stocks" 
        component={StocksScreen}
        options={{ 
          title: 'Stocks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          )
        }}
      />
      <MainTab.Screen 
        name="Baskets" 
        component={BasketsScreen}
        options={{ 
          title: 'Baskets',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder" size={size} color={color} />
          )
        }}
      />
      <MainTab.Screen 
        name="Funding" 
        component={FundingScreen}
        options={{ 
          title: 'Funding',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          )
        }}
      />
      <MainTab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          )
        }}
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