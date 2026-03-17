import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { InventoryContext } from '../context/InventoryContext';

const AddStockScreen = () => {
  const { addStock } = useContext(InventoryContext);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleAddStock = () => {
    if (productName && quantity && price) {
      addStock({ name: productName, quantity: parseInt(quantity), price: parseFloat(price) });
      setProductName('');
      setQuantity('');
      setPrice('');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Stock</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        keyboardType="decimal-pad"
        onChangeText={setPrice}
      />
      <Button title="Add Stock" onPress={handleAddStock} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default AddStockScreen;