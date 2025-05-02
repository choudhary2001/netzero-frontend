import React from 'react';

import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';

// Dummy Data
const dummyEnvSubmissions = [
    { id: 1, companyName: 'Eco Corp', reportType: 'GHG Emissions Q2', submitted: '2024-07-10', status: 'Pending' },
    { id: 2, companyName: 'Green Solutions Ltd.', reportType: 'Water Usage Report', submitted: '2024-07-09', status: 'Approved' },
    { id: 3, companyName: 'Sustainable Inc.', reportType: 'Waste Management Audit', submitted: '2024-07-08', status: 'Approved' },
    { id: 4, companyName: 'Planet Protectors', reportType: 'Energy Consumption H1', submitted: '2024-07-05', status: 'Rejected' },
];

const EnvironmentManagement = () => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className='container'>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Environmental Data Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <p className="text-gray-600 mb-4">Review and manage submitted environmental data reports.</p>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dummyEnvSubmissions.map((submission) => (
                            <tr key={submission.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.companyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.reportType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.submitted}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(submission.status)}`}>
                                        {submission.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button className="text-indigo-600 hover:text-indigo-900" title="View Details"><FaEye /></button>
                                    {submission.status === 'Pending' && (
                                        <>
                                            <button className="text-green-600 hover:text-green-900" title="Approve"><FaCheck /></button>
                                            <button className="text-red-600 hover:text-red-900" title="Reject"><FaTimes /></button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnvironmentManagement; 