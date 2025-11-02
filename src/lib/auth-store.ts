
'use client';

import { create } from 'zustand';
import React from 'react';

interface User {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthState {
  user: User | null;
  mockUsers: User[];
  isUserLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  addUser: (user: User) => void;
  initializeAuth: () => void;
}

const defaultUsers: User[] = [
    {
        uid: 'user-1-uid',
        email: 'elena.rodriguez@example.com',
        displayName: 'Elena Rodriguez',
    },
    {
        uid: 'user-2-uid',
        email: 'arjun.patel@example.com',
        displayName: 'Arjun Patel',
    },
    {
        uid: 'user-3-uid',
        email: 'ayesha.khan@example.com',
        displayName: 'Ayesha Khan',
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
    const newUsers = [...get().mockUsers, user];
    set({ mockUsers: newUsers });
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUsers', JSON.stringify(newUsers));
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
