import { createContext } from "react";
import socketio from "socket.io-client";

const SERVER_URL = "http://localhost:4000";

export const socket = socketio(SERVER_URL);
export const SocketContext = createContext(socket);
