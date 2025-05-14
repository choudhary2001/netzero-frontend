import React, { useState, useEffect } from 'react';
import { FiUser, FiLock, FiSave, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import api from '../../services/api';
import userService from '../../services/userService';

const AccountSettings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);

    // Profile state
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        contactPerson: '',
        website: '',
        industry: ''
    });

    // Password state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Load user data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setProfileLoading(true);
                const response = await userService.getProfile();

                if (response.data) {
                    setProfileForm({
                        name: response.data.full_name || '',
                        email: response.data.email || '',
                        phone: response.data.phone || '',
                        companyName: response.data.companyName || '',
                        contactPerson: response.data.contactPerson || '',
                        website: response.data.website || '',
                        industry: response.data.industry || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('Could not load user profile. Using default values.');

                // Fall back to user state if API fails
                if (user) {
                    setProfileForm({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        companyName: user.companyName || '',
                        contactPerson: user.contactPerson || '',
                        website: user.website || '',
                        industry: user.industry || ''
                    });
                }
            } finally {
                setProfileLoading(false);
            }
        };

        fetchUserProfile();
    }, [user]);

    // Handle profile form changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle password form changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save profile information
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare the payload and ensure contactPerson is never empty
            const payload = {
                name: profileForm.name,
                phone: profileForm.phone,
                companyName: profileForm.companyName,
                contactPerson: profileForm.contactPerson || profileForm.name || 'Contact Person',
                website: profileForm.website,
                industry: profileForm.industry
            };

            const response = await userService.updateProfile(payload);

            if (response.data) {
                // Update Redux state with new user info by using loginSuccess
                dispatch(loginSuccess({
                    token: authState.token,
                    refreshToken: authState.refreshToken,
                    user: {
                        ...authState.user,
                        ...response.data
                    }
                }));

                toast.success("Profile updated successfully!");
            } else {
                toast.error("Failed to update profile.");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "An error occurred while updating profile.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Update password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        // Validate password length
        if (passwordForm.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                current_password: passwordForm.currentPassword,
                new_password: passwordForm.newPassword
            };

            const response = await userService.changePassword(payload);

            if (response.data && response.data.success) {
                toast.success("Password updated successfully!");
                // Clear form fields
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                toast.error(response.data?.message || "Failed to update password.");
            }
        } catch (error) {
            console.error('Error updating password:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "An error occurred while updating password.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (profileLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FiLoader className="animate-spin text-green-500 mr-2" />
                <span>Loading account settings...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Account Settings</h1>

            <div className="bg-white rounded-lg shadow-md">
                {/* Tab Navigation */}
                <div className="flex flex-wrap border-b border-gray-200">
                    <button
                        className={`px-6 py-4 text-sm font-medium flex items-center ${activeTab === 'profile' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FiUser className="mr-2" />
                        Profile Information
                    </button>
                    <button
                        className={`px-6 py-4 text-sm font-medium flex items-center ${activeTab === 'password' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
                        onClick={() => setActiveTab('password')}
                    >
                        <FiLock className="mr-2" />
                        Password
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Profile Information */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileSubmit}>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
                            <p className="text-gray-600 mb-2">Update your personal and company information.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileForm.name}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileForm.email}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileForm.phone}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={profileForm.companyName}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={profileForm.contactPerson}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={profileForm.website}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Industry
                                    </label>
                                    <input
                                        type="text"
                                        name="industry"
                                        value={profileForm.industry}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><FiLoader className="animate-spin mr-2" /> Saving...</>
                                    ) : (
                                        <>
                                            <FiSave className="mr-2" />
                                            Save Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Password */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordSubmit}>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
                            <p className="text-gray-600 mb-2">Update your password to maintain account security.</p>


                            <div className="space-y-4 max-w-md mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        minLength={8}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {passwordForm.newPassword && passwordForm.confirmPassword &&
                                    passwordForm.newPassword !== passwordForm.confirmPassword && (
                                        <div className="flex items-center text-red-600 text-sm">
                                            <FiAlertCircle className="mr-1" />
                                            <span>Passwords don't match</span>
                                        </div>
                                    )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                                    disabled={loading ||
                                        (passwordForm.newPassword !== passwordForm.confirmPassword) ||
                                        (passwordForm.newPassword.length > 0 && passwordForm.newPassword.length < 8)}
                                >
                                    {loading ? (
                                        <><FiLoader className="animate-spin mr-2" /> Updating...</>
                                    ) : (
                                        <>
                                            <FiSave className="mr-2" />
                                            Update Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountSettings; 