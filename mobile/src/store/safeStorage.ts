/**
 * Safe storage adapter for Zustand persist middleware.
 * Wraps AsyncStorage with a graceful in-memory fallback
 * if the native module isn't available (first launch, dev reload, etc.)
 */

let AsyncStorage: any = null;

try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  console.warn('[Storage] AsyncStorage not available, using in-memory fallback.');
}

// In-memory fallback
const memoryStore: Record<string, string> = {};

const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (AsyncStorage) {
        return await AsyncStorage.getItem(key);
      }
    } catch (e) {
      // fall through to memory
    }
    return memoryStore[key] ?? null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (AsyncStorage) {
        await AsyncStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // fall through to memory
    }
    memoryStore[key] = value;
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (AsyncStorage) {
        await AsyncStorage.removeItem(key);
        return;
      }
    } catch (e) {
      // fall through to memory
    }
    delete memoryStore[key];
  },
};

export default safeStorage;
