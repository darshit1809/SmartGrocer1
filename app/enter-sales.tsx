import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStock, Product } from '../context/StockContext';

export default function EnterSalesScreen() {
    const router = useRouter();
    const { products, makeSale } = useStock();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSale = async () => {
        if (!selectedProduct) {
            Alert.alert('Error', 'Please select a product');
            return;
        }

        const qty = Number(quantity);
        if (!qty || qty <= 0) {
            Alert.alert('Error', 'Please enter a valid quantity');
            return;
        }

        if (qty > selectedProduct.quantity) {
            Alert.alert('Error', `Only ${selectedProduct.quantity} available in stock`);
            return;
        }

        try {
            await makeSale(selectedProduct.name, qty);
            
            const newQuantity = selectedProduct.quantity - qty;
            
            if (newQuantity < 2) {
                Alert.alert(
                    'Success & Low Stock Warning',
                    `Sale recorded successfully!\n\nWARNING: Stock for ${selectedProduct.name} is now low (${newQuantity} ${selectedProduct.unitType === 'kg' ? 'kg' : 'units'} left).`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setQuantity('');
                                setSelectedProduct(null);
                                router.back();
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('Success', 'Sale recorded successfully', [
                    {
                        text: 'OK',
                        onPress: () => {
                            setQuantity('');
                            setSelectedProduct(null);
                            router.back();
                        },
                    },
                ]);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to record sale');
        }
    };

    const renderProductItem = ({ item }: { item: Product }) => {
        const isSelected = selectedProduct?.id === item.id;
        return (
            <TouchableOpacity
                style={[
                    styles.productCard,
                    isSelected && styles.selectedCard,
                ]}
                onPress={() => {
                    setSelectedProduct(item);
                    setQuantity('');
                }}
            >
                <View style={styles.productInfo}>
                    <Text style={[styles.productName, isSelected && styles.selectedText]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.productDetails, isSelected && styles.selectedText]}>
                        In Stock: {item.quantity} {item.unitType === 'kg' ? 'kg' : 'units'}
                    </Text>
                    <Text style={[styles.productPrice, isSelected && styles.selectedText]}>
                        ₹{item.price}/{item.unitType === 'kg' ? 'Kg' : 'Unit'}
                    </Text>
                </View>
                {isSelected && (
                    <View style={styles.checkIcon}>
                        <Text style={styles.checkText}>✓</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Enter Sales</Text>

                {/* Product Selection Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Select Product</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <View style={styles.listContainer}>
                        <FlatList
                            data={filteredProducts}
                            keyExtractor={(item) => item.id}
                            renderItem={renderProductItem}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No products found.</Text>
                                </View>
                            }
                        />
                    </View>
                </View>

                {/* Quantity Input Section */}
                {selectedProduct && (
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>
                            Enter Quantity ({selectedProduct.unitType === 'kg' ? 'kg' : 'units'})
                        </Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder={`Max: ${selectedProduct.quantity}`}
                                keyboardType="numeric"
                                value={quantity}
                                onChangeText={setQuantity}
                            />
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={handleSale}>
                            <Text style={styles.submitButtonText}>Confirm Sale</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 10,
    },
    section: {
        flex: 1,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },
    searchInput: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginBottom: 10,
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
    },
    productCard: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedCard: {
        backgroundColor: '#FFF3E0', // Light orange background for selection
        borderLeftWidth: 4,
        borderLeftColor: '#FF8C00',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    productDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    productPrice: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
        fontStyle: 'italic',
    },
    selectedText: {
        color: '#D84315', // Darker orange for text
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FF8C00',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    checkText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
    inputSection: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12, // More rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 }, // Shadow upwards slightly
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10, // Higher elevation to float above content
        marginBottom: 20,
    },
    inputRow: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 14,
        fontSize: 18,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#FF8C00',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
