// src/app/api/socket.ts
import { Server as IOServer } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next"; // Import the types
import { Server as NetServer } from "http";
import { Socket } from "net";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io?: IOServer;
    };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io...");
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New socket connection:", socket.id);

      socket.on("message", (msg) => {
        io.emit("message", msg);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });
  } else {
    console.log("Socket.io already initialized.");
  }
  res.end();
}
