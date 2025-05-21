import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBuilding, FaCheckCircle, FaClock, FaChartLine, FaChartPie, FaUsers, FaUserPlus, FaSpinner } from 'react-icons/fa';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        userCounts: {
            total: 0,
            admin: 0,
            supplier: 0,
            company: 0
        },
        pendingApprovals: 0,
        recentSubmissions: 0,
        submissionTrend: [],
        categoryDistribution: [],
        recentActivities: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getDashboardSummary();
            console.log('response', response);
            if (response.success) {
                setDashboardData(response.data);
            } else {
                toast.error('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Error loading dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (route) => {
        navigate(route);
    };

    // Show loading state
    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-green-600 text-4xl" />
                    <p className="ml-2 text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='container'>
            <div className='container mx-auto p-4'>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <DashboardCard
                        icon={<FaBuilding className="text-blue-500" size={24} />}
                        title="Total Companies"
                        value={dashboardData.userCounts.company}
                        bgColor="bg-blue-50"
                        onClick={() => handleCardClick('/admin/user-management?type=company')}
                    />
                    <DashboardCard
                        icon={<FaClock className="text-yellow-500" size={24} />}
                        title="Pending Approvals"
                        value={dashboardData.pendingApprovals}
                        bgColor="bg-yellow-50"
                        onClick={() => handleCardClick('/admin/company-info?status=pending')}
                    />
                    <DashboardCard
                        icon={<FaCheckCircle className="text-green-500" size={24} />}
                        title="Recent Submissions (Month)"
                        value={dashboardData.recentSubmissions}
                        bgColor="bg-green-50"
                        onClick={() => handleCardClick('/admin/company-info?type=month')}
                    />
                    <DashboardCard
                        icon={<FaUsers className="text-purple-500" size={24} />}
                        title="Total Users"
                        value={dashboardData.userCounts.total}
                        bgColor="bg-purple-50"
                        onClick={() => handleCardClick('/admin/user-management')}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Submissions Trend Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaChartLine className="mr-2 text-indigo-500" /> Submissions Trend (Last 6 Months)
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dashboardData.submissionTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="submissions" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Distribution Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaChartPie className="mr-2 text-pink-500" /> Submission Distribution by Category
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={dashboardData.categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {dashboardData.categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent activity section */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                            <FaClock className="mr-2 text-gray-500" /> Recent Activity
                        </h2>
                        {/* Link to User Management */}
                        <Link to="/admin/user-management" className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center">
                            Manage Users <FaUsers className="ml-1" />
                        </Link>
                    </div>
                    {/* List of Activities */}
                    <div className="space-y-3">
                        {dashboardData.recentActivities.length > 0 ? dashboardData.recentActivities.map((activity) => (
                            <div key={activity.id} className="border-t pt-3 text-sm text-gray-600 flex justify-between items-center">
                                <div>
                                    <span className="font-medium text-gray-800">{activity.user}</span> {activity.action}
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap pl-2">{activity.time}</span>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No recent activity to display.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper component for dashboard cards
const DashboardCard = ({ icon, title, value, bgColor, onClick }) => (
    <div
        className={`p-6 rounded-lg shadow-md flex items-center space-x-4 ${bgColor} cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
        onClick={onClick}
    >
        <div className="p-3 rounded-full bg-white">
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;