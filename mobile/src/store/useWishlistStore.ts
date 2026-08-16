import { create } from 'zustand';

interface WishlistState {
  items: any[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  addToWishlist: (product) => {
    if (!get().isInWishlist(product.id)) {
      set({ items: [...get().items, product] });
    }
  },
  removeFromWishlist: (productId) => {
    set({ items: get().items.filter((p) => p.id !== productId) });
  },
  isInWishlist: (productId) => {
    return get().items.some((p) => p.id === productId);
  },
}));
