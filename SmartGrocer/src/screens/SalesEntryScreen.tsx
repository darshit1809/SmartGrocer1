import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { InventoryContext } from '../context/InventoryContext';

const SalesEntryScreen = () => {
  const { products, enterSale } = useContext(InventoryContext);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = () => {
    if (productId && quantity) {
      enterSale(productId, parseInt(quantity));
      setProductId('');
      setQuantity('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Entry</Text>
      <TextInput
        style={styles.input}
        placeholder="Product ID"
        value={productId}
        onChangeText={setProductId}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity Sold"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
      />
      <Button title="Submit Sale" onPress={handleSubmit} />
      <View style={styles.productList}>
        <Text style={styles.productListTitle}>Available Products:</Text>
        {products.map(product => (
          <Text key={product.id}>{product.name} - {product.quantity} in stock</Text>
        ))}
      </View>
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
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  productList: {
    marginTop: 20,
  },
  productListTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default SalesEntryScreen;