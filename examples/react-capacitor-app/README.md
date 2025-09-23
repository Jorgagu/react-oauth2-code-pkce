# React OAuth2 PKCE Capacitor Example

This example demonstrates how to use `react-oauth2-code-pkce` in a Capacitor native application for mobile OAuth2 authentication.

## Overview

This Capacitor app shows the implementation of OAuth2 PKCE authentication specifically for native mobile applications. It uses the `native` login method which opens the OAuth authorization URL in an in-app browser.

## Prerequisites

- Node.js 18+
- Capacitor CLI: `npm install -g @capacitor/cli`
- Android Studio (for Android builds)
- Xcode (for iOS builds)

## Setup

1. **Install dependencies:**
   ```bash
   cd examples/react-capacitor-app
   npm install
   ```

2. **Configure OAuth2 settings:**

   Edit `src/main.tsx` and update the auth configuration:
   ```typescript
   const authConfig: TAuthConfig = {
     clientId: 'your-client-id',
     authorizationEndpoint: 'https://your-oauth-provider.com/oauth2/authorize',
     tokenEndpoint: 'https://your-oauth-provider.com/oauth2/token',
     redirectUri: 'com.yourapp.oauth://callback', // Your custom deep link
     // ... other config
   }
   ```

3. **Configure deep link handling:**

   Update `capacitor.config.ts` with your app's deep link scheme:
   ```typescript
   {
     appId: 'com.yourapp.oauth',
     // ... other config
   }
   ```

## Building and Running

### Web Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Android
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

### iOS
```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## How it Works

1. **Native Login Method**: Uses `loginMethod: 'native'` which is specifically designed for mobile apps
2. **Deep Link Handling**: The app registers a custom URL scheme (`com.yourapp.oauth://callback`) to handle OAuth redirects
3. **In-App Browser**: Uses Capacitor's Browser plugin to open the OAuth URL in an in-app browser
4. **Token Exchange**: After user authorization, the app receives the authorization code via deep link and exchanges it for tokens

## Key Configuration

- `loginMethod: 'native'` - Enables native mobile authentication flow
- `handleAuthorizationUrlCallback` - Callback that receives the OAuth URL to open in browser
- `redirectUri` - Deep link that your OAuth provider will redirect to after authentication

## Deep Link Setup

### 1. Configure OAuth Provider
Make sure your OAuth provider is configured to allow your deep link as a valid redirect URI:
```
com.yourapp.oauth://callback
```

### 2. iOS Configuration
Add the following to your `ios/App/App/Info.plist`:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.yourapp.oauth</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.yourapp.oauth</string>
    </array>
  </dict>
</array>
```

### 3. Android Configuration
Add the following intent filter to your `android/app/src/main/AndroidManifest.xml` inside the `<activity>` tag:
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="com.yourapp.oauth" android:host="callback" />
</intent-filter>
```

## Troubleshooting

- **Deep links not working**: Ensure your OAuth provider has the correct redirect URI configured
- **Browser not opening**: Check that the Capacitor Browser plugin is installed
- **Token exchange failing**: Verify your OAuth endpoints and client configuration