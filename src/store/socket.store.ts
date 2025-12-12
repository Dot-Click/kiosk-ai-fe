import { environment, backendDomain } from "@/configs/axios.config";
import { io, type Socket } from "socket.io-client";
import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

let socketInstance: Socket | null = null;

export interface SocketStore {
  initSocket: (sessionId: string) => void;
  socket: () => Socket;
  sessionId?: string;
}

const store: StateCreator<SocketStore> = (set, get) => ({
  sessionId: undefined,
  socket: () => {
    if (!socketInstance) {
      const currentSessionId = get().sessionId;
      socketInstance = io(backendDomain, {
        autoConnect: false,
        withCredentials: true,
        auth: {
          sessionId: currentSessionId,
        },
      });
    }
    return socketInstance;
  },
  initSocket: (sessionId) => {
    set({ sessionId });
    // Create and connect socket with session
    if (!socketInstance) {
      socketInstance = io(backendDomain, {
        autoConnect: false,
        withCredentials: true,
        auth: {
          sessionId,
        },
      });
    } else {
      // Reconnect with new session
      if (socketInstance.connected) {
        socketInstance.disconnect();
      }
      socketInstance.auth = { sessionId };
    }
    socketInstance.connect();
  },
});

export const useSocket = create(
  devtools<SocketStore>(store, {
    enabled: environment === "development",
    store: "socket store",
  })
);
