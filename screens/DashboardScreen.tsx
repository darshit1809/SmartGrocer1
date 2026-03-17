// Dashboard screen with main navigation
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { useStock } from '../context/StockContext';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { products, sales } = useStock();
  
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.title}>SmartGrocer Dashboard</Text>
        <TouchableOpacity
          style={styles.accountButton}
          onPress={() => navigation.navigate('Profile')}
          accessibilityLabel="Account"
        >
          <Ionicons name="person-circle-outline" size={32} color="#000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Products</Text>
          <Text style={styles.statValue}>{products.length}</Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Stock</Text>
          <Text style={styles.statValue}>{totalStock}</Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Sales</Text>
          <Text style={styles.statValue}>₹{totalSales}</Text>
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <CustomButton
          title="Add Stock"
          onPress={() => navigation.navigate('AddStock')}
        />
        
        <CustomButton
          title="Sales Entry"
          onPress={() => navigation.navigate('SalesEntry')}
        />
        
        <CustomButton
          title="Product List"
          onPress={() => navigation.navigate('ProductList')}
        />
        
        <CustomButton
          title="Invoice"
          onPress={() => navigation.navigate('Invoice')}
        />
        
        <CustomButton
          title="Profile"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerSpacer: {
    width: 32,
    height: 32,
  },
  accountButton: {
    padding: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statBox: {
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#000',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonsContainer: {
    marginTop: 20,
  },
});

export default DashboardScreen;
