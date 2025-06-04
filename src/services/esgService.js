import api from './api';
import { toast } from 'react-toastify';
import axios from 'axios';

const esgService = {
    // Test API connection
    testConnection: async () => {
        try {
            const response = await api.get('/esg/test');
            console.log('API connection test successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('API connection test failed:', error);
            return {
                success: false,
                message: error.message || 'Failed to connect to the ESG API',
                data: null
            };
        }
    },

    // Get dashboard data for supplier
    getDashboardData: async () => {
        try {
            const response = await api.get('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch dashboard data',
                data: {
                    esgScores: {
                        environmental: 0,
                        social: 0,
                        quality: 0,
                        overall: 0
                    },
                    formCompletion: {
                        company: 0,
                        environmental: 0,
                        social: 0,
                        quality: 0
                    },
                    recentUpdates: []
                }
            };
        }
    },

    // Get ESG data for current user
    getESGData: async () => {
        try {
            const response = await api.get('/esg/data');
            return response.data;
        } catch (error) {
            console.error('Error fetching ESG data:', error);
            // Return a default response structure to avoid UI crashes
            return {
                success: false,
                message: error.message || 'Failed to fetch ESG data',
                data: null
            };
        }
    },

    // Get company info for current user
    getCompanyInfo: async () => {
        try {
            const response = await api.get('/company-info');
            return response.data;
        } catch (error) {
            console.error('Error fetching company info:', error);
            if (error.response?.status === 404) {
                // Not found is not an error, just means we need to fill it out
                return {
                    success: false,
                    message: 'Company information not found',
                    data: null
                };
            }
            // Return a default response structure to avoid UI crashes
            return {
                success: false,
                message: error.message || 'Failed to fetch company information',
                data: null
            };
        }
    },

    // Update company info
    updateCompanyInfo: async (data) => {
        try {
            const response = await api.post('/company-info', {
                data
            });
            return response.data;
        } catch (error) {
            console.error('Error updating company info:', error);
            toast.error(error.response?.data?.message || 'Failed to update company information');
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update company information',
                data: null
            };
        }
    },

    // Update a specific section of ESG data
    updateESGData: async (category, section, data) => {
        try {
            const response = await api.post('/esg/update', {
                category, // 'environment', 'social', or 'quality'
                section,  // The specific section within the category
                data      // The data to update
            });
            return response.data;
        } catch (error) {
            console.error('Error updating ESG data:', error);
            toast.error(error.response?.data?.message || 'Failed to update ESG data');
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update ESG data',
                data: null
            };
        }
    },

    // Submit ESG data for review
    submitESGData: async () => {
        try {
            const response = await api.post('/esg/submit');
            return response.data;
        } catch (error) {
            console.error('Error submitting ESG data:', error);
            toast.error(error.response?.data?.message || 'Failed to submit ESG data');
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to submit ESG data',
                data: null
            };
        }
    },

    // Upload certificate file and return file path
    uploadCertificate: async (file, category, section) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', category);
            formData.append('section', section);

            const response = await api.post('/esg/upload-certificate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading certificate:', error);
            toast.error(error.response?.data?.message || 'Failed to upload certificate');
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to upload certificate',
                data: null
            };
        }
    },

    // Admin: Get all ESG data submissions
    getAllESGData: async () => {
        try {
            const response = await api.get('/esg/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching all ESG data:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch all ESG data');
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch all ESG data',
                data: []
            };
        }
    },

    // Admin: Review an ESG submission
    reviewESGData: async (esgDataId, status, reviewComments) => {
        try {
            const response = await api.post(`/esg/review/${esgDataId}`, {
                status,
                reviewComments
            });
            return response.data;
        } catch (error) {
            console.error('Error reviewing ESG data:', error);
            toast.error(error.response?.data?.message || 'Failed to review ESG data');
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to review ESG data',
                data: null
            };
        }
    },

    // Admin: Update points for a specific section
    updateSectionPoints: async (esgDataId, category, section, points) => {
        try {
            const response = await api.post('/esg/update-points', {
                esgDataId,
                category,
                section,
                points
            });
            return response.data;
        } catch (error) {
            console.error('Error updating section points:', error);
            toast.error(error.response?.data?.message || 'Failed to update points');
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update points',
                data: null
            };
        }
    },

    // Get ESG data for a specific supplier
    getSupplierESGData: async (supplierId) => {
        try {
            const response = await api.get(`/esg/supplier/${supplierId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching supplier ESG data:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch supplier ESG data');
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch supplier ESG data',
                data: null
            };
        }
    },

    submitPartnerDetails: async (partnerData) => {
        try {
            const response = await api.post('/submit-partner', partnerData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Error submitting partner details' };
        }
    }
};

export default esgService; 