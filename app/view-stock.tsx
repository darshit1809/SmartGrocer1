import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStock } from '../context/StockContext';
import { useRouter } from 'expo-router';

export default function ViewStockScreen() {
  const { products, sales, deleteStock } = useStock();
  const router = useRouter();

  // Aggregate data
  const aggregatedData = useMemo(() => {
    return products.map((product) => {
      // Calculate total sold for this product (case-insensitive name match)
      const totalSold = sales
        .filter((sale) => sale.productName.toLowerCase() === product.name.toLowerCase())
        .reduce((sum, sale) => sum + sale.quantity, 0);

      // Remaining stock is simply the current quantity in products collection
      const remainingStock = product.quantity;

      // Total Added is derived (Assuming Total Added = Remaining + Sold)
      const totalAddedStock = remainingStock + totalSold;

      return {
        ...product,
        totalSold,
        remainingStock,
        totalAddedStock,
      };
    });
  }, [products, sales]);

  if (!products && !sales) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteStock(id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTitleRow}>
        <Text style={styles.title}>Stock Overview</Text>
        <TouchableOpacity 
          style={styles.analyticsButton} 
          onPress={() => router.push('/analytics')}
        >
          <Ionicons name="bar-chart" size={20} color="#FFF" />
          <Text style={styles.analyticsButtonText}>Analytics</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={aggregatedData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={aggregatedData.length === 0 && styles.emptyList}
        ListEmptyComponent={<Text style={styles.emptyText}>No stock data available.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.price}>₹{item.price}/{item.unitType === 'kg' ? 'Kg' : 'Unit'}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Added</Text>
                <Text style={styles.statValue}>{item.totalAddedStock}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Sold</Text>
                <Text style={styles.statValue}>{item.totalSold}</Text>
              </View>
              <View style={[styles.statBox, styles.highlightBox]}>
                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={[styles.statValue, styles.highlightText]}>{item.remainingStock}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light grey background for better contrast
    padding: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  analyticsButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  price: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 4,
  },
  highlightBox: {
    backgroundColor: '#FFF0E0', // Very light orange background
    borderRadius: 8,
    paddingVertical: 4,
  },
  highlightText: {
    color: '#FF8C00', // Orange color for emphasis
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
