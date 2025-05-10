import api from './api';

const supplierService = {
    // Get basic supplier profile
    getProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    // Update supplier profile
    updateProfile: async (profileData) => {
        try {
            const response = await api.post('/users/profile', profileData);
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    // Get admin users (for chat)
    getAdminUsers: async () => {
        try {
            // We can just request admin users from the users endpoint with a role filter
            const response = await api.get('/users', { params: { role: 'admin' } });
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error fetching admin users:', error);
            throw error;
        }
    },

    // Chat related functions
    getChats: async () => {
        try {
            const response = await api.get('/chat/conversations');
            return response.data;
        } catch (error) {
            console.error('Error fetching chats:', error);
            throw error;
        }
    },

    createChat: async (adminId) => {
        try {
            const response = await api.post('/chat/conversations', { receiverId: adminId });
            return response.data;
        } catch (error) {
            console.error('Error creating chat:', error);
            throw error;
        }
    },

    getChat: async (conversationId) => {
        try {
            const response = await api.get(`/chat/conversations/${conversationId}/messages`);
            return response.data;
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            throw error;
        }
    },

    sendMessage: async (conversationId, content) => {
        try {
            const response = await api.post(`/chat/conversations/${conversationId}/messages`, { content });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    markMessagesAsRead: async (conversationId) => {
        try {
            const response = await api.put(`/chat/conversations/${conversationId}/read`);
            return response.data;
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    },

    getUnreadCount: async () => {
        try {
            const response = await api.get('/chat/unread');
            return response.data;
        } catch (error) {
            console.error('Error getting unread count:', error);
            throw error;
        }
    }
};

export default supplierService; 