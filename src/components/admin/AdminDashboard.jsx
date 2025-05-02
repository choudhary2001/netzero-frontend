import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaCheckCircle, FaClock, FaChartLine, FaChartPie, FaUsers, FaUserPlus } from 'react-icons/fa';
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

// Dummy Data
const summaryData = {
    totalCompanies: 58,
    pendingApprovals: 5,
    recentSubmissions: 12,
    totalUsers: 12,
};

const submissionsData = [
    { name: 'Jan', submissions: 4 },
    { name: 'Feb', submissions: 8 },
    { name: 'Mar', submissions: 5 },
    { name: 'Apr', submissions: 11 },
    { name: 'May', submissions: 9 },
    { name: 'Jun', submissions: 15 },
    { name: 'Jul', submissions: 12 },
];

const categoryData = [
    { name: 'Environment', value: 400 },
    { name: 'Social', value: 300 },
    { name: 'Governance', value: 300 },
    { name: 'Company Info', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Dummy recent activity data
const recentActivities = [
    { id: 1, user: 'supplier@example.com', action: 'submitted Environment data.', time: '2 hours ago' },
    { id: 2, user: 'company.user@netzero.com', action: 'updated Company Info.', time: '5 hours ago' },
    { id: 3, user: 'admin@gmail.com', action: 'approved Supplier registration.', time: '1 day ago' },
    { id: 4, user: 'supplier.manager@ecocorp.com', action: 'submitted Social metrics.', time: '2 days ago' },
    { id: 5, user: 'compliance.officer@green.com', action: 'requested data clarification.', time: '3 days ago' },
];

const AdminDashboard = () => {
    return (
        <div className='container'>
            <div className='container'>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <DashboardCard
                        icon={<FaBuilding className="text-blue-500" size={24} />}
                        title="Total Companies"
                        value={summaryData.totalCompanies}
                        bgColor="bg-blue-50"
                    />
                    <DashboardCard
                        icon={<FaClock className="text-yellow-500" size={24} />}
                        title="Pending Approvals"
                        value={summaryData.pendingApprovals}
                        bgColor="bg-yellow-50"
                    />
                    <DashboardCard
                        icon={<FaCheckCircle className="text-green-500" size={24} />}
                        title="Recent Submissions (Month)"
                        value={summaryData.recentSubmissions}
                        bgColor="bg-green-50"
                    />
                    <DashboardCard
                        icon={<FaUsers className="text-purple-500" size={24} />}
                        title="Total Users"
                        value={summaryData.totalUsers}
                        bgColor="bg-purple-50"
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
                            <LineChart data={submissionsData}>
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
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
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
                        <Link to="/admin/users" className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center">
                            Manage Users <FaUsers className="ml-1" />
                        </Link>
                    </div>
                    {/* List of Activities */}
                    <div className="space-y-3">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="border-t pt-3 text-sm text-gray-600 flex justify-between items-center">
                                <div>
                                    <span className="font-medium text-gray-800">{activity.user}</span> {activity.action}
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap pl-2">{activity.time}</span>
                            </div>
                        ))}
                        {/* Placeholder if no activities */}
                        {recentActivities.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No recent activity to display.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper component for dashboard cards
const DashboardCard = ({ icon, title, value, bgColor }) => (
    <div className={`p-6 rounded-lg shadow-md flex items-center space-x-4 ${bgColor}`}>
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