# ContestDraw Mobile App

React Native mobile application built with Expo for iOS and Android.

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio

## Installation

```bash
cd mobile
npm install
```

## Development

Start the development server:

```bash
npm start
```

Run on specific platforms:

```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## Project Structure

```
mobile/
├── src/
│   ├── components/      # Reusable UI components
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # App screens
│   ├── services/        # API and business logic
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── config/         # App configuration
├── assets/             # Images, fonts, etc.
├── App.tsx             # Root component
├── app.json            # Expo configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## Key Features

- **Authentication**: Login, signup, password reset
- **Draw Management**: Create, configure, and execute draws
- **Animations**: Vertical Story-format draw animations
- **Payments**: iOS In-App Purchases & Android Stripe
- **Social Integration**: Instagram, TikTok, Facebook
- **Push Notifications**: Draw completion alerts
- **Offline Support**: Local caching with AsyncStorage

## Environment Configuration

Create `.env` file for environment variables:

```env
API_URL=http://localhost:8000/api
WS_URL=ws://localhost:8000
STRIPE_PUBLISHABLE_KEY_IOS=pk_test_...
STRIPE_PUBLISHABLE_KEY_ANDROID=pk_test_...
```

**Important:** The backend API runs on port 8000, not 3001. Make sure your backend server is running on `http://localhost:8000`.

For different platforms:
- **iOS Simulator**: Use `http://localhost:8000`
- **Android Emulator**: Use `http://10.0.2.2:8000`
- **Physical Device**: Use your machine's IP address (e.g., `http://192.168.1.X:8000`)

## Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

## Platform-Specific Notes

### iOS
- Uses Apple In-App Purchases (`react-native-iap`)
- Requires Apple Developer Account
- Test with Sandbox accounts

### Android
- Uses Stripe for payments
- Requires Google Play Developer Account
- Test with test cards

## Testing

```bash
npm test
```

## Code Quality

```bash
npm run lint      # ESLint
npm run typecheck # TypeScript
```

## Troubleshooting

### Metro Bundler Issues
```bash
expo start --clear
```

### iOS Pod Install Issues
```bash
cd ios && pod install && cd ..
```

### Android Gradle Issues
```bash
cd android && ./gradlew clean && cd ..
```

## License

MIT
