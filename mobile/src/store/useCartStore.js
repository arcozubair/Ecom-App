import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import safeStorage from './safeStorage';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, size) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.product.id === product.id && item.size === size);
        
        if (existingItem) {
          set({ 
            items: currentItems.map(item => 
              item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
            )
          });
        } else {
          set({ items: [...currentItems, { product, size, quantity: 1 }] });
        }
      },
      removeFromCart: (productId, size) => {
        set({ items: get().items.filter(item => !(item.product.id === productId && item.size === size)) });
      },
      updateQuantity: (productId, size, quantity) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter(item => !(item.product.id === productId && item.size === size))
          : state.items.map(item => 
              item.product.id === productId && item.size === size 
                ? { ...item, quantity } 
                : item
            )
      })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (parseFloat(item.product.sale_price || item.product.price || 0) * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
