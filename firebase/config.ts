// Override Firebase's environment detection to prevent it from loading Node.js HTTP engines (like Undici) -> solves auth network request failed error
(global as any).__FIREBASE_DEFAULTS__ = { forceEnvironment: 'browser' };

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
// @ts-ignore – getReactNativePersistence is only in the RN build resolved by metro.config.js
import { Auth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

// Firebase configuration - using web app credentials
const firebaseConfig = {
  apiKey: 'AIzaSyB4hd4fExtrkQx_r6pI0MyVwbUPuKRRsFk',
  authDomain: 'smartgrocer-8b632.firebaseapp.com',
  projectId: 'smartgrocer-8b632',
  storageBucket: 'smartgrocer-8b632.firebasestorage.app',
  messagingSenderId: '1066511114120',
  appId: '1:1066511114120:web:65bf74e5af5e103184643d',
  measurementId: 'G-NSPW40XR7F',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use initializeAuth (not getAuth) with React Native AsyncStorage persistence.
// This explicitly registers the 'auth' component for the ReactNative platform,
// which prevents the "Component auth has not been registered yet" error.
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Cloud Firestore and get a reference to the service
export const db: Firestore = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage: FirebaseStorage = getStorage(app);

export default app;
