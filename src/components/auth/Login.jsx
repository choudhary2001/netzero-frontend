import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../../store/authSlice';
import authService from '../../services/authService';
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';
import { FaBars, FaTimes, FaLeaf } from 'react-icons/fa';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { loading, error } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!credentials.username.trim()) {
            newErrors.username = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(credentials.username)) {
            newErrors.username = 'Please enter a valid email';
        }

        if (!credentials.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!validateForm()) return;

        try {
            const data = await authService.login(credentials);
            dispatch(login(data));
            // window.location.reload();
            if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (data.user.role === 'supplier') {
                navigate('/supplier/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            setErrors({
                general: error.message || 'Invalid credentials. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <a href="/" className="text-center mb-16 pb-16">
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
                    </motion.div> */}
                    {/* <motion.h2
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
                        <h1 className="text-white text-3xl font-bold">Welcome Back</h1>
                        <p className="text-green-100 mt-2">Sign in to your account</p>
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="username"
                                        value={credentials.username}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={credentials.password}
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

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                                        Forgot password?
                                    </Link>
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
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>



                    {/* Footer */}
                    {/* <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500">
                            Made with ❤️ by{' '}
                            <a
                                href="https://swastik.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-green-600 hover:text-green-800"
                            >
                                Shwastik Tech Solutions Pvt Ltd
                            </a>
                        </p>
                    </div> */}
                </motion.div>
            </div>
        </div>
    );
};

export default Login; 