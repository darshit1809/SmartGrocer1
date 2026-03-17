import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase/config';

export default function DashboardScreen() {
  const router = useRouter();
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Dashboard] Setting up onAuthStateChanged listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('[Dashboard] onAuthStateChanged fired, user:', user?.uid ?? 'null');
      if (user) {
        fetchUserData(user.uid);
      } else {
        setShopName('Shop');
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      console.log('[Dashboard] Fetching user doc for:', userId);
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore getDoc timed out after 10s')), 10000)
      );
      const userDoc = await Promise.race([
        getDoc(doc(db, 'users', userId)),
        timeout,
      ]);
      console.log('[Dashboard] User doc fetched, exists:', userDoc.exists());
      if (userDoc.exists()) {
        setShopName(userDoc.data().shopName || 'Shop');
      } else {
        setShopName('Shop');
      }
    } catch (error: any) {
      console.error('[Dashboard] fetchUserData error:', error.code, error.message);
      setShopName('Shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.accountButton}
            onPress={() => router.push('/profile')}
            accessibilityLabel="Account"
          >
            <View style={styles.accountIconWrap}>
              <Ionicons name="person" size={28} color="#FF8C00" />
            </View>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>SmartGrocer</Text>
      </View>

      {/* Welcome Message */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF8C00" style={{ marginVertical: 20 }} />
      ) : (
        <Text style={styles.welcome}>Welcome, {shopName}!</Text>
      )}

      {/* Button Grid */}
      <View style={styles.buttonGrid}>
        {/* Add Stock Button */}
        <TouchableOpacity
          style={[styles.button, styles.greenButton]}
          onPress={() => router.push('/add-stock')}
        >
          <Text style={styles.buttonIcon}>🛒</Text>
          <Text style={styles.buttonText}>Add Stock</Text>
        </TouchableOpacity>

        {/* Enter Sales Button */}
        <TouchableOpacity
          style={[styles.button, styles.whiteButton]}
          onPress={() => router.push('/enter-sales')}
        >
          <Text style={styles.buttonIcon}>📋</Text>
          <Text style={styles.buttonTextDark}>Enter Sales</Text>
        </TouchableOpacity>

        {/* View Stock Button */}
        <TouchableOpacity
          style={[styles.button, styles.whiteButton]}
          onPress={() => router.push('/view-stock')}
        >
          <Text style={styles.buttonIcon}>📦</Text>
          <Text style={styles.buttonTextDark}>View Stock</Text>
        </TouchableOpacity>

        {/* Generate Invoice Button */}
        <TouchableOpacity
          style={[styles.button, styles.orangeButton]}
          onPress={() => router.push('/generate-invoice')}
        >
          <Text style={styles.buttonIcon}>📄</Text>
          <Text style={styles.buttonText}>Generate Invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  accountButton: {
    padding: 4,
  },
  accountIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF5E6',
    borderWidth: 1,
    borderColor: '#FFD1A1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  welcome: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    height: 140,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greenButton: {
    backgroundColor: '#8BC34A',
  },
  orangeButton: {
    backgroundColor: '#FF8C00',
  },
  whiteButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextDark: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
