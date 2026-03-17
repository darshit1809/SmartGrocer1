import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../context/AuthContext';
import { InventoryProvider } from '../context/InventoryContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <InventoryProvider>
          <AuthStack />
          <AppStack />
        </InventoryProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;