import { DefaultEventsMap, Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
function setupSocket(server: HTTPServer): Server {
   io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_ALLOWED_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    // Join the user to a room based on their user ID
    socket.on("joinRoom", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    // Listen for updates to user info
    socket.on("updateUserInfo", (userId) => {
      io.to(userId).emit("userInfoUpdated", { updated: true });
    });
  });

  return io;
}
export function emitUserUpdate( userId: string) {
  io.to(userId).emit("userInfoUpdated", { updated: true });
}

export default setupSocket;
