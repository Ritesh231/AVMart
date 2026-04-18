import { useEffect, useState } from "react";
import socket from "../utils/socket";

export default function useSocket() {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
            console.log("Socket connected to:", socket.io.uri);
            setIsConnected(true);
            // Join the admin room
            socket.emit("adminJoin");
        }

        function onConnectError(error) {
            console.error("Socket connection error:", error);
            setIsConnected(false);
        }

        function onDisconnect(reason) {
            console.log("Socket disconnected:", reason);
            setIsConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("connect_error", onConnectError);
        socket.on("disconnect", onDisconnect);

        // Catch-all for debugging
        socket.onAny((eventName, ...args) => {
            console.log(`Socket incoming event: ${eventName}`, args);
        });

        if (!socket.connected) {
            socket.connect();
        } else {
            // If already connected, make sure we join the admin room
            socket.emit("adminJoin");
            setIsConnected(true);
        }

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    return { socket, isConnected };
}
