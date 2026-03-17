// Screen to add daily stock
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useStock } from '../context/StockContext';

interface AddStockScreenProps {
  navigation: any;
}

const AddStockScreen: React.FC<AddStockScreenProps> = ({ navigation }) => {
  const { addStock } = useStock();
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleAddStock = () => {
    if (!productName || !quantity || !price) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    const qty = parseInt(quantity);
    const prc = parseFloat(price);
    
    if (isNaN(qty) || isNaN(prc) || qty <= 0 || prc <= 0) {
      Alert.alert('Error', 'Please enter valid numbers');
      return;
    }
    
    addStock(productName, qty, prc);
    Alert.alert('Success', 'Stock added successfully!');
    setProductName('');
    setQuantity('');
    setPrice('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Stock</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        placeholderTextColor="#999"
        value={productName}
        onChangeText={setProductName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        placeholderTextColor="#999"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Price per unit"
        placeholderTextColor="#999"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      
      <CustomButton title="Add Stock" onPress={handleAddStock} />
      
      <CustomButton
        title="Back to Dashboard"
        onPress={() => navigation.goBack()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#000',
  },
});

export default AddStockScreen;
