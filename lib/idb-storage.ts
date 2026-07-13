import { get, set, del } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

// Stocke l'état de l'application (conversations, préférences) dans IndexedDB
// plutôt que localStorage : plus de capacité, mieux adapté à un historique de chat.
export const indexedDbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  }
};
