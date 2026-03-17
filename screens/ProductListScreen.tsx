// Screen to view product list and stock
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useStock } from '../context/StockContext';

interface ProductListScreenProps {
  navigation: any;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  const { products } = useStock();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Product List</Text>
      
      {products.length === 0 ? (
        <Text style={styles.emptyText}>No products available</Text>
      ) : (
        products.map(product => (
          <View key={product.id} style={styles.productCard}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDetail}>Quantity: {product.quantity}</Text>
            <Text style={styles.productDetail}>Price: ₹{product.price}</Text>
            <Text style={styles.productDetail}>Value: ₹{product.quantity * product.price}</Text>
          </View>
        ))
      )}
      
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
  productCard: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  productDetail: {
    fontSize: 16,
    color: '#000',
    marginVertical: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ProductListScreen;
