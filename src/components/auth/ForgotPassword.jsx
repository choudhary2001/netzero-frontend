import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import authService from '../../services/authService';
import { FaLeaf } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState('request'); // 'request', 'verify', 'reset'
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            // Check if authService.requestPasswordReset exists
            if (typeof authService.requestPasswordReset !== 'function') {
                throw new Error('Password reset functionality is not available');
            }

            await authService.requestPasswordReset(email);
            setSuccess('OTP has been sent to your email address');
            setStep('verify');
        } catch (err) {
            console.error('Request OTP error:', err);
            setError(
                err.response?.data?.detail ||
                err.message ||
                'Failed to send OTP. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp.trim()) {
            setError('Please enter the OTP sent to your email');
            return;
        }

        setLoading(true);
        try {
            await authService.verifyOTP(email, otp);
            setSuccess('OTP verified successfully');
            setStep('reset');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (!newPassword.trim()) {
            setError('Please enter a new password');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(email, otp, newPassword);
            setSuccess('Password has been reset successfully');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderRequestForm = () => (
        <form onSubmit={handleRequestOTP} className="space-y-6">
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending OTP...
                    </>
                ) : (
                    'Send OTP'
                )}
            </button>
        </form>
    );

    const renderVerifyForm = () => (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Enter OTP</label>
                <div className="relative">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        required
                    />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    We've sent a 6-digit OTP to {email}
                </p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                    </>
                ) : (
                    'Verify OTP'
                )}
            </button>

            <div className="flex justify-between items-center">
                <button
                    type="button"
                    onClick={() => setStep('request')}
                    className="text-sm text-green-600 hover:text-green-500 flex items-center"
                >
                    <FiArrowLeft className="mr-1" /> Back
                </button>

                <button
                    type="button"
                    onClick={handleRequestOTP}
                    className="text-sm text-green-600 hover:text-green-500"
                >
                    Resend OTP
                </button>
            </div>
        </form>
    );

    const renderResetForm = () => (
        <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter new password"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting Password...
                    </>
                ) : (
                    'Reset Password'
                )}
            </button>
        </form>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    {/* <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src="https://dmch.swastik.ai/media/img/dmc-logo.webp"
                            alt="DMC Logo"
                            className="mx-auto h-24 mb-4 rounded-lg"
                        />
                    </motion.div>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-2xl font-bold text-gray-800"
                    >
                        Attendance Management System
                    </motion.h2> */}
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-2xl font-bold text-gray-800"
                    >
                        <Link to="/" className="flex items-center justify-center">
                            <FaLeaf className={`text-2xl mr-2 text-green-600`} />
                            <span className={`font-bold text-xl text-gray-800`}>Net Zero Journey</span>
                        </Link>
                    </motion.h2>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-center">
                        <h1 className="text-white text-2xl font-bold">
                            {step === 'request' && 'Forgot Password'}
                            {step === 'verify' && 'Verify OTP'}
                            {step === 'reset' && 'Reset Password'}
                        </h1>
                        <p className="text-green-100 mt-2">
                            {step === 'request' && 'Enter your email to receive a verification code'}
                            {step === 'verify' && 'Enter the OTP sent to your email'}
                            {step === 'reset' && 'Create a new password for your account'}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center"
                            >
                                <FiAlertCircle className="h-5 w-5 mr-2" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center"
                            >
                                <FiCheckCircle className="h-5 w-5 mr-2" />
                                <span>{success}</span>
                            </motion.div>
                        )}

                        {step === 'request' && renderRequestForm()}
                        {step === 'verify' && renderVerifyForm()}
                        {step === 'reset' && renderResetForm()}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            Remember your password?{' '}
                            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword; 