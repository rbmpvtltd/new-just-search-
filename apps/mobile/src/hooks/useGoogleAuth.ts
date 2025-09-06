// import { useState, useEffect } from 'react';
// import * as AuthSession from 'expo-auth-session';
// import * as WebBrowser from 'expo-web-browser';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// WebBrowser.maybeCompleteAuthSession();

// const useGoogleAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Google OAuth configuration
//   const discovery = {
//     authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
//     tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
//   };

//   const [request, response, promptAsync] = AuthSession.useAuthRequest(
//     {
//       clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your client ID
//       scopes: ['openid', 'profile', 'email'],
//       additionalParameters: {},
//       extraParams: {
//         access_type: 'offline',
//       },
//     },
//     discovery,
//   );

//   const signIn = async () => {
//     setLoading(true);
//     try {
//       const result = await promptAsync();
//       if (result?.type === 'success') {
//         await handleAuthSuccess(result.params.code);
//       }
//     } catch (error) {
//       console.error('Sign in error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAuthSuccess = async (code) => {
//     try {
//       // Exchange code for token
//       const tokenResponse = await fetch(
//         'https://www.googleapis.com/oauth2/v4/token',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//           body: new URLSearchParams({
//             client_id: 'YOUR_GOOGLE_CLIENT_ID',
//             client_secret: 'YOUR_GOOGLE_CLIENT_SECRET', // Only for demo - use backend
//             code,
//             grant_type: 'authorization_code',
//             redirect_uri: AuthSession.makeRedirectUri({ useProxy: true }),
//           }),
//         },
//       );

//       const tokens = await tokenResponse.json();

//       // Send token to your Laravel backend
//       const backendResponse = await fetch(
//         'YOUR_LARAVEL_API_URL/auth/google/mobile-callback',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             access_token: tokens.access_token,
//           }),
//         },
//       );

//       const userData = await backendResponse.json();

//       if (userData.token) {
//         await AsyncStorage.setItem('auth_token', userData.token);
//         await AsyncStorage.setItem('user_data', JSON.stringify(userData.user));
//         setUser(userData.user);
//       }
//     } catch (error) {
//       console.error('Token exchange error:', error);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await AsyncStorage.multiRemove(['auth_token', 'user_data']);
//       setUser(null);
//     } catch (error) {
//       console.error('Sign out error:', error);
//     }
//   };

//   const checkAuthState = async () => {
//     try {
//       const token = await AsyncStorage.getItem('auth_token');
//       const userData = await AsyncStorage.getItem('user_data');

//       if (token && userData) {
//         setUser(JSON.parse(userData));
//       }
//     } catch (error) {
//       console.error('Auth state check error:', error);
//     }
//   };

//   useEffect(() => {
//     checkAuthState();
//   }, []);

//   return {
//     user,
//     loading,
//     signIn,
//     signOut,
//     isAuthenticated: !!user,
//   };
// };

// export default useGoogleAuth;
