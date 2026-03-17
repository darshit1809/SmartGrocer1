import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { useStock, SaleItem } from '../context/StockContext';

type FilterType = 'today' | 'week' | 'month' | 'all';

export default function GenerateInvoiceScreen() {
    const router = useRouter();
    const { sales } = useStock();
    const [shopName, setShopName] = useState('My Shop');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('today');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setShopName(userDoc.data().shopName || 'My Shop');
                    }
                } catch (error) {
                    console.error('Error fetching shop name:', error);
                }
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const filteredSales = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        return sales.filter((sale) => {
            const saleDate = new Date(sale.date).getTime(); // Assuming sale.date is locale string or parseable
            // Fallback if Date(sale.date) fails (e.g. locale string format issues)
            // Ideally, store timestamps. But given current context, let's try our best.
            // If sale.date is locale string "M/D/YYYY, H:MM:SS AM/PM" it often works in constructor.

            // Better approach: sales in context are already objects. Let's rely on filter logic.
            // If using simple locale string comparison is tricky, let's just use simple checks.

            const saleTime = new Date(sale.date).getTime();
            if (isNaN(saleTime)) return true; // Include if date parsing fails to show something

            switch (filter) {
                case 'today':
                    return saleTime >= todayStart;
                case 'week':
                    const weekStart = new Date(now.setDate(now.getDate() - 7)).getTime();
                    return saleTime >= weekStart;
                case 'month':
                    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                    return saleTime >= monthStart;
                case 'all':
                default:
                    return true;
            }
        });
    }, [sales, filter]);

    const totalAmount = filteredSales.reduce((sum, item) => sum + item.total, 0);

    const generatePdf = async () => {
        if (filteredSales.length === 0) {
            Alert.alert('No Sales', 'There are no sales to generate an invoice for.');
            return;
        }

        setGenerating(true);
        try {
            const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
             <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .shop-name { font-size: 24px; font-weight: bold; color: #333; }
              .invoice-title { font-size: 20px; color: #555; margin-top: 10px; }
              .meta { display: flex; justify-content: space-between; margin-bottom: 20px; color: #666; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f8f9fa; font-weight: bold; color: #333; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .total-row { font-weight: bold; font-size: 16px; background-color: #f0f0f0; }
              .footer { text-align: center; color: #888; font-size: 12px; margin-top: 40px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="shop-name">${shopName}</div>
              <div class="invoice-title">Sales Invoice</div>
            </div>
            
            <div class="meta">
              <div>Date: ${new Date().toLocaleDateString()}</div>
              <div>Invoice #: ${Date.now().toString().slice(-6)}</div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${filteredSales
                    .map(
                        (item) => `
                    <tr>
                      <td>${item.productName}</td>
                      <td>${item.quantity}</td>
                      <td>₹${item.price}</td>
                      <td>₹${item.total}</td>
                    </tr>
                  `
                    )
                    .join('')}
                 <tr class="total-row">
                  <td colspan="3" style="text-align: right;">Grand Total</td>
                  <td>₹${totalAmount}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              Generated by SmartGrocer App
            </div>
          </body>
        </html>
      `;

            const { uri } = await Print.printToFileAsync({ html });
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to generate invoice PDF');
        } finally {
            setGenerating(false);
        }
    };

    const renderSaleItem = ({ item }: { item: SaleItem }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.cardDetails}>
                <Text style={styles.detailText}>
                    {item.quantity} x ₹{item.price}
                </Text>
                <Text style={styles.totalText}>₹{item.total}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Generate Invoice</Text>

            {/* Filter Tabs */}
            <View style={styles.tabsContainer}>
                {(['today', 'week', 'month', 'all'] as FilterType[]).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.tab, filter === f && styles.activeTab]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.tabText, filter === f && styles.activeTabText]}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Total Sales: {filteredSales.length}</Text>
                <Text style={styles.summaryAmount}>₹{totalAmount}</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FF8C00" style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={filteredSales}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSaleItem}
                    contentContainerStyle={filteredSales.length === 0 && styles.emptyList}
                    ListEmptyComponent={<Text style={styles.emptyText}>No sales found for this period.</Text>}
                />
            )}

            <TouchableOpacity
                style={[styles.generateButton, generating && styles.disabledButton]}
                onPress={generatePdf}
                disabled={generating}
            >
                {generating ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.buttonText}>Download Invoice (PDF)</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#FF8C00',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#FFF',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FF8C00',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryText: {
        fontSize: 16,
        color: '#333',
    },
    summaryAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32', // Green for money
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailText: {
        fontSize: 14,
        color: '#666',
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    generateButton: {
        backgroundColor: '#FF8C00',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#FF8C00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
});
