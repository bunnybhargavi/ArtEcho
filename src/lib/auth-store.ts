
'use client';

import { create } from 'zustand';
import React from 'react';
import { Order, OrderItem } from './types';
import { CartItem } from './cart-store';

interface User {
  uid: string;
  email: string;
  displayName: string;
  orders?: Order[];
}

interface AuthState {
  user: User | null;
  mockUsers: User[];
  isUserLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  addUser: (user: User) => void;
  addOrderToUser: (userId: string, order: Order) => void;
  initializeAuth: () => void;
}

const defaultUsers: User[] = [
    {
        uid: 'user-1-uid',
        email: 'elena.rodriguez@example.com',
        displayName: 'Elena Rodriguez',
        orders: [],
    },
    {
        uid: 'user-2-uid',
        email: 'arjun.patel@example.com',
        displayName: 'Arjun Patel',
        orders: [],
    },
    {
        uid: 'user-3-uid',
        email: 'ayesha.khan@example.com',
        displayName: 'Ayesha Khan',
        orders: [],
    }
];

const getInitialUsers = (): User[] => {
  if (typeof window === 'undefined') {
    return defaultUsers;
  }
  const storedUsers = localStorage.getItem('mockUsers');
  if (storedUsers) {
    try {
      const parsedUsers = JSON.parse(storedUsers);
      // Basic validation to ensure it's an array of users
      if (Array.isArray(parsedUsers) && parsedUsers.every(u => u.uid && u.email && u.displayName)) {
        return parsedUsers;
      }
    } catch (e) {
      // If parsing fails, fall back to default
      return defaultUsers;
    }
  }
  return defaultUsers;
};


export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  mockUsers: [],
  isUserLoading: true, // Start as true until initialized
  
  initializeAuth: () => {
    set({ mockUsers: getInitialUsers(), isUserLoading: false });
  },

  login: (user) => set({ user, isUserLoading: false }),
  
  logout: () => set({ user: null, isUserLoading: false }),

  addUser: (user: User) => {
    const newUsers = [...get().mockUsers, {...user, orders: []}];
    set({ mockUsers: newUsers });
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUsers', JSON.stringify(newUsers));
    }
  },
  addOrderToUser: (userId, order) => {
    const newUsers = get().mockUsers.map(u => 
        u.uid === userId 
            ? { ...u, orders: [...(u.orders || []), order] } 
            : u
    );
    set({ mockUsers: newUsers });
    if (typeof window !== 'undefined') {
        localStorage.setItem('mockUsers', JSON.stringify(newUsers));
    }

    // Also update the logged-in user object if they are the one who placed the order
    const currentUser = get().user;
    if (currentUser && currentUser.uid === userId) {
        set({ user: { ...currentUser, orders: [...(currentUser.orders || []), order] } });
    }
  }
}));

// Mock hooks to replace Firebase ones
export const useUser = () => {
    const { user, isUserLoading, initializeAuth } = useAuthStore();
    
    // Ensure auth is initialized on first use
    React.useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return { user, isUserLoading, userError: null };
};

export const useAuth = () => {
    return null;
}


// This is a new mock action that simulates placing an order and adding it to the user's history
export async function placeOrderAction(data: { items: CartItem[]; total: number }): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const user = useAuthStore.getState().user;
    if (!user) {
        return { success: false, error: 'User not authenticated.' };
    }

    const orderId = `mock-order-${Date.now()}`;
    const newOrder: Order = {
        id: orderId,
        userId: user.uid,
        items: data.items.map(item => ({...item})),
        total: data.total,
        status: 'Placed',
        createdAt: new Date().toISOString(),
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
            { status: 'Order placed and confirmed.', location: 'E-commerce Center', timestamp: new Date().toISOString() }
        ]
    };

    useAuthStore.getState().addOrderToUser(user.uid, newOrder);

    return { success: true, orderId: newOrder.id };
}

export async function placeSingleItemOrderAction(item: CartItem): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const user = useAuthStore.getState().user;
    if (!user) {
        return { success: false, error: 'User not authenticated.' };
    }

    const orderId = `mock-order-${Date.now()}`;
    const newOrder: Order = {
        id: orderId,
        userId: user.uid,
        items: [item],
        total: item.price * item.quantity,
        status: 'Placed',
        createdAt: new Date().toISOString(),
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
         statusHistory: [
            { status: 'Order placed and confirmed.', location: 'E-commerce Center', timestamp: new Date().toISOString() }
        ]
    };
    
    useAuthStore.getState().addOrderToUser(user.uid, newOrder);

    return { success: true, orderId: newOrder.id };
}
