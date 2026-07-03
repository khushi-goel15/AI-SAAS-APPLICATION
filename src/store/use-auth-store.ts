import { create } from "zustand"
import type { User } from "@/types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    createdAt: new Date("2024-01-01"),
    usage: {
      chatQueries: 45,
      chatLimit: 100,
      wordsGenerated: 15000,
      wordLimit: 100000,
      imagesGenerated: 12,
      imageLimit: 500,
      storageUsed: 256000000,
      storageLimit: 1073741824,
    },
  },
  isAuthenticated: true,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
