import { NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';

export type SupportedPlatform = 'instagram' | 'tiktok' | 'facebook' | 'youtube';

export interface ImportedData {
  platform: SupportedPlatform;
  sourceUrl?: string;
  sourceType: 'url' | 'csv';
  totalParticipants: number;
  participants?: Array<{
    username: string;
    profileUrl?: string;
    followers?: number;
    engagementRate?: number;
  }>;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainStackParamList = {
  HomeTabs: undefined;
  NewDraw: undefined;
  DrawConfig: {
    drawId?: string;
    importedData?: ImportedData;
    title?: string;
    description?: string;
  };
  DrawAnimation: { drawId: string };
  Results: { drawId: string };
  Credits: undefined;
  DrawHistory: undefined;
  EditProfile: undefined;
  Settings: undefined;
  HelpSupport: undefined;
};

export type TabParamList = {
  Home: undefined;
  NewDraw: undefined;
  Profile: undefined;
};

export type MainNavigationProp = NavigationProp<MainStackParamList>;
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

// Re-export AuthStackParamList for convenience
export type { AuthStackParamList };
