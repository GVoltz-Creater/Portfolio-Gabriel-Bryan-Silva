import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Order, LiveSession, Product } from '@/types';
import { DEFAULT_BUYER, MOCK_SELLERS, MOCK_ORDERS } from '@/data/mock';

interface AppContextValue {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  activeLive: LiveSession | null;
  setActiveLive: (live: LiveSession | null) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [activeLive, setActiveLive] = useState<LiveSession | null>(null);

  const setCurrentUser = useCallback((user: User) => {
    setCurrentUserState(user);
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  const logout = useCallback(() => {
    setCurrentUserState(null);
    setActiveLive(null);
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      orders,
      addOrder,
      activeLive,
      setActiveLive,
      isLoggedIn: currentUser !== null,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
