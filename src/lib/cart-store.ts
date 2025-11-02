
import { create } from 'zustand';
import { useAuthStore } from './auth-store';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartInitialized: boolean;
  initializeCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const getLocalStorageKey = (userId?: string) => userId ? `cart_${userId}` : 'guestCart';

const syncWithLocalStorage = (items: CartItem[], userId?: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(items));
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartInitialized: false,

  initializeCart: () => {
    if (get().isCartInitialized) return;

    const { user } = useAuthStore.getState();
    const key = getLocalStorageKey(user?.uid);
    const cartJson = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const items = cartJson ? JSON.parse(cartJson) : [];
    
    set({ items, isCartInitialized: true });

    // This handles merging guest cart to user cart on login.
    useAuthStore.subscribe((state, prevState) => {
      const newUser = state.user;
      const oldUser = prevState.user;

      if (newUser && !oldUser) { // User logged in
        const guestCartJson = localStorage.getItem(getLocalStorageKey());
        const guestItems = guestCartJson ? JSON.parse(guestCartJson) as CartItem[] : [];

        if (guestItems.length > 0) {
            const userCartJson = localStorage.getItem(getLocalStorageKey(newUser.uid));
            const userItems = userCartJson ? JSON.parse(userCartJson) as CartItem[] : [];

            const mergedItems = [...userItems];
            guestItems.forEach(guestItem => {
                const existingItem = mergedItems.find(item => item.productId === guestItem.productId);
                if (existingItem) {
                    existingItem.quantity += guestItem.quantity;
                } else {
                    mergedItems.push(guestItem);
                }
            });
            
            set({ items: mergedItems });
            syncWithLocalStorage(mergedItems, newUser.uid);
            localStorage.removeItem(getLocalStorageKey());
        } else {
             const userCartJson = localStorage.getItem(getLocalStorageKey(newUser.uid));
             const userItems = userCartJson ? JSON.parse(userCartJson) : [];
             set({ items: userItems });
        }
      } else if (!newUser && oldUser) { // User logged out
        set({ items: [] });
        const guestCartJson = localStorage.getItem(getLocalStorageKey());
        const guestItems = guestCartJson ? JSON.parse(guestCartJson) : [];
        set({ items: guestItems });
      }
    });
  },

  addToCart: (itemToAdd) => {
    const items = get().items;
    const existingItem = items.find(item => item.productId === itemToAdd.productId);
    const quantityToAdd = itemToAdd.quantity || 1;

    let newItems;
    if (existingItem) {
      newItems = items.map(item =>
        item.productId === itemToAdd.productId
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item
      );
    } else {
      newItems = [...items, { ...itemToAdd, quantity: quantityToAdd }];
    }
    set({ items: newItems });
    syncWithLocalStorage(newItems, useAuthStore.getState().user?.uid);
  },

  removeFromCart: (productId) => {
    const newItems = get().items.filter(item => item.productId !== productId);
    set({ items: newItems });
    syncWithLocalStorage(newItems, useAuthStore.getState().user?.uid);
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    const newItems = get().items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    set({ items: newItems });
    syncWithLocalStorage(newItems, useAuthStore.getState().user?.uid);
  },

  clearCart: () => {
    set({ items: [] });
    syncWithLocalStorage([], useAuthStore.getState().user?.uid);
  },
}));
