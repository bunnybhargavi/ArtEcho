
import { create } from 'zustand';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
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
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const getCartRef = (userId: string) => {
    const { firestore } = getSdks(null as any); // SDKs are initialized on the client
    return collection(firestore, 'users', userId, 'cart');
};


const syncWithLocalStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guestCart', JSON.stringify(items));
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartInitialized: false,

  initializeCart: async () => {
    // Avoid re-initializing if already done
    if (get().isCartInitialized) return;

    const { auth, firestore } = getSdks(null as any); // This is safe on the client
    
    // We need to wait for auth to be initialized
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is logged in, fetch from Firestore
        const cartRef = getCartRef(user.uid);
        const snapshot = await getDocs(cartRef);
        const firestoreItems = snapshot.docs.map(doc => doc.data() as CartItem);
        
        let finalItems = [...firestoreItems];

        // Check for and merge guest cart from localStorage
        const guestCartJson = typeof window !== 'undefined' ? localStorage.getItem('guestCart') : null;
        if (guestCartJson) {
          const guestItems = JSON.parse(guestCartJson) as CartItem[];
          if (guestItems.length > 0) {
            const batch = writeBatch(firestore);
            
            guestItems.forEach(guestItem => {
              const existingItemIndex = finalItems.findIndex(item => item.productId === guestItem.productId);
              if (existingItemIndex > -1) {
                finalItems[existingItemIndex].quantity += guestItem.quantity;
                const itemRef = doc(cartRef, finalItems[existingItemIndex].productId);
                batch.update(itemRef, { quantity: finalItems[existingItemIndex].quantity });
              } else {
                finalItems.push(guestItem);
                const itemRef = doc(cartRef, guestItem.productId);
                batch.set(itemRef, guestItem);
              }
            });
            
            await batch.commit();
            localStorage.removeItem('guestCart');
          }
        }
        set({ items: finalItems, isCartInitialized: true });
      } else {
        // User is a guest, fetch from localStorage
        const guestCartJson = typeof window !== 'undefined' ? localStorage.getItem('guestCart') : null;
        const items = guestCartJson ? JSON.parse(guestCartJson) : [];
        set({ items, isCartInitialized: true });
      }
    });
  },

  addToCart: async (itemToAdd) => {
    const { user } = useFirebase.getState();
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

    if (user) {
      const updatedItem = newItems.find(item => item.productId === itemToAdd.productId)!;
      const itemDocRef = doc(getCartRef(user.uid), itemToAdd.productId);
      await setDoc(itemDocRef, updatedItem, { merge: true });
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
    const { user, firestore } = getSdks(null as any);
    if (user) {
        const cartRef = getCartRef(user.uid);
        const snapshot = await getDocs(cartRef);
        const batch = writeBatch(firestore);
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    } else {
      syncWithLocalStorage([]);
    }
    set({ items: [] });
  },
}));
