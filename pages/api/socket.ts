import { NextApiRequest, NextApiResponse } from "next";
import { useState } from "react";
import socketio, { Server } from "socket.io";

const SERVER_URL = "http://localhost:4000";

interface IJoinRoom {
  roomName: string;
  userId: string;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (res.socket.server.io) {
    console.log("socket is already running ");
    res.end();
    return;
  }
  const io = new Server(res.socket.server);

  const [sockets, setSockets] = useState<socketio.Socket[] | null>();

  io.on("connection", (socket: socketio.Socket) => {
    //setSockets(() => [...sockets, socket]);
    socket.on("join_room", ({ roomName, userId }: IJoinRoom) => {
      console.log(roomName);
    });
  });

  console.log("socket is initailizing");

  res.end();
};
