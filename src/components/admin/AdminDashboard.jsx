import React from 'react';
import { FaBuilding, FaCheckCircle, FaClock, FaChartLine, FaChartPie, FaUsers } from 'react-icons/fa';
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

const AdminDashboard = () => {
    return (
        <div className='container'>
            <div className='container'>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

                {/* Placeholder for recent activity or user list */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <FaUsers className="mr-2 text-purple-500" /> Recent Activity / Users
                    </h2>
                    <p className="text-gray-600">List of recent activities or user overview will go here...</p>
                    {/* Example item */}
                    <div className="border-t mt-4 pt-2 text-sm text-gray-500">
                        <span>User 'supplier@example.com' submitted Environment data.</span>
                        <span className="float-right">2 hours ago</span>
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