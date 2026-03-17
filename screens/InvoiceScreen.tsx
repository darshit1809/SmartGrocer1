// Screen to generate daily invoice
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useStock } from '../context/StockContext';

interface InvoiceScreenProps {
  navigation: any;
}

const InvoiceScreen: React.FC<InvoiceScreenProps> = ({ navigation }) => {
  const { sales } = useStock();
  
  const totalAmount = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Invoice</Text>
      
      {sales.length === 0 ? (
        <Text style={styles.emptyText}>No sales recorded yet</Text>
      ) : (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Product</Text>
            <Text style={styles.headerCell}>Qty</Text>
            <Text style={styles.headerCell}>Price</Text>
            <Text style={styles.headerCell}>Total</Text>
          </View>
          
          {sales.map(sale => (
            <View key={sale.id} style={styles.saleRow}>
              <Text style={styles.saleCell}>{sale.productName}</Text>
              <Text style={styles.saleCell}>{sale.quantity}</Text>
              <Text style={styles.saleCell}>₹{sale.price}</Text>
              <Text style={styles.saleCell}>₹{sale.total}</Text>
            </View>
          ))}
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>
        </>
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
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  saleRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingVertical: 10,
  },
  saleCell: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#90EE90',
    borderRadius: 5,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default InvoiceScreen;
