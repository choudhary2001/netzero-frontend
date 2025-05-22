import api from './api';

const userService = {
    async getAllUsers() {
        try {
            const response = await api.get('/users/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getUserById(id) {
        try {
            const response = await api.get(`/users/${id}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async createUser(userData) {
        try {
            const response = await api.post('/users/', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateUser(id, userData) {
        try {
            const response = await api.put(`/users/${id}/`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteUser(id) {
        try {
            await api.delete(`/users/${id}/`);
        } catch (error) {
            throw error;
        }
    },

    async changePassword(id, passwords) {
        try {
            const response = await api.post(`/users/${id}/change-password/`, passwords);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async resetPassword(email) {
        try {
            const response = await api.post('/users/reset-password/', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async verifyResetToken(token) {
        try {
            const response = await api.post('/users/verify-reset-token/', { token });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async setNewPassword(token, newPassword) {
        try {
            const response = await api.post('/users/set-new-password/', {
                token,
                new_password: newPassword
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateProfile(id, profileData) {
        try {
            const response = await api.patch(`/users/${id}/profile/`, profileData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async uploadAvatar(id, file) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const response = await api.post(`/users/${id}/avatar/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/users/profile/');
            return response;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    updateProfile: async (data) => {
        try {
            const response = await api.post('/users/profile/', data);
            return response;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    changePassword: async (data) => {
        try {
            const response = await api.post('/users/change-password/', data);
            return response;
        } catch (error) {
            console.error('Error changing password:', error);
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
    }
};

export default userService; 