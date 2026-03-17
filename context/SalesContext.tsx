// Context for managing sales
import React, { createContext, useState, ReactNode } from 'react';

export const SalesContext = createContext({});

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const [sales, setSales] = useState([]);
  return (
    <SalesContext.Provider value={{ sales, setSales }}>
      {children}
    </SalesContext.Provider>
  );
};
