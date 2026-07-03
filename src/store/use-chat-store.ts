import { create } from "zustand"
import type { Chat, Message } from "@/types"

interface ChatState {
  chats: Chat[]
  activeChat: string | null
  isLoading: boolean
  error: string | null
  setActiveChat: (id: string | null) => void
  addChat: (chat: Chat) => void
  deleteChat: (id: string) => void
  togglePinChat: (id: string) => void
  addMessage: (chatId: string, message: Message) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateChatTitle: (id: string, title: string) => void
  updateChatModel: (id: string, model: string) => void
}

const DEFAULT_CHATS: Chat[] = [
  {
    id: "1",
    title: "Welcome to AI Chat",
    messages: [
      {
        id: "1",
        role: "assistant",
        content: "Hello! Welcome to AI Chat. I'm your intelligent assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ],
    pinned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    model: "gpt-4",
  },
]

export const useChatStore = create<ChatState>((set) => ({
  chats: DEFAULT_CHATS,
  activeChat: "1",
  isLoading: false,
  error: null,
  setActiveChat: (id) => set({ activeChat: id }),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  deleteChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== id),
      activeChat: state.activeChat === id ? null : state.activeChat,
    })),
  togglePinChat: (id) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c
      ),
    })),
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, message], updatedAt: new Date() }
          : c
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  updateChatTitle: (id, title) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === id ? { ...c, title } : c
      ),
    })),
  updateChatModel: (id, model) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === id ? { ...c, model } : c
      ),
    })),
}))
