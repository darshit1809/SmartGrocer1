// Context for managing stock
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unitType?: 'kg' | 'unit';
}

export interface SaleItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
}

interface StockContextType {
  products: Product[];
  sales: SaleItem[];
  addStock: (productName: string, quantity: number, price: number) => void;
  makeSale: (productName: string, quantity: number) => void;
  deleteStock: (productId: string) => Promise<void>;
}

export const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const [sales, setSales] = useState<SaleItem[]>([]);

  useEffect(() => {
    let unsubscribeStock: (() => void) | null = null;
    let unsubscribeSales: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeStock) unsubscribeStock();
      if (unsubscribeSales) unsubscribeSales();

      if (!user) {
        setProducts([]);
        setSales([]);
        return;
      }

      const stockQuery = query(
        collection(db, 'stock'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      unsubscribeStock = onSnapshot(stockQuery, (snapshot) => {
        const data: Product[] = snapshot.docs.map((docSnap) => {
          const item = docSnap.data();
          return {
            id: docSnap.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            unitType: item.unitType,
          };
        });
        setProducts(data);
      }, (error) => {
        console.error('[StockContext] stock onSnapshot error:', error.code, error.message);
      });

      const salesQuery = query(
        collection(db, 'sales'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      unsubscribeSales = onSnapshot(salesQuery, (snapshot) => {
        const data: SaleItem[] = snapshot.docs.map((docSnap) => {
          const item = docSnap.data();
          const createdAt = item.createdAt?.toDate?.();
          return {
            id: docSnap.id,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            date: createdAt ? createdAt.toLocaleString() : item.date || '',
          };
        });
        setSales(data);
      }, (error) => {
        console.error('[StockContext] sales onSnapshot error:', error.code, error.message);
      });
    });

    return () => {
      if (unsubscribeStock) unsubscribeStock();
      if (unsubscribeSales) unsubscribeSales();
      unsubscribeAuth();
    };
  }, []);

  const addStock = async (productName: string, quantity: number, price: number) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please login again.');
      return;
    }

    const existingProduct = products.find(
      p => p.name.toLowerCase() === productName.toLowerCase()
    );

    if (existingProduct) {
      await updateDoc(doc(db, 'stock', existingProduct.id), {
        quantity: existingProduct.quantity + quantity,
        price,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, 'stock'), {
        name: productName,
        quantity,
        price,
        unitType: 'unit',
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    }
  };

  const makeSale = async (productName: string, quantity: number) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please login again.');
      return;
    }

    const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (!product) {
      alert('Product not found!');
      return;
    }

    const productRef = doc(db, 'stock', product.id);
    const salesRef = doc(collection(db, 'sales'));

    try {
      await runTransaction(db, async (transaction) => {
        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists()) {
          throw new Error('Product not found');
        }

        const currentQty = productSnap.data().quantity;
        if (currentQty < quantity) {
          throw new Error('Insufficient stock');
        }

        transaction.update(productRef, {
          quantity: currentQty - quantity,
          updatedAt: serverTimestamp(),
        });

        transaction.set(salesRef, {
          productName: product.name,
          quantity,
          price: product.price,
          total: product.price * quantity,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
      });
    } catch (error: any) {
      alert(error.message || 'Sale failed');
    }
  };

  const deleteStock = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'stock', productId));
    } catch (error: any) {
      alert(error.message || 'Delete failed');
    }
  };

  return (
    <StockContext.Provider value={{ products, sales, addStock, makeSale, deleteStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within StockProvider');
  }
  return context;
};
