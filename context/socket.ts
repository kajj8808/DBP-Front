import { createContext } from "react";
import socketio from "socket.io-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER;

console.log(process.env.SOCKET_SERVER);

export const socket = socketio(SERVER_URL);
export const SocketContext = createContext(socket);
