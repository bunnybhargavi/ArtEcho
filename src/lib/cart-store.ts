
import { create } from 'zustand';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


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
    const { firestore } = initializeFirebase();
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

  initializeCart: () => {
    // This function will be called from AuthCartSync to ensure it runs
    // after the Firebase user state is resolved.
    const { auth, firestore } = initializeFirebase();
    
    // We don't need a persistent onAuthStateChanged listener here
    // as the main app provider handles it. We just need to load the cart
    // based on the *current* user state.
    const user = auth.currentUser;

    const loadCart = async () => {
      if (user) {
        const cartRef = getCartRef(user.uid);
        const snapshot = await getDocs(cartRef);
        const firestoreItems = snapshot.docs.map(doc => doc.data() as CartItem);
        
        let finalItems = [...firestoreItems];

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
            
            batch.commit().catch(error => {
                errorEmitter.emit(
                    'permission-error',
                    new FirestorePermissionError({
                        path: cartRef.path,
                        operation: 'write',
                        requestResourceData: guestItems,
                    })
                )
            });
            localStorage.removeItem('guestCart');
          }
        }
        set({ items: finalItems, isCartInitialized: true });
      } else {
        const guestCartJson = typeof window !== 'undefined' ? localStorage.getItem('guestCart') : null;
        const items = guestCartJson ? JSON.parse(guestCartJson) : [];
        set({ items, isCartInitialized: true });
      }
    }
    
    if (!get().isCartInitialized) {
        loadCart();
    }
  },

  addToCart: async (itemToAdd) => {
    const { auth } = initializeFirebase();
    const user = auth.currentUser;
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
      setDoc(itemDocRef, updatedItem, { merge: true })
        .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                    path: itemDocRef.path,
                    operation: 'write',
                    requestResourceData: updatedItem,
                })
            )
        });
    } else {
      syncWithLocalStorage(newItems);
    }
  },

  removeFromCart: async (productId) => {
    const { auth } = initializeFirebase();
    const user = auth.currentUser;
    const newItems = get().items.filter(item => item.productId !== productId);
    set({ items: newItems });

    if (user) {
      const itemDocRef = doc(getCartRef(user.uid), productId);
      deleteDoc(itemDocRef)
        .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                    path: itemDocRef.path,
                    operation: 'delete',
                })
            )
        });
    } else {
      syncWithLocalStorage(newItems);
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    const { auth } = initializeFirebase();
    const user = auth.currentUser;
    const newItems = get().items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    set({ items: newItems });

    if (user) {
        const updatedItem = newItems.find(item => item.productId === productId)!;
        const itemDocRef = doc(getCartRef(user.uid), productId);
        setDoc(itemDocRef, updatedItem, { merge: true })
            .catch(error => {
                errorEmitter.emit(
                    'permission-error',
                    new FirestorePermissionError({
                        path: itemDocRef.path,
                        operation: 'update',
                        requestResourceData: updatedItem,
                    })
                )
            });
    } else {
      syncWithLocalStorage(newItems);
    }
  },

  clearCart: async () => {
    const { auth, firestore } = initializeFirebase();
    const user = auth.currentUser;
    if (user) {
        const cartRef = getCartRef(user.uid);
        const snapshot = await getDocs(cartRef);
        const batch = writeBatch(firestore);
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        batch.commit().catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                    path: cartRef.path,
                    operation: 'delete',
                })
            )
        });
    } else {
      syncWithLocalStorage([]);
    }
    set({ items: [] });
  },
}));
