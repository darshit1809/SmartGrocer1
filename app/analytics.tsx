import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useStock } from '../context/StockContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const router = useRouter();
  const { products, sales } = useStock();

  // Aggregate data for the graphs
  const aggregatedData = useMemo(() => {
    return products.map((product) => {
      const totalSold = sales
        .filter((sale) => sale.productName.toLowerCase() === product.name.toLowerCase())
        .reduce((sum, sale) => sum + sale.quantity, 0);

      return {
        id: product.id,
        name: product.name,
        remainingStock: product.quantity,
        totalSold,
      };
    });
  }, [products, sales]);

  if (aggregatedData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data available for graphs.</Text>
        </View>
      </View>
    );
  }

  const labels = aggregatedData.map((d) => (d.name.length > 8 ? d.name.substring(0, 8) + '..' : d.name));
  
  const stockData = {
    labels,
    datasets: [
      {
        data: aggregatedData.map((d) => d.remainingStock),
      }
    ]
  };

  const salesData = {
    labels,
    datasets: [
      {
        data: aggregatedData.map((d) => d.totalSold),
      }
    ]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 140, 0, ${opacity})`, // Orange for stock
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    formatYLabel: (y: string) => Math.round(Number(y)).toString(),
    barPercentage: 0.6,
  };

  const salesChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green for sales
  };

  // Ensure chart width is large enough so labels don't bunch up if there are many products
  const chartWidth = Math.max(width - 40, labels.length * 60 + 50);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        
        {/* Current Stock Graph */}
        <View style={styles.chartContainer}>
           <View style={styles.chartHeader}>
             <Ionicons name="cube" size={24} color="#FF8C00" />
             <Text style={styles.chartTitle}>Stock Quantity</Text>
           </View>
           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
             <BarChart
               data={stockData}
               width={chartWidth}
               height={300}
               yAxisLabel=""
               yAxisSuffix=""
               fromZero={true}
               showValuesOnTopOfBars={true}
               chartConfig={chartConfig}
               style={styles.chartStyle}
               withInnerLines={false}
             />
           </ScrollView>
        </View>

        {/* Sales Volume Graph */}
        <View style={styles.chartContainer}>
           <View style={styles.chartHeader}>
             <Ionicons name="trending-up" size={24} color="#4CAF50" />
             <Text style={styles.chartTitle}>Sales Volume</Text>
           </View>
           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
             <BarChart
               data={salesData}
               width={chartWidth}
               height={300}
               yAxisLabel=""
               yAxisSuffix=""
               fromZero={true}
               showValuesOnTopOfBars={true}
               chartConfig={salesChartConfig}
               style={styles.chartStyle}
               withInnerLines={false}
             />
           </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  chartStyle: {
    borderRadius: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
});
