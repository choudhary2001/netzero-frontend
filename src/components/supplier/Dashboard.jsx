import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiBook,
    FiCalendar,
    FiClock,
    FiTrendingUp,
    FiAlertCircle,
    FiCheckCircle,
    FiBarChart2,
    FiBookOpen,
    FiAward,
    FiFileText,
    FiUsers,
    FiBell,
    FiUmbrella,
    FiInfo,
    FiLoader,
    FiAlertTriangle
} from 'react-icons/fi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAuth } from '../../contexts/AuthContext';
import esgService from '../../services/esgService';

const StatCard = ({ title, value, icon: Icon, color, trend, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-md p-6"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h3 className="text-2xl font-bold mt-2">{value}</h3>
                {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
            </div>
            <div className={`p-3 rounded-full bg-${color}-100`}>
                <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center">
                <FiTrendingUp className={`w-4 h-4 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`ml-1 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(trend)}% {trend >= 0 ? 'increase' : 'decrease'}
                </span>
            </div>
        )}
    </motion.div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        esgScores: {
            environmental: 0,
            social: 0,
            quality: 0,
            overall: 0,
            governance: 0
        },
        formCompletion: {
            company: 0,
            environmental: 0,
            social: 0,
            quality: 0,
            governance: 0
        },
        recentUpdates: [],
        status: 'draft'
    });

    // Upcoming deadlines - this could also come from the backend in future
    const upcomingDeadlines = [
        { id: 1, title: 'Quarterly ESG Report', date: '15 Jun 2024', priority: 'High' },
        { id: 2, title: 'Sustainability Audit', date: '30 Jun 2024', priority: 'Medium' },
        { id: 3, title: 'Governance Review Meeting', date: '10 Jul 2024', priority: 'Low' }
    ];

    // Fetch dashboard data from the backend
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await esgService.getDashboardData();

                if (response.success && response.data) {
                    setDashboardData(response.data);
                } else {
                    console.error('Error fetching dashboard data:', response.message);
                    setError(response.message || 'Failed to load dashboard data');
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
            case 'Reviewed':
                return <FiCheckCircle className="text-green-500" />;
            case 'Pending':
                return <FiClock className="text-orange-500" />;
            case 'In Progress':
                return <FiBarChart2 className="text-blue-500" />;
            case 'Submitted':
                return <FiFileText className="text-blue-500" />;
            case 'Approved':
                return <FiAward className="text-green-600" />;
            case 'Rejected':
                return <FiAlertTriangle className="text-red-500" />;
            default:
                return <FiInfo className="text-gray-500" />;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'environment':
                return <FiUmbrella className="text-green-500" />;
            case 'social':
                return <FiUsers className="text-blue-500" />;
            case 'quality':
                return <FiCheckCircle className="text-purple-500" />;
            case 'company':
                return <FiBook className="text-orange-500" />;
            case 'status':
                return <FiFileText className="text-gray-500" />;
            default:
                return <FiInfo className="text-gray-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-800';
            case 'Medium':
                return 'bg-orange-100 text-orange-800';
            case 'Low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Donut chart component
    const DonutChart = ({ percentage, color, size = 120, strokeWidth = 8 }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        // Convert score from 0-1 to percentage (0-100)
        const scorePercentage = Math.round(percentage * 100);
        const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

        return (
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{scorePercentage}%</span>
                </div>
            </div>
        );
    };

    // Show loading state
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6 flex justify-center items-center h-64">
                <FiLoader className="animate-spin text-green-600 text-3xl mr-2" />
                <p className="text-gray-600">Loading dashboard data...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-red-50 border border-red-300 rounded-md p-4 mb-6">
                    <div className="flex items-center">
                        <FiAlertCircle className="text-red-500 mr-2" />
                        <h2 className="text-red-700 font-medium">Error loading dashboard data</h2>
                    </div>
                    <p className="text-red-600 mt-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 bg-red-100 px-4 py-2 rounded-md text-red-700 hover:bg-red-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { esgScores, formCompletion, recentUpdates, status } = dashboardData;

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {/* Welcome back, {user?.name || user?.role || 'Supplier'}! ({user?.role}) */}
                    Welcome back, Value Chain Partner!
                </h1>
                <p className="text-gray-600">
                    Here's an overview of your ESG performance and upcoming deadlines.
                </p>
            </div>

            {/* Status bar if submission is in progress */}
            {status && status !== 'draft' && (
                <div className={`mb-6 p-4 rounded-md ${status === 'submitted' ? 'bg-blue-50 border border-blue-200' :
                    status === 'approved' ? 'bg-green-50 border border-green-200' :
                        status === 'rejected' ? 'bg-red-50 border border-red-200' :
                            'bg-gray-50 border border-gray-200'
                    }`}>
                    <div className="flex items-center">
                        {status === 'submitted' && <FiClock className="text-blue-500 mr-2" />}
                        {status === 'approved' && <FiCheckCircle className="text-green-500 mr-2" />}
                        {status === 'rejected' && <FiAlertCircle className="text-red-500 mr-2" />}
                        <p className={`font-medium ${status === 'submitted' ? 'text-blue-700' :
                            status === 'approved' ? 'text-green-700' :
                                status === 'rejected' ? 'text-red-700' :
                                    'text-gray-700'
                            }`}>
                            Your ESG submission is {status}
                        </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        {status === 'submitted' && 'Your data is currently under review by our team.'}
                        {status === 'approved' && 'Congratulations! Your ESG data has been approved.'}
                        {status === 'rejected' && 'Your submission needs some changes. Please review the feedback.'}
                    </p>
                </div>
            )}

            {/* Form Completion Progress */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium text-gray-700 mb-2">Company Info</h3>
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div style={{ width: `${formCompletion.company}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500 transition-all duration-500"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{formCompletion.company}% Complete</span>
                            <Link to="/supplier/company-info" className="text-orange-600 hover:underline">Update</Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium text-gray-700 mb-2">Environment</h3>
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div style={{ width: `${formCompletion.environmental}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{formCompletion.environmental}% Complete</span>
                            <Link to="/supplier/environment" className="text-green-600 hover:underline">Update</Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium text-gray-700 mb-2">Social</h3>
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div style={{ width: `${formCompletion.social}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{formCompletion.social}% Complete</span>
                            <Link to="/supplier/social" className="text-blue-600 hover:underline">Update</Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium text-gray-700 mb-2">Quality</h3>
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div style={{ width: `${formCompletion.quality}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{formCompletion.quality}% Complete</span>
                            <Link to="/supplier/quality" className="text-purple-600 hover:underline">Update</Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium text-gray-700 mb-2">Governance</h3>
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div style={{ width: `${formCompletion.governance}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{formCompletion.governance}% Complete</span>
                            <Link to="/supplier/governance" className="text-indigo-600 hover:underline">Update</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ESG Scores Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <h3 className="font-medium text-gray-500 mb-2">Overall ESG Score</h3>
                    <DonutChart
                        percentage={esgScores.overall}
                        color="#10B981"
                        size={140}
                    />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Your overall sustainability rating</p>
                        <p className="text-xs text-gray-400 mt-1">Score range: 0-1</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <h3 className="font-medium text-gray-500 mb-2">Environment</h3>
                    <DonutChart
                        percentage={esgScores.environmental}
                        color="#047857"
                        size={140}
                    />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Carbon footprint & sustainability</p>
                        <p className="text-xs text-gray-400 mt-1">Score range: 0-1</p>
                    </div>
                    <div className="mt-auto pt-4">
                        <Link to="/supplier/environment?view=true" className="text-green-600 hover:text-green-800 text-sm font-medium">
                            View Details →
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <h3 className="font-medium text-gray-500 mb-2">Social</h3>
                    <DonutChart
                        percentage={esgScores.social}
                        color="#3B82F6"
                        size={140}
                    />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Workplace & community impact</p>
                        <p className="text-xs text-gray-400 mt-1">Score range: 0-1</p>
                    </div>
                    <div className="mt-auto pt-4">
                        <Link to="/supplier/social?view=true" className="text-green-600 hover:text-green-800 text-sm font-medium">
                            View Details →
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <h3 className="font-medium text-gray-500 mb-2">Quality</h3>
                    <DonutChart
                        percentage={esgScores.quality}
                        color="#8B5CF6"
                        size={140}
                    />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Quality & process management</p>
                        <p className="text-xs text-gray-400 mt-1">Score range: 0-1</p>
                    </div>
                    <div className="mt-auto pt-4">
                        <Link to="/supplier/quality?view=true" className="text-green-600 hover:text-green-800 text-sm font-medium">
                            View Details →
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <h3 className="font-medium text-gray-500 mb-2">Governance</h3>
                    <DonutChart
                        percentage={esgScores.governance}
                        color="#4F46E5"
                        size={140}
                    />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Governance & compliance</p>
                        <p className="text-xs text-gray-400 mt-1">Score range: 0-1</p>
                    </div>
                    <div className="mt-auto pt-4">
                        <Link to="/supplier/governance?view=true" className="text-green-600 hover:text-green-800 text-sm font-medium">
                            View Details →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Updates */}
                <div className="bg-white rounded-lg shadow lg:col-span-2">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Updates</h2>
                        {recentUpdates && recentUpdates.length > 0 ? (
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Update
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentUpdates.map((update) => (
                                            <tr key={update.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                                                            {getTypeIcon(update.type)}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{update.title}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{update.date}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {getStatusIcon(update.status)}
                                                        <span className="ml-2 text-sm font-medium text-gray-900">
                                                            {update.status}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                <FiInfo className="mx-auto text-gray-400 text-3xl mb-2" />
                                <p>No recent updates available</p>
                                <p className="text-sm mt-2">Start filling out your ESG forms to see updates here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Deadlines</h2>
                        <div className="space-y-4">
                            {upcomingDeadlines.map((deadline) => (
                                <div key={deadline.id} className="flex items-start">
                                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-green-400 mt-1"></div>
                                    <div className="ml-3">
                                        <div className="flex items-center">
                                            <h3 className="text-sm font-medium text-gray-900">{deadline.title}</h3>
                                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getPriorityColor(deadline.priority)}`}>
                                                {deadline.priority}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                            <FiCalendar className="mr-1" />
                                            <span>{deadline.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 