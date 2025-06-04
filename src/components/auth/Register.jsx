import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBuilding, FaTruck, FaGoogle } from 'react-icons/fa';
import { FiUser, FiLock, FiAlertCircle, FiMail } from 'react-icons/fi';
import authService from '../../services/authService';
import { FaLeaf } from 'react-icons/fa';

const Register = () => {
    const [step, setStep] = useState('register'); // 'register' or 'verify'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'supplier'
    });
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register({
                ...formData,
                name: formData.name
            });

            console.log('Registration response:', response);

            // Check if the response contains the OTP success message
            if (response.msg === "OTP sent successfully" || response.success) {
                setStep('verify');
            } else {
                setErrors({
                    general: response.message || 'Registration failed. Please try again.'
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({
                general: error.message || 'Registration failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!otp.trim()) {
            setErrors({ otp: 'Please enter the OTP' });
            setLoading(false);
            return;
        }

        try {
            const response = await authService.verifyOTP(otp, {
                email: formData.email,
                password: formData.password,
                role: formData.role,
                name: `${formData.name}`
            });
            console.log(response);
            if (response.success || response.msg === "User registered successfully") {
                navigate('/login');
            } else {
                setErrors({
                    general: response.message || 'OTP verification failed. Please try again.'
                });
            }
        } catch (error) {
            setErrors({
                general: error.message || 'OTP verification failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const renderRegisterForm = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        {formData.role === 'company' ? 'Company Name' : 'Value Chain Partner Name'}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                            placeholder={formData.role === 'company' ? 'Enter Company Name' : 'Enter Value Chain Partner Name'}
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                            {formData.role === 'company' ? 'Company name is required' : 'Value Chain Partner name is required'}
                        </p>
                    )}
                </div>
            </div>

            {/* Email Field */}
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                        placeholder="your.email@example.com"
                    />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            {/* Password Fields */}
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <span className="text-sm text-gray-500 hover:text-gray-700">
                            {showPassword ? 'Hide' : 'Show'}
                        </span>
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                        placeholder="••••••••"
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
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
                        Creating account...
                    </>
                ) : (
                    'Create Account'
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
                        className={`w-full px-4 py-3 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-lg tracking-widest`}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                    />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    We've sent a 6-digit OTP to {formData.email}
                </p>
                {errors.otp && (
                    <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                )}
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
                    onClick={() => setStep('register')}
                    className="text-sm text-green-600 hover:text-green-500"
                >
                    Back to Registration
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-sm text-green-600 hover:text-green-500"
                >
                    Resend OTP
                </button>
            </div>
        </form>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <a href="/" className="text-center mb-8">
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
                </a>
                <div className="text-center mb-8"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-center">
                        <h1 className="text-white text-3xl font-bold">
                            {step === 'register' ? 'Create Account' : 'Verify Email'}
                        </h1>
                        <p className="text-green-100 mt-2">
                            {step === 'register'
                                ? 'Join NetZero to start your sustainability journey'
                                : 'Enter the OTP sent to your email to verify your account'
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {errors.general && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center"
                            >
                                <FiAlertCircle className="h-5 w-5 mr-2" />
                                <span>{errors.general}</span>
                            </motion.div>
                        )}

                        {/* Role Selection */}
                        {step === 'register' && (
                            <div className="mb-6 flex space-x-4">
                                {/* <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'company' })}
                                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all duration-200 ${formData.role === 'company'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-green-300'
                                        }`}
                                >
                                    <FaBuilding className="mr-2" />
                                    <span className="font-medium">Company</span>
                                </button> */}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'supplier' })}
                                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all duration-200 ${formData.role === 'supplier'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-green-300'
                                        }`}
                                >
                                    <FaTruck className="mr-2" />
                                    <span className="font-medium">Value Chain Partner</span>
                                </button>
                            </div>
                        )}

                        {step === 'register' ? renderRegisterForm() : renderVerifyForm()}

                        {step === 'register' && (
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register; 