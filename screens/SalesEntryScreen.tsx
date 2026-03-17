// Screen to enter sold items
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useStock } from '../context/StockContext';

interface SalesEntryScreenProps {
  navigation: any;
}

const SalesEntryScreen: React.FC<SalesEntryScreenProps> = ({ navigation }) => {
  const { makeSale, products } = useStock();
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSale = () => {
    if (!productName || !quantity) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    const qty = parseInt(quantity);
    
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter valid quantity');
      return;
    }
    
    const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (!product) {
      Alert.alert('Error', 'Product not found');
      return;
    }
    
    if (product.quantity < qty) {
      Alert.alert('Error', `Only ${product.quantity} units available`);
      return;
    }
    
    makeSale(productName, qty);
    Alert.alert('Success', 'Sale recorded successfully!');
    setProductName('');
    setQuantity('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sales Entry</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Available Products:</Text>
        {products.map(p => (
          <Text key={p.id} style={styles.infoText}>
            {p.name}: {p.quantity} units @ ₹{p.price}
          </Text>
        ))}
      </View>
      
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
      
      <CustomButton title="Record Sale" onPress={handleSale} />
      
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
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    marginVertical: 2,
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

export default SalesEntryScreen;
