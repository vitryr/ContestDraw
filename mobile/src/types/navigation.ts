import { NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainStackParamList = {
  HomeTabs: undefined;
  NewDraw: undefined;
  DrawConfig: { drawId?: string };
  DrawAnimation: { drawId: string };
  Results: { drawId: string };
  Credits: undefined;
  DrawHistory: undefined;
};

export type TabParamList = {
  Home: undefined;
  NewDraw: undefined;
  Profile: undefined;
};

export type MainNavigationProp = NavigationProp<MainStackParamList>;
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
