import { create } from "zustand";
import { io, Socket } from "socket.io-client";


interface ServerToClientEvents {
  commentAdded: (comment: TCommentType) => void;
}

interface ClientToServerEvents {
  newComment: (comment: TCommentType) => void;
}

type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketStore {
  socket: SocketInstance;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendComment: (comment: TCommentType) => void;
}

const socket: SocketInstance = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
  {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }
);

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket,
  isConnected: false,

  connect: () => {
    const { socket } = get();

    socket.connect();

    socket.on("connect", () => {
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });
  },

  disconnect: () => {
    const { socket } = get();
    socket.disconnect();
  },

  sendComment: (comment: TCommentType) => {
    const { socket } = get();
    socket.emit("newComment", comment);
  },
}));
