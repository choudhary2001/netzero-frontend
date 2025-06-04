import React, { useState, useEffect, useRef } from 'react';
import adminService from '../../services/adminService';
import socketService from '../../services/socketService';
import { useAuth } from '../../hooks/useAuth';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const AdminChat = () => {
    const { companyId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const messagesEndRef = useRef(null);
    const [isBackendAvailable, setIsBackendAvailable] = useState(true);
    const initialFetchDone = useRef(false);

    // Single useEffect for initial data fetching
    useEffect(() => {
        if (!initialFetchDone.current) {
            initialFetchDone.current = true;
            fetchInitialData();
        }
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            // Fetch conversations and suppliers in parallel
            const [conversationsData, suppliersData] = await Promise.all([
                adminService.getChats(),
                adminService.getAllSuppliers()
            ]);

            if (conversationsData && conversationsData.conversations) {
                setConversations(conversationsData.conversations);

                // If companyId is present, find or create chat
                if (companyId) {
                    const existingChat = conversationsData.conversations.find(
                        conv => conv.participants?.company?._id === companyId
                    );

                    if (existingChat) {
                        setSelectedConversation(existingChat);
                        fetchMessages(existingChat._id);
                    } else {
                        const newChatData = await adminService.createChat(companyId);
                        if (newChatData && newChatData.conversation) {
                            setConversations(prev => [...prev, newChatData.conversation]);
                            setSelectedConversation(newChatData.conversation);
                        }
                    }
                }
            }

            if (suppliersData) {
                setSuppliers(suppliersData.suppliers || []);
            }

            setIsBackendAvailable(true);
        } catch (err) {
            console.error('Error fetching initial data:', err);
            setError('Failed to load initial data');
            setIsBackendAvailable(false);
        } finally {
            setLoading(false);
        }
    };

    // Connect to socket on component mount
    useEffect(() => {
        socketService.connect();

        // Set up socket event handlers
        const unsubscribeMessage = socketService.onMessage((message) => {
            if (selectedConversation && message.conversationId === selectedConversation?._id) {
                setMessages(prev => [...prev, message]);
                fetchMessages(selectedConversation._id);
                scrollToBottom();
            }
            fetchMessages(message.conversationId);
            scrollToBottom();
            fetchConversations();
        });

        const unsubscribeConnect = socketService.onConnect(() => {
            setIsBackendAvailable(true);
            if (selectedConversation) {
                socketService.joinConversation(selectedConversation._id);
                fetchMessages(selectedConversation._id);
            }
        });

        const unsubscribeDisconnect = socketService.onDisconnect(() => {
            setIsBackendAvailable(false);
        });

        // Cleanup on unmount
        return () => {
            unsubscribeMessage();
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
            // Leave previous conversation room if any
            if (socketService.isConnected()) {
                socketService.joinConversation(selectedConversation._id);
            }
            fetchMessages(selectedConversation._id);
        }
        return () => {
            if (selectedConversation && socketService.isConnected()) {
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
            const data = await adminService.getChats();
            console.log(data);
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

    const fetchSuppliers = async () => {
        if (!isBackendAvailable) return;

        try {
            const response = await adminService.getAllSuppliers();
            console.log(response);
            if (response) {
                setSuppliers(response.suppliers || []);
            }
        } catch (err) {
            console.error('Failed to load suppliers:', err);
        }
    };

    useEffect(() => {
        fetchSuppliers();
        fetchConversations();
    }, []);

    const fetchMessages = async (conversationId) => {
        if (!conversationId || !isBackendAvailable) return;

        try {
            const data = await adminService.getChat(conversationId);
            if (data && data.messages) {
                setMessages(data.messages);
                await adminService.markMessagesAsRead(conversationId);
                setIsBackendAvailable(true);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages. The server might be unavailable.');
            setIsBackendAvailable(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedConversation || !isBackendAvailable) return;

        try {
            // Send message through socket
            socketService.sendMessage(selectedConversation._id, messageInput);
            setMessageInput('');
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message. The server might be unavailable.');
            setIsBackendAvailable(false);
        }
    };

    const startNewConversation = async (supplierId) => {
        if (!supplierId || !isBackendAvailable) return;

        try {
            const data = await adminService.createChat(supplierId);
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
                {/* Sidebar */}
                <div className="w-1/4 bg-gray-50 border-r">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold">Conversations</h2>
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
                                            setSelectedConversation(conv);
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium flex items-center justify-between w-full gap-2">
                                                    {conv.participants?.supplier?.name || 'Supplier'}<p
                                                        className={`text-xs text-white rounded-full px-2 py-1 ${conv.participants?.supplier?.role === 'supplier'
                                                            ? 'bg-blue-500'
                                                            : 'bg-green-500'
                                                            }`}
                                                    >
                                                        {conv.participants?.supplier?.role === 'supplier' ? 'Value Chain Partner' : conv.participants?.supplier?.role}
                                                    </p>

                                                </h3>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {conv.lastMessage?.content || 'No messages yet'}
                                                </p>
                                            </div>
                                            {conv.unreadCount?.admin > 0 && (
                                                <span className="bg-green-500 text-white rounded-full px-2 py-1 text-xs">
                                                    {conv.unreadCount.admin}
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

                {/* Chat area */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat header */}
                            <div className="p-4 border-b bg-white">
                                <h2 className="font-semibold">
                                    {selectedConversation.participants?.supplier?.name || ''}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {selectedConversation.participants?.supplier?.email}
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
                                            const isFromAdmin = msg.sender === user?._id;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`flex ${isFromAdmin ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] rounded-lg p-3 ${isFromAdmin
                                                            ? 'bg-green-500 text-white rounded-br-none'
                                                            : 'bg-white border rounded-bl-none'
                                                            }`}
                                                    >
                                                        <p>{msg.content}</p>
                                                        <p
                                                            className={`text-xs mt-1 ${isFromAdmin ? 'text-green-100' : 'text-gray-400'
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
                            <div className="text-center text-gray-500">
                                {companyId ? (
                                    <p className="mb-2">Loading chat...</p>
                                ) : (
                                    <p className="mb-2">Select a conversation or start a new one</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminChat; 