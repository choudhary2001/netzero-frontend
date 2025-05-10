import React from 'react';
import { FiBarChart2, FiTrendingUp, FiClock } from 'react-icons/fi';

const KPIDashboard = () => {
    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">KPI Dashboard</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <FiBarChart2 className="text-green-600 text-4xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
                    <p className="text-lg text-gray-600 text-center mb-6 max-w-lg">
                        We're working on an advanced KPI dashboard to help you track your sustainability performance metrics.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-2" />
                        <span>Expected launch: Q2 2024</span>
                    </div>
                </div>
            </div>

            {/* Preview of what's coming */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-800">Environmental Score</h3>
                        <div className="bg-green-100 text-green-800 rounded-full h-10 w-10 flex items-center justify-center">
                            <FiTrendingUp />
                        </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-2">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Preview Data</span>
                        <span className="font-medium">75%</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-800">Social Score</h3>
                        <div className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center">
                            <FiTrendingUp />
                        </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-2">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Preview Data</span>
                        <span className="font-medium">68%</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-800">Governance Score</h3>
                        <div className="bg-purple-100 text-purple-800 rounded-full h-10 w-10 flex items-center justify-center">
                            <FiTrendingUp />
                        </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-2">
                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Preview Data</span>
                        <span className="font-medium">82%</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Features Coming to KPI Dashboard</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <li className="flex items-start">
                        <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2">
                            <span className="text-sm">✓</span>
                        </div>
                        <span>Real-time sustainability metrics tracking</span>
                    </li>
                    <li className="flex items-start">
                        <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2">
                            <span className="text-sm">✓</span>
                        </div>
                        <span>Comparison with industry benchmarks</span>
                    </li>
                    <li className="flex items-start">
                        <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2">
                            <span className="text-sm">✓</span>
                        </div>
                        <span>Progress tracking over time</span>
                    </li>
                    <li className="flex items-start">
                        <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2">
                            <span className="text-sm">✓</span>
                        </div>
                        <span>Custom goal setting and notifications</span>
                    </li>
                    <li className="flex items-start">
                        <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2">
                            <span className="text-sm">✓</span>
                        </div>
                        <span>Automated reporting tools</span>
                    </li>
                    <li className="flex items-start">
                        <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2">
                            <span className="text-sm">✓</span>
                        </div>
                        <span>Recommendation engine for improvements</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default KPIDashboard; 