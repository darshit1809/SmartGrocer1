import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SmartGrocer</Text>
      <Button
        title="Add Stock"
        onPress={() => navigation.navigate('AddStock')}
      />
      <Button
        title="Sales Entry"
        onPress={() => navigation.navigate('SalesEntry')}
      />
      <Button
        title="Product List"
        onPress={() => navigation.navigate('ProductList')}
      />
      <Button
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default DashboardScreen;