import { io } from "socket.io-client";

const SOCKET_URL = "https://avmart-backend-1.onrender.com";

const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: false,
});

export default socket;
