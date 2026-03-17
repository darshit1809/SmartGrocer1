import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { InventoryProvider } from './src/context/InventoryContext';
import MainNavigator from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </InventoryProvider>
    </AuthProvider>
  );
}