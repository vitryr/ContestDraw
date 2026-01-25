import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { NewDrawScreen } from '../screens/NewDrawScreen';
import { DrawConfigScreen } from '../screens/DrawConfigScreen';
import { DrawAnimationScreen } from '../screens/DrawAnimationScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { CreditsScreen } from '../screens/CreditsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DrawHistoryScreen } from '../screens/DrawHistoryScreen';
import { MainStackParamList, TabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'NewDraw') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="NewDraw"
        component={NewDrawScreen}
        options={{ tabBarLabel: 'New Draw' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HomeTabs" component={TabNavigator} />
      <Stack.Screen
        name="DrawConfig"
        component={DrawConfigScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="DrawAnimation"
        component={DrawAnimationScreen}
        options={{
          animation: 'fade',
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen
        name="Credits"
        component={CreditsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="DrawHistory" component={DrawHistoryScreen} />
    </Stack.Navigator>
  );
};
