import React, { createContext, useState, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface InventoryContextType {
  products: Product[];
  addStock: (product: Product) => void;
  sellProduct: (id: string, quantity: number) => void;
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const addStock = (product: Product) => {
    setProducts((prevProducts) => {
      const existingProduct = prevProducts.find((p) => p.id === product.id);
      if (existingProduct) {
        return prevProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + product.quantity } : p
        );
      }
      return [...prevProducts, product];
    });
  };

  const sellProduct = (id: string, quantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity - quantity } : p
      )
    );
  };

  return (
    <InventoryContext.Provider value={{ products, addStock, sellProduct }}>
      {children}
    </InventoryContext.Provider>
  );
};