import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, View } from 'react-native';
import 'react-native-reanimated';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import * as SplashScreen from 'expo-splash-screen';
import { StockProvider } from '../context/StockContext';
import { auth, db } from '../firebase/config';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const sessionIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(Entypo.font);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        userIdRef.current = user.uid;
        try {
          const sessionDoc = await addDoc(collection(db, 'userSessions'), {
            userId: user.uid,
            loginAt: serverTimestamp(),
            lastSeenAt: serverTimestamp(),
            appState: 'active',
            status: 'active',
          });
          sessionIdRef.current = sessionDoc.id;
        } catch (error) {
          console.error('Failed to start session', error);
        }
      } else if (sessionIdRef.current && userIdRef.current) {
        try {
          await updateDoc(doc(db, 'userSessions', sessionIdRef.current), {
            logoutAt: serverTimestamp(),
            status: 'signed_out',
          });
        } catch (error) {
          console.error('Failed to end session', error);
        } finally {
          sessionIdRef.current = null;
          userIdRef.current = null;
        }
      }
    });

    const handleAppStateChange = async (nextState: AppStateStatus) => {
      const sessionId = sessionIdRef.current;
      if (!sessionId) return;

      try {
        await updateDoc(doc(db, 'userSessions', sessionId), {
          lastSeenAt: serverTimestamp(),
          appState: nextState,
          ...(nextState !== 'active' ? { exitAt: serverTimestamp() } : {}),
        });
      } catch (error) {
        console.error('Failed to update session state', error);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      unsubscribeAuth();
    };
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StockProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </StockProvider>
    </View>
  );
}
