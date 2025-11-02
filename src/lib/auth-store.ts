
import { create } from 'zustand';

interface User {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthState {
  user: User | null;
  isUserLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isUserLoading: false,
  login: (user) => set({ user, isUserLoading: false }),
  logout: () => set({ user: null, isUserLoading: false }),
}));

// Mock hooks to replace Firebase ones
export const useUser = () => {
    const { user, isUserLoading } = useAuthStore();
    return { user, isUserLoading, userError: null };
};

export const useAuth = () => {
    // This can return a mock auth object if needed, but for now, null is fine
    // as we are bypassing direct auth calls in components.
    return null;
}
