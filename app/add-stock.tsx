import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../firebase/config';

type UnitType = 'kg' | 'unit';

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unitType: UnitType;
  price: number;
}

export default function AddStockScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [unitType, setUnitType] = useState<UnitType>('kg');
  const [items, setItems] = useState<StockItem[]>([]);

  const handleAdd = async () => {
    const trimmedName = name.trim();
    const qty = Number(quantity);
    const unitPrice = Number(price);

    if (!trimmedName) {
      Alert.alert('Error', 'Product name is required');
      return;
    }
    if (!qty || qty <= 0) {
      Alert.alert('Error', 'Quantity must be greater than 0');
      return;
    }
    if (!unitPrice || unitPrice <= 0) {
      Alert.alert('Error', 'Price must be greater than 0');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Please login again.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'stock'), {
        name: trimmedName,
        quantity: qty,
        unitType,
        price: unitPrice,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      const newItem: StockItem = {
        id: docRef.id,
        name: trimmedName,
        quantity: qty,
        unitType,
        price: unitPrice,
      };

      setItems((prev) => [newItem, ...prev]);
      setName('');
      setQuantity('');
      setPrice('');
      setUnitType('kg');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add product');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Stock</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Tomato"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>

        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 30"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Unit</Text>
        <View style={styles.unitRow}>
          <TouchableOpacity
            style={[styles.unitButton, unitType === 'kg' && styles.unitButtonActive]}
            onPress={() => setUnitType('kg')}
          >
            <Text style={[styles.unitText, unitType === 'kg' && styles.unitTextActive]}>Per Kg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unitType === 'unit' && styles.unitButtonActive]}
            onPress={() => setUnitType('unit')}
          >
            <Text style={[styles.unitText, unitType === 'unit' && styles.unitTextActive]}>Per Unit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add Product</Text>
      </TouchableOpacity>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Products</Text>
        <Text style={styles.listSubtitle}>Name • Quantity • Price</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={items.length === 0 && styles.emptyList}
        ListEmptyComponent={<Text style={styles.emptyText}>No products added yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>
              {item.quantity} {item.unitType === 'kg' ? 'Kg' : 'Units'}
            </Text>
            <Text style={styles.cardText}>₹{item.price} / {item.unitType === 'kg' ? 'Kg' : 'Unit'}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#F9F9F9',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  halfInputContainer: {
    flex: 1,
  },
  unitRow: {
    flexDirection: 'row',
    gap: 10,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  unitButtonActive: {
    borderColor: '#FF8C00',
    backgroundColor: '#FFF3E0',
  },
  unitText: {
    color: '#333',
    fontWeight: '600',
  },
  unitTextActive: {
    color: '#FF8C00',
  },
  addButton: {
    backgroundColor: '#FF8C00',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listHeader: {
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  listSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  emptyList: {
    paddingTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  backButton: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF8C00',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
});