// Main app navigator
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddStockScreen from '../screens/AddStockScreen';
import SalesEntryScreen from '../screens/SalesEntryScreen';
import ProductListScreen from '../screens/ProductListScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Splash">
    <Stack.Screen 
      name="Splash" 
      component={SplashScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{ headerLeft: () => null }}
    />
    <Stack.Screen name="AddStock" component={AddStockScreen} />
    <Stack.Screen name="SalesEntry" component={SalesEntryScreen} />
    <Stack.Screen name="ProductList" component={ProductListScreen} />
    <Stack.Screen name="Invoice" component={InvoiceScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
