import React from 'react';

import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Dummy Data
const dummyUsers = [
    { id: 1, email: 'admin@gmail.com', role: 'admin', joined: '2024-01-10' },
    { id: 2, email: 'supplier.manager@ecocorp.com', role: 'supplier', joined: '2024-03-22' },
    { id: 3, email: 'compliance.officer@green.com', role: 'company', joined: '2024-05-01' },
    { id: 4, email: 'admin2@test.com', role: 'admin', joined: '2024-07-15' },
    { id: 5, email: 'supplier.contact@sustainable.org', role: 'supplier', joined: '2024-06-30' },
];

const UserManagement = () => {
    return (
        <div className='container'>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">Manage system users (Admins, Suppliers, Companies).</p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
                        <FaPlus className="mr-2" /> Add New User
                    </button>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dummyUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'supplier' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} {/* Capitalize role */}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900" title="Edit User"><FaEdit /></button>
                                        <button className="text-red-600 hover:text-red-900" title="Delete User"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement; 