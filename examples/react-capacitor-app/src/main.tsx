import { App as CapacitorApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider, type TAuthConfig } from 'react-oauth2-code-pkce'
import App from './App.tsx'
import './index.css'

/**
 * Handle opening OAuth login URL in browser for Capacitor native app
 * @param {string} url - The OAuth authorization URL to open
 */
const handleLoginUrlReady = async (url: string): Promise<void> => {
  try {
    // Open the OAuth URL in an in-app browser
    await Browser.open({
      url,
      windowName: '_self',
      // Additional options for better UX
      presentationStyle: 'popover',
      toolbarColor: '#61dafb',
    })
  } catch (error) {
    console.error('Error opening browser:', error)
    // Fallback: try to open in the system browser
    window.open(url, '_blank')
  }
}

/**
 * Set up a deep link listener for OAuth callback
 */
CapacitorApp.addListener('appUrlOpen', (data) => {
  console.log('App opened with URL:', data.url)

  // Check if this is our OAuth callback
  if (data.url.startsWith('com.yourapp.oauth://callback')) {
    // Parse the URL to extract the authorization code
    const url = new URL(data.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    if (code) {
      // Redirect to the current page with the code as query parameter
      // This allows the react-oauth2-pkce library to handle the token exchange
      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.set('code', code)
      if (state) {
        currentUrl.searchParams.set('state', state)
      }
      window.location.replace(currentUrl.toString())
    }
  }
})

/**
 * OAuth2 configuration for Microsoft Azure AD
 * This example is specifically configured for Capacitor native apps
 */
const authConfig: TAuthConfig = {
  clientId: '6559ce69-219d-4e82-b6ed-889a861c7c94',
  authorizationEndpoint:
    'https://login.microsoftonline.com/d422398d-b6a5-454d-a202-7ed4c1bec457/oauth2/v2.0/authorize',
  tokenEndpoint: 'https://login.microsoftonline.com/d422398d-b6a5-454d-a202-7ed4c1bec457/oauth2/v2.0/token',

  // Use deep link for native app (replace with your app's deep link scheme)
  redirectUri: 'com.yourapp.oauth://callback',

  // Use a native login method for Capacitor
  loginMethod: 'native',

  // Handle login URL ready event for Capacitor in-app browser
  handleAuthorizationUrlCallback: handleLoginUrlReady,

  // Handle token expiration by prompting user to refresh
  onRefreshTokenExpire: (event) =>
    window.confirm('Tokens have expired. Refresh page to continue using the site?') && event.logIn(),

  // Store the current path before login to redirect back after authentication
  preLogin: () => localStorage.setItem('preLoginPath', window.location.pathname),
  postLogin: () => {
    const redirectPath = localStorage.getItem('preLoginPath') || '/'
    window.location.replace(redirectPath)
  },

  // Additional configuration
  decodeToken: true,
  scope: 'User.read',
  autoLogin: false, // Set to true if you want automatic login on page load
}

/**
 * Root component that wraps the App with AuthProvider
 * This ensures authentication context is available throughout the app
 */
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider authConfig={authConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
