import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InventoryContext } from '../context/InventoryContext';
import InvoiceItem from '../components/InvoiceItem';

const InvoiceScreen = () => {
    const { soldItems } = useContext(InventoryContext);

    const calculateTotal = () => {
        return soldItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Invoice</Text>
            {soldItems.map((item, index) => (
                <InvoiceItem key={index} item={item} />
            ))}
            <Text style={styles.total}>Total: ${calculateTotal()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
});

export default InvoiceScreen;