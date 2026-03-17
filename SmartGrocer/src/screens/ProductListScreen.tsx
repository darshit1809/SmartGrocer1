import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { InventoryContext } from '../context/InventoryContext';
import ProductCard from '../components/ProductCard';

const ProductListScreen = ({ navigation }) => {
  const { products } = useContext(InventoryContext);

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('SalesEntry', { product: item })}>
      <ProductCard product={item} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Product List</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default ProductListScreen;