import { io } from 'socket.io-client';
import store from '../store';

import { API_SOCKET_BASE_URL } from '../config';

class SocketService {
    constructor() {
        this.socket = null;
        this.messageHandlers = new Set();
        this.conversationUpdateHandlers = new Set();
        this.connectionHandlers = new Set();
        this.disconnectionHandlers = new Set();
    }

    connect() {
        if (this.socket?.connected) return;

        const token = store.getState().auth.token;
        if (!token) {
            console.error('No auth token available for socket connection');
            return;
        }

        // Connect to the socket server with auth token
        this.socket = io(API_SOCKET_BASE_URL, {
            auth: { token },
            path: '/socket.io/',
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true
        });

        // Set up event listeners
        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.connectionHandlers.forEach(handler => handler());
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.disconnectionHandlers.forEach(handler => handler());
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        this.socket.on('message', (message) => {
            this.messageHandlers.forEach(handler => handler(message));
        });

        this.socket.on('conversation_update', (conversation) => {
            this.conversationUpdateHandlers.forEach(handler =>
                handler({ type: 'conversation_update', conversation })
            );
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`Socket reconnection attempt ${attemptNumber}`);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Subscribe to new messages
    onMessage(handler) {
        this.messageHandlers.add(handler);
        return () => this.messageHandlers.delete(handler);
    }

    // Subscribe to connection events
    onConnect(handler) {
        this.connectionHandlers.add(handler);
        return () => this.connectionHandlers.delete(handler);
    }

    // Subscribe to disconnection events
    onDisconnect(handler) {
        this.disconnectionHandlers.add(handler);
        return () => this.disconnectionHandlers.delete(handler);
    }

    // Subscribe to conversation updates
    onConversationUpdate(handler) {
        this.conversationUpdateHandlers.add(handler);
        return () => this.conversationUpdateHandlers.delete(handler);
    }

    // Send a message
    sendMessage(conversationId, content) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }
        this.socket.emit('message', { conversationId, content });
    }

    // Join a conversation room
    joinConversation(conversationId) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }
        this.socket.emit('join_conversation', conversationId);
    }

    // Leave a conversation room
    leaveConversation(conversationId) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }
        this.socket.emit('leave_conversation', conversationId);
    }

    // Get connection status
    isConnected() {
        return this.socket?.connected || false;
    }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService; 