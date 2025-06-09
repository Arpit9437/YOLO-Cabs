import { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_API_URL}`); 

const SocketProvider = ({ children }) => {
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Debug: log all socket events
        const debugHandler = (event, ...args) => {
            console.log(`[Socket Debug] Event: ${event}`, ...args);
        };
        // Listen to all events for debugging
        socket.onAny(debugHandler);

        return () => {
            socket.offAny(debugHandler);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;