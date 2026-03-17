import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InvoiceItemProps {
  productName: string;
  quantity: number;
  price: number;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({ productName, quantity, price }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{productName}</Text>
      <Text style={styles.details}>Quantity: {quantity}</Text>
      <Text style={styles.details}>Price: ${price.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
});

export default InvoiceItem;