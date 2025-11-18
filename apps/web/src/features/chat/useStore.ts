import { create } from "zustand";

export type ChatMessage =
  | {
      id: number;
      conversationId: number;
      senderId: number;
      message: string;
      createdAt: Date | string | null;
      updatedAt: Date | string | null;
    }
  | any;

type ChatState = {
  zustandStoreMessages: ChatMessage[];
  setzustandStoreMessages: (msgs: ChatMessage[]) => void;
  liveMessages: ChatMessage[];
  setLiveMessage: (msg: ChatMessage) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  zustandStoreMessages: [],
  liveMessages: [],
  setzustandStoreMessages: (msgs) => set({ zustandStoreMessages: msgs }),
  setLiveMessage: (msg) =>
    set((state) => ({
      liveMessages: [...state.liveMessages, msg],
    })),
}));
