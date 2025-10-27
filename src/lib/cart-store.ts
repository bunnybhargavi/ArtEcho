
import { create } from 'zustand';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { getSdks, useFirebase } from '@/firebase';

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
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const getCartRef = (userId: string) => collection(getSdks(null as any).firestore, 'users', userId, 'cart');

const syncWithLocalStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guestCart', JSON.stringify(items));
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartInitialized: false,

  initializeCart: async () => {
    if (get().isCartInitialized) return;

    const { user, isUserLoading } = useFirebase.getState();

    if (isUserLoading) return; // Wait until auth state is resolved

    if (user) {
      // Logged-in user: Fetch from Firestore
      const cartRef = getCartRef(user.uid);
      const snapshot = await getDocs(cartRef);
      const firestoreItems = snapshot.docs.map(doc => doc.data() as CartItem);
      set({ items: firestoreItems, isCartInitialized: true });

      // Migrate guest cart if it exists
      if (typeof window !== 'undefined') {
        const guestCartJson = localStorage.getItem('guestCart');
        if (guestCartJson) {
          const guestItems = JSON.parse(guestCartJson) as CartItem[];
          if (guestItems.length > 0) {
            // Merge guest items with firestore items
            const combinedItems = [...firestoreItems];
            for (const guestItem of guestItems) {
                const existingItem = combinedItems.find(item => item.productId === guestItem.productId);
                if (existingItem) {
                    existingItem.quantity += guestItem.quantity;
                } else {
                    combinedItems.push(guestItem);
                }
                // Write merged item to Firestore
                const itemDocRef = doc(cartRef, guestItem.productId);
                await setDoc(itemDocRef, guestItem, { merge: true });
            }
            set({ items: combinedItems });
            localStorage.removeItem('guestCart');
          }
        }
      }

    } else {
      // Guest user: Fetch from localStorage
       if (typeof window !== 'undefined') {
        const guestCartJson = localStorage.getItem('guestCart');
        const items = guestCartJson ? JSON.parse(guestCartJson) : [];
        set({ items, isCartInitialized: true });
       } else {
        set({ isCartInitialized: true });
       }
    }
  },

  addToCart: async (itemToAdd) => {
    const { user } = useFirebase.getState();
    const items = get().items;
    const existingItem = items.find(item => item.productId === itemToAdd.productId);

    let newItems;
    if (existingItem) {
      newItems = items.map(item =>
        item.productId === itemToAdd.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...items, { ...itemToAdd, quantity: 1 }];
    }
    set({ items: newItems });

    if (user) {
      const updatedItem = newItems.find(item => item.productId === itemToAdd.productId)!;
      const itemDocRef = doc(getCartRef(user.uid), itemToAdd.productId);
      await setDoc(itemDocRef, updatedItem);
    } else {
      syncWithLocalStorage(newItems);
    }
  },

  removeFromCart: async (productId) => {
    const { user } = useFirebase.getState();
    const newItems = get().items.filter(item => item.productId !== productId);
    set({ items: newItems });

    if (user) {
      const itemDocRef = doc(getCartRef(user.uid), productId);
      await deleteDoc(itemDocRef);
    } else {
      syncWithLocalStorage(newItems);
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const { user } = useFirebase.getState();
    const newItems = get().items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    set({ items: newItems });

    if (user) {
        const updatedItem = newItems.find(item => item.productId === productId)!;
        const itemDocRef = doc(getCartRef(user.uid), productId);
        await setDoc(itemDocRef, updatedItem, { merge: true });
    } else {
      syncWithLocalStorage(newItems);
    }
  },

  clearCart: async () => {
    const { user } = useFirebase.getState();
    if (user) {
        const cartRef = getCartRef(user.uid);
        const snapshot = await getDocs(cartRef);
        // Firestore batch delete
        const batch = getSdks(null as any).firestore.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    } else {
      syncWithLocalStorage([]);
    }
    set({ items: [] });
  },
}));

// Hook to sync zustand state with Firebase auth state
export const useAuthCartSync = () => {
    const { user, isUserLoading } = useFirebase();
    const { initializeCart, isCartInitialized } = useCartStore();

    useEffect(() => {
        // When auth state is resolved, initialize the cart
        if (!isUserLoading && !isCartInitialized) {
            initializeCart();
        }
    }, [user, isUserLoading, initializeCart, isCartInitialized]);
};

// Also sync Firebase state into Zustand store
useFirebase.subscribe(
  (state) => state.user,
  () => useCartStore.getState().initializeCart()
);
