import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import supplierService from '../../services/supplierService';
import socketService from '../../services/socketService';

// Import services
import api from '../../services/api';

const SupplierChat = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [admins, setAdmins] = useState([]);
    const messagesEndRef = useRef(null);
    const [isBackendAvailable, setIsBackendAvailable] = useState(true);

    // Connect to socket on component mount
    useEffect(() => {
        socketService.connect();

        // Set up socket event handlers
        const unsubscribeMessage = socketService.onMessage(async (message) => {
            console.log('Received message:', message);
            // Always update messages if it's for the current conversation
            console.log('Selected conversation:', selectedConversation, message.conversationId, message.conversationId === selectedConversation?._id);
            if (selectedConversation && message.conversationId === selectedConversation._id) {
                // Fetch latest messages to ensure we have the complete conversation
                try {
                    const data = await supplierService.getChat(selectedConversation._id);
                    if (data && data.messages) {
                        setMessages(data.messages);
                        // Mark messages as read
                        await supplierService.markMessagesAsRead(selectedConversation._id);
                    }
                } catch (err) {
                    console.error('Error fetching messages after new message:', err);
                }
                scrollToBottom();
            }
            fetchMessages(message.conversationId);
            fetchConversations();
            scrollToBottom();
        });

        const unsubscribeConversationUpdate = socketService.onConversationUpdate((data) => {
            console.log('Received conversation update:', data);
            // Update the conversation in the list
            setConversations(prev =>
                prev.map(conv =>
                    conv._id === data.conversation._id ? data.conversation : conv
                )
            );
            // If this is the current conversation, update it and fetch latest messages
            if (selectedConversation && selectedConversation._id === data.conversation._id) {
                setSelectedConversation(data.conversation);
                fetchMessages(data.conversation._id);
            }
        });

        const unsubscribeConnect = socketService.onConnect(() => {
            console.log('Socket connected'); // Debug log
            setIsBackendAvailable(true);
            if (selectedConversation) {
                socketService.joinConversation(selectedConversation._id);
                fetchMessages(selectedConversation._id);
            }
        });

        const unsubscribeDisconnect = socketService.onDisconnect(() => {
            console.log('Socket disconnected'); // Debug log
            setIsBackendAvailable(false);
        });

        // Initial data fetch
        fetchConversations();
        fetchAdmins();

        // Cleanup on unmount
        return () => {
            unsubscribeMessage();
            unsubscribeConversationUpdate();
            unsubscribeConnect();
            unsubscribeDisconnect();
            if (selectedConversation) {
                socketService.leaveConversation(selectedConversation._id);
                fetchConversations();
                fetchMessages(selectedConversation._id);
            }
            socketService.disconnect();
        };
    }, []);

    // Handle conversation selection
    useEffect(() => {
        if (selectedConversation) {
            console.log('Joining conversation:', selectedConversation._id);
            // Leave previous conversation room if any
            if (socketService.isConnected()) {
                socketService.joinConversation(selectedConversation._id);
            }
            // Fetch messages when conversation is selected
            fetchMessages(selectedConversation._id);
        }
        return () => {
            if (selectedConversation && socketService.isConnected()) {
                console.log('Leaving conversation:', selectedConversation._id);
                socketService.leaveConversation(selectedConversation._id);
            }
        };
    }, [selectedConversation]);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const data = await supplierService.getChats();
            if (data && data.conversations) {
                setConversations(data.conversations);
                setIsBackendAvailable(true);
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
            setError('Failed to load conversations. The server might be unavailable.');
            setIsBackendAvailable(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async () => {
        if (!isBackendAvailable) return;

        try {
            const response = await supplierService.getAdminUsers();
            setAdmins(response || []);
        } catch (err) {
            console.error('Failed to load admins:', err);
        }
    };

    const fetchMessages = async (conversationId) => {
        if (!conversationId || !isBackendAvailable) return;

        try {
            setLoading(true);
            const data = await supplierService.getChat(conversationId);
            if (data && data.messages) {
                setMessages(data.messages);
                // Mark messages as read
                await supplierService.markMessagesAsRead(conversationId);
                setIsBackendAvailable(true);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages. The server might be unavailable.');
            setIsBackendAvailable(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedConversation || !isBackendAvailable) return;

        try {
            console.log('Sending message to conversation:', selectedConversation._id);
            // Send message through socket
            socketService.sendMessage(selectedConversation._id, messageInput);
            setMessageInput('');

            // Fetch latest messages after sending
            const data = await supplierService.getChat(selectedConversation._id);
            if (data && data.messages) {
                setMessages(data.messages);
                scrollToBottom();
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message. The server might be unavailable.');
            setIsBackendAvailable(false);
        }
    };

    const startNewConversation = async (adminId) => {
        if (!adminId || !isBackendAvailable) return;

        try {
            const data = await supplierService.createChat(adminId);
            if (data && data.conversation) {
                fetchConversations();
                setSelectedConversation(data.conversation);
                setIsBackendAvailable(true);
            }
        } catch (err) {
            console.error('Error creating conversation:', err);
            setError('Failed to create conversation. The server might be unavailable.');

            if (err.code === 'ERR_NETWORK' || err.code === 'ERR_INSUFFICIENT_RESOURCES') {
                setIsBackendAvailable(false);
            }
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    // Check if there are any admin conversations
    const hasAdminConversation = conversations.length > 0;

    // Handle server unavailability
    if (!isBackendAvailable) {
        return (
            <div className="flex flex-col h-[calc(100vh-80px)] items-center justify-center">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 max-w-lg">
                    <h2 className="font-bold mb-2">Server Connection Error</h2>
                    <p>We're having trouble connecting to the server. This could be due to:</p>
                    <ul className="list-disc ml-5 mt-2">
                        <li>Server maintenance</li>
                        <li>Network connectivity issues</li>
                        <li>High server load</li>
                    </ul>
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                setIsBackendAvailable(true);
                                fetchConversations();
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Retry Connection
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* <h1 className="text-2xl font-bold mb-4">Support Chat</h1> */}

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p>{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-sm mt-2 text-red-700 underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden border rounded-lg shadow">
                {/* Sidebar - only show if there are multiple conversations */}
                {hasAdminConversation && (
                    <div className="w-1/4 bg-gray-50 border-r">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold">Support Staff</h2>
                        </div>

                        {/* Conversation list */}
                        <div className="overflow-y-auto h-[calc(100vh-200px)]">
                            {loading && conversations.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">Loading...</div>
                            ) : conversations.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">No conversations yet</div>
                            ) : (
                                <>
                                    {conversations.map((conv) => (
                                        <div
                                            key={conv._id}
                                            className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${selectedConversation?._id === conv._id ? 'bg-green-50' : ''
                                                }`}
                                            onClick={() => {
                                                if (!selectedConversation || selectedConversation._id !== conv._id) {
                                                    setSelectedConversation(conv);
                                                } else {
                                                    // Optionally handle reselecting the same conversation
                                                    console.log('Already selected');
                                                }
                                            }}

                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-medium">
                                                        {conv.participants?.admin?.name || 'Admin'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {conv.lastMessage?.content || 'No messages yet'}
                                                    </p>
                                                </div>
                                                {conv.unreadCount?.supplier > 0 && (
                                                    <span className="bg-green-500 text-white rounded-full px-2 py-1 text-xs">
                                                        {conv.unreadCount.supplier}
                                                    </span>
                                                )}
                                            </div>
                                            {conv.lastMessage && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatDate(conv.lastMessage.timestamp)}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Chat area */}
                <div className={`flex-1 flex flex-col ${!hasAdminConversation ? 'w-full' : ''}`}>
                    {selectedConversation ? (
                        <>
                            {/* Chat header */}
                            <div className="p-4 border-b bg-white">
                                <h2 className="font-semibold">
                                    {selectedConversation.participants?.admin?.name || 'Support Staff'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    We're here to help you with any questions or issues.
                                </p>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ height: 'calc(100vh - 280px)' }}>
                                {loading && messages.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-4">
                                        Loading messages...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-4">
                                        No messages yet. Start the conversation!
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((msg, index) => {
                                            const isFromSupplier = msg.sender === user?._id;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`flex ${isFromSupplier ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] rounded-lg p-3 ${isFromSupplier
                                                            ? 'bg-green-500 text-white rounded-br-none'
                                                            : 'bg-white border rounded-bl-none'
                                                            }`}
                                                    >
                                                        <p>{msg.content}</p>
                                                        <p
                                                            className={`text-xs mt-1 ${isFromSupplier ? 'text-green-100' : 'text-gray-400'
                                                                }`}
                                                        >
                                                            {formatDate(msg.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Message input */}
                            <div className="p-4 border-t bg-white">
                                <form onSubmit={handleSendMessage} className="flex">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 focus:outline-none"
                                        disabled={!messageInput.trim() || loading}
                                    >
                                        {loading ? 'Sending...' : 'Send'}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center text-gray-500 p-8">
                                {hasAdminConversation ? (
                                    <p className="mb-2">Select a conversation to start chatting</p>
                                ) : (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Contact Support</h3>
                                        <p className="mb-4">Start a conversation with our support team to get help with your questions.</p>
                                        <button
                                            onClick={() => {
                                                if (admins.length > 0) {
                                                    startNewConversation(admins[0]._id);
                                                } else {
                                                    setError('No support staff available. Please try again later.');
                                                }
                                            }}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
                                            disabled={loading}
                                        >
                                            {loading ? 'Please wait...' : 'Start New Conversation'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupplierChat; 