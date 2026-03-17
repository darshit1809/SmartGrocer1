import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/DashboardScreen';
import AddStockScreen from '../screens/AddStockScreen';
import SalesEntryScreen from '../screens/SalesEntryScreen';
import ProductListScreen from '../screens/ProductListScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="AddStock" component={AddStockScreen} />
      <Stack.Screen name="SalesEntry" component={SalesEntryScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="Invoice" component={InvoiceScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;