import api from './api';

const adminService = {
    // Dashboard
    getDashboardSummary: async () => {
        try {
            const response = await api.get('/admin/dashboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            throw error;
        }
    },

    // User Management
    getAllUsers: async () => {
        try {
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    createUser: async (userData) => {
        try {
            const response = await api.post('/admin/users', userData);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/admin/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    // ESG Submissions
    getAllESGSubmissions: async () => {
        try {
            const response = await api.get('/admin/esg-submissions');
            return response.data;
        } catch (error) {
            console.error('Error fetching ESG submissions:', error);
            throw error;
        }
    },

    // Review ESG Data (Uses existing esgService endpoint)
    reviewESGData: async (esgDataId, status, comments) => {
        try {
            const response = await api.post(`/esg/review/${esgDataId}`, {
                status,
                reviewComments: comments
            });
            return response.data;
        } catch (error) {
            console.error('Error reviewing ESG data:', error);
            throw error;
        }
    },

    // Update section points (Uses existing esgService endpoint)
    updateSectionPoints: async (esgDataId, category, section, points, remarks) => {
        try {
            const response = await api.post('/esg/update-points', {
                esgDataId,
                category,
                section,
                points,
                remarks
            });
            return response.data;
        } catch (error) {
            console.error('Error updating section points:', error);
            throw error;
        }
    },

    // Update company info remarks
    updateCompanyInfoRemarks: async (esgDataId, rating, remarks) => {
        try {
            const response = await api.post('/company-info/rating', {
                esgDataId,
                rating,
                remarks
            });
            return response.data;
        } catch (error) {
            console.error('Error updating company info remarks:', error);
            throw error;
        }
    },

    // Message Analytics
    getMessageAnalytics: async () => {
        try {
            const response = await api.get('/admin/message-analytics');
            return response.data;
        } catch (error) {
            console.error('Error fetching message analytics:', error);
            throw error;
        }
    },

    // Supplier Management (Uses existing endpoints)
    getAllSuppliers: async () => {
        try {
            const response = await api.get('/suppliers');
            return response.data;
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            throw error;
        }
    },

    getSupplierById: async (supplierId) => {
        try {
            const response = await api.get(`/suppliers/${supplierId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching supplier:', error);
            throw error;
        }
    },

    updateSupplierEsgScores: async (supplierId, scores) => {
        try {
            const response = await api.patch(`/suppliers/${supplierId}/esg-scores`, scores);
            return response.data;
        } catch (error) {
            console.error('Error updating supplier ESG scores:', error);
            throw error;
        }
    },

    // Chat Management
    getChats: async () => {
        try {
            const response = await api.get('/chat/conversations');
            return response.data;
        } catch (error) {
            console.error('Error fetching chats:', error);
            throw error;
        }
    },

    createChat: async (supplierId) => {
        try {
            const response = await api.post('/chat/conversations', { receiverId: supplierId });
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

    submitContactForm: async (data) => {
        try {
            const response = await api.post('/contact/', data);
            return response;
        } catch (error) {
            console.error('Error submitting contact form:', error);
            throw error;
        }
    },

    getAllContacts: async (params) => {
        try {
            const response = await api.get('/admin/contacts', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw error;
        }
    },

    getContactById: async (id) => {
        try {
            const response = await api.get(`/admin/contacts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching contact:', error);
            throw error;
        }
    },

    updateContact: async (id, data) => {
        try {
            const response = await api.put(`/admin/contacts/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating contact:', error);
            throw error;
        }
    },

    deleteContact: async (id) => {
        try {
            const response = await api.delete(`/admin/contacts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting contact:', error);
            throw error;
        }
    },

    getContactStats: async () => {
        try {
            const response = await api.get('/admin/contacts/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching contact stats:', error);
            throw error;
        }
    }
};

export default adminService; 