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
    FiInfo
} from 'react-icons/fi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAuth } from '../../contexts/AuthContext';

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
    const [loading, setLoading] = useState(false);

    // Sample data for charts and stats
    const esgScores = {
        environmental: 72,
        social: 65,
        governance: 80,
        overall: 72
    };

    const recentUpdates = [
        { id: 1, title: 'Environmental report updated', date: '2 days ago', status: 'Completed', type: 'environment' },
        { id: 2, title: 'Governance documentation pending', date: '3 days ago', status: 'Pending', type: 'governance' },
        { id: 3, title: 'Social responsibility review', date: '1 week ago', status: 'In Progress', type: 'social' },
        { id: 4, title: 'Carbon footprint assessment', date: '1 week ago', status: 'Completed', type: 'environment' }
    ];

    const upcomingDeadlines = [
        { id: 1, title: 'Quarterly ESG Report', date: '15 Jun 2023', priority: 'High' },
        { id: 2, title: 'Sustainability Audit', date: '30 Jun 2023', priority: 'Medium' },
        { id: 3, title: 'Governance Review Meeting', date: '10 Jul 2023', priority: 'Low' }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <FiCheckCircle className="text-green-500" />;
            case 'Pending':
                return <FiClock className="text-orange-500" />;
            case 'In Progress':
                return <FiBarChart2 className="text-blue-500" />;
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
            case 'governance':
                return <FiBell className="text-purple-500" />;
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
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
                    <span className="text-2xl font-bold">{percentage}%</span>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome back, {user?.first_name || 'Supplier'}!
                </h1>
                <p className="text-gray-600">
                    Here's an overview of your ESG performance and upcoming deadlines.
                </p>
            </div>

            {/* ESG Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <h3 className="font-medium text-gray-500 mb-2">Overall ESG Score</h3>
                    <DonutChart percentage={esgScores.overall} color="#10B981" />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Your overall sustainability rating</p>
                    </div>
                    <div className="mt-auto pt-4">
                        <Link to="/supplier/company-info" className="text-green-600 hover:text-green-800 text-sm font-medium">
                            View Details →
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <h3 className="font-medium text-gray-500 mb-2">Environment</h3>
                    <DonutChart percentage={esgScores.environmental} color="#047857" />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Carbon footprint & sustainability</p>
                    </div>
                    <div className="mt-auto pt-4">
                        <Link to="/supplier/environment" className="text-green-600 hover:text-green-800 text-sm font-medium">
                            View Details →
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <h3 className="font-medium text-gray-500 mb-2">Social</h3>
                    <DonutChart percentage={esgScores.social} color="#3B82F6" />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Workplace & community impact</p>
                    </div>
                    <div className="mt-auto pt-4">
                        <Link to="/supplier/social" className="text-green-600 hover:text-green-800 text-sm font-medium">
                            View Details →
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <h3 className="font-medium text-gray-500 mb-2">Governance</h3>
                    <DonutChart percentage={esgScores.governance} color="#8B5CF6" />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Quality & compliance management</p>
                    </div>
                    <div className="mt-auto pt-4">
                        <Link to="/supplier/governance" className="text-green-600 hover:text-green-800 text-sm font-medium">
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
                                                    <span className="ml-1.5 text-sm text-gray-500">{update.status}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Deadlines</h2>
                        <div className="space-y-4">
                            {upcomingDeadlines.map((deadline) => (
                                <div key={deadline.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                                            <FiCalendar className="text-gray-500" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="text-sm font-medium text-gray-900">{deadline.title}</h3>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                                        deadline.priority
                                                    )}`}
                                                >
                                                    {deadline.priority}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">Due: {deadline.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Link
                                to="#"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                View All Deadlines
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <Link
                    to="/supplier/environment"
                    className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-150 ease-in-out"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-green-100 mb-4">
                            <FiUmbrella className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Update Environmental Data</h3>
                    </div>
                </Link>
                <Link
                    to="/supplier/social"
                    className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-150 ease-in-out"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-blue-100 mb-4">
                            <FiUsers className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Update Social Data</h3>
                    </div>
                </Link>
                <Link
                    to="/supplier/governance"
                    className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-150 ease-in-out"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-purple-100 mb-4">
                            <FiBell className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Update Governance Data</h3>
                    </div>
                </Link>
                <Link
                    to="/supplier/help-support"
                    className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-150 ease-in-out"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-gray-100 mb-4">
                            <FiInfo className="h-6 w-6 text-gray-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Help & Support</h3>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard; 