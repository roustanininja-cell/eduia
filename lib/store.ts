"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import { indexedDbStorage } from "./idb-storage";
import {
  ChatMessage,
  Conversation,
  DEFAULT_PREFERENCES,
  UserPreferences
} from "./types";

interface AppState {
  preferences: UserPreferences;
  conversations: Conversation[];
  activeConversationId: string | null;

  setPreferences: (prefs: Partial<UserPreferences>) => void;
  completeOnboarding: (level: UserPreferences["level"], language: UserPreferences["language"]) => void;

  newConversation: () => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setActiveConversation: (id: string) => void;

  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  removeMessage: (conversationId: string, messageId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      preferences: DEFAULT_PREFERENCES,
      conversations: [],
      activeConversationId: null,

      setPreferences: (prefs) =>
        set((state) => ({ preferences: { ...state.preferences, ...prefs } })),

      completeOnboarding: (level, language) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            level,
            language,
            onboardingComplete: true
          }
        })),

      newConversation: () => {
        const id = uuid();
        const conversation: Conversation = {
          id,
          title: "Nouvelle conversation",
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id
        }));
        return id;
      },

      deleteConversation: (id) =>
        set((state) => {
          const conversations = state.conversations.filter((c) => c.id !== id);
          const activeConversationId =
            state.activeConversationId === id
              ? conversations[0]?.id ?? null
              : state.activeConversationId;
          return { conversations, activeConversationId };
        }),

      renameConversation: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c
          )
        })),

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const isFirstUserMessage = c.messages.length === 0 && message.role === "user";
            return {
              ...c,
              messages: [...c.messages, message],
              title: isFirstUserMessage
                ? message.content.slice(0, 40) || c.title
                : c.title,
              updatedAt: new Date().toISOString()
            };
          })
        })),

      updateMessage: (conversationId, messageId, content) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id !== conversationId
              ? c
              : {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, content } : m
                  )
                }
          )
        })),

      removeMessage: (conversationId, messageId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id !== conversationId
              ? c
              : { ...c, messages: c.messages.filter((m) => m.id !== messageId) }
          )
        }))
    }),
    {
      name: "eduai-storage",
      storage: createJSONStorage(() => indexedDbStorage),
      skipHydration: true
    }
  )
);
