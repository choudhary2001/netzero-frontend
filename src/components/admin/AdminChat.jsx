import React, { useState, useEffect, useRef } from 'react';
import adminService from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';

const AdminChat = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const messagesEndRef = useRef(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 5;
    const [isBackendAvailable, setIsBackendAvailable] = useState(true);

    // Fetch all conversations on component mount
    useEffect(() => {
        fetchConversations();
        fetchSuppliers();

        // Set up polling with exponential backoff
        // const interval = setInterval(() => {
        //     if (isBackendAvailable) {
        //         if (selectedConversation && retryCount < maxRetries) {
        //             fetchMessages(selectedConversation._id);
        //         }
        //         if (retryCount < maxRetries) {
        //             fetchConversations();
        //         }
        //     }
        // }, 50000 + (retryCount * 1000)); // Using 50 seconds as base polling interval

        // setPollingInterval(interval);

        // return () => {
        //     if (pollingInterval) clearInterval(pollingInterval);
        // };
    }, [pollingInterval, selectedConversation, retryCount, isBackendAvailable]);

    // Scroll to bottom whenever messages change
    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    // Fetch messages when selected conversation changes
    useEffect(() => {
        let intervalId;

        if (selectedConversation && isBackendAvailable) {
            // Fetch immediately
            fetchMessages(selectedConversation._id);

            // Then set up the interval
            intervalId = setInterval(() => {
                fetchMessages(selectedConversation._id);
            }, 10000);
        }

        // Cleanup interval on dependency change or unmount
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [selectedConversation, isBackendAvailable]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const data = await adminService.getChats();
            if (data && data.conversations) {
                setConversations(data.conversations);
                setRetryCount(0); // Reset retry count on success
                setIsBackendAvailable(true);
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
            setError('Failed to load conversations. The server might be unavailable.');
            setRetryCount(prev => Math.min(prev + 1, maxRetries)); // Increment retry count

            if (err.code === 'ERR_NETWORK' || err.code === 'ERR_INSUFFICIENT_RESOURCES') {
                setIsBackendAvailable(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        if (!isBackendAvailable) return;

        try {
            const response = await adminService.getAllSuppliers();
            if (response) {
                setSuppliers(response.suppliers || []);
                setRetryCount(0); // Reset retry count on success
            }
        } catch (err) {
            console.error('Failed to load suppliers:', err);
            // Don't increment retry count for this non-critical operation
        }
    };

    const fetchMessages = async (conversationId) => {
        if (!conversationId || !isBackendAvailable) return;

        try {
            // setLoading(true);
            const data = await adminService.getChat(conversationId);
            if (data && data.messages) {
                setMessages(data.messages);
                setRetryCount(0); // Reset retry count on success
                // Mark messages as read
                await adminService.markMessagesAsRead(conversationId);
                setIsBackendAvailable(true);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages. The server might be unavailable.');
            setRetryCount(prev => Math.min(prev + 1, maxRetries)); // Increment retry count

            if (err.code === 'ERR_NETWORK' || err.code === 'ERR_INSUFFICIENT_RESOURCES') {
                setIsBackendAvailable(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedConversation || !isBackendAvailable) return;

        try {
            await adminService.sendMessage(selectedConversation._id, messageInput);
            setMessageInput('');
            // Fetch updated messages
            fetchMessages(selectedConversation._id);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message. The server might be unavailable.');

            if (err.code === 'ERR_NETWORK' || err.code === 'ERR_INSUFFICIENT_RESOURCES') {
                setIsBackendAvailable(false);
            }
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

    // Get suppliers not in existing conversations
    const getAvailableSuppliers = () => {
        if (!suppliers || !conversations) return [];

        const existingSupplierIds = conversations
            .filter(conv => conv.participants && conv.participants.supplier)
            .map(conv => conv.participants.supplier._id);

        return suppliers.filter(
            supplier => !existingSupplierIds.includes(supplier._id)
        );
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
                                setRetryCount(0);
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
                    <div className="overflow-y-auto h-full">
                        {loading && conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : (
                            <>
                                {conversations.map((conv) => (
                                    <div
                                        key={conv._id}
                                        className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${selectedConversation?._id === conv._id ? 'bg-green-50' : ''
                                            }`}
                                        onClick={() => {
                                            setSelectedConversation(conv);
                                            fetchMessages(conv._id);
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">
                                                    {conv.participants?.supplier?.name || 'Supplier'}
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

                                {/* New conversation dropdown */}
                                {/* <div className="p-3">
                                    <p className="text-sm font-medium mb-2">Start new conversation</p>
                                    <select
                                        className="w-full p-2 border rounded"
                                        onChange={(e) => {
                                            if (e.target.value) startNewConversation(e.target.value);
                                        }}
                                        value=""
                                        disabled={loading}
                                    >
                                        <option value="">Select a supplier</option>
                                        {getAvailableSuppliers().map((supplier) => (
                                            <option key={supplier._id} value={supplier._id}>
                                                {supplier.name || supplier.email}
                                            </option>
                                        ))}
                                    </select>
                                </div> */}
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
                                    {selectedConversation.participants?.supplier?.name || 'Supplier'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {selectedConversation.participants?.supplier?.email}
                                </p>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                {loading && messages.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-4">
                                        Loading messages...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-4">
                                        No messages yet. Start the conversation!
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isFromAdmin = msg.sender === user?._id;
                                        return (
                                            <div
                                                key={index}
                                                className={`mb-4 flex ${isFromAdmin ? 'justify-end' : 'justify-start'
                                                    }`}
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
                                    })
                                )}
                                <div ref={messagesEndRef} />
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
                                <p className="mb-2">Select a conversation or start a new one</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminChat; 