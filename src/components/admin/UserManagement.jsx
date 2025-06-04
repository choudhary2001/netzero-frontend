import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedUser, setSelectedUser] = useState(null);
    const [filters, setFilters] = useState(() => {
        const searchParams = new URLSearchParams(location.search);
        const type = searchParams.get('type');
        return {
            role: type === 'company' ? 'company' : 'all',
            status: 'all',
            search: ''
        };
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'supplier',
        isActive: true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const type = searchParams.get('type');
        if (type === 'company') {
            setFilters(prev => ({
                ...prev,
                role: 'company'
            }));
        }
    }, [location.search]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllUsers();
            if (response.success) {
                setUsers(response.data);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = () => {
        setModalMode('add');
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'supplier',
            isActive: true
        });
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            password: '', // Don't populate password for security
            role: user.role || 'supplier',
            isActive: user.isActive !== false // Default to true if not specified
        });
        setShowModal(true);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                setLoading(true);
                const response = await adminService.deleteUser(userId);
                if (response.success) {
                    toast.success('User deleted successfully');
                    fetchUsers();
                } else {
                    toast.error(response.message || 'Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Error deleting user');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            let response;
            if (modalMode === 'add') {
                response = await adminService.createUser(formData);
            } else {
                response = await adminService.updateUser(selectedUser._id, formData);
            }

            if (response.success) {
                toast.success(modalMode === 'add' ? 'User created successfully' : 'User updated successfully');
                setShowModal(false);
                fetchUsers();
            } else {
                toast.error(response.message || `Failed to ${modalMode === 'add' ? 'create' : 'update'} user`);
            }
        } catch (error) {
            console.error(`Error ${modalMode === 'add' ? 'creating' : 'updating'} user:`, error);
            toast.error(`Error ${modalMode === 'add' ? 'creating' : 'updating'} user`);
        } finally {
            setLoading(false);
        }
    };

    // Calculate user counts by role
    const totalUsers = users.length;
    const adminCount = users.filter(user => user.role === 'admin').length;
    const supplierCount = users.filter(user => user.role === 'supplier').length;
    const companyCount = users.filter(user => user.role === 'company').length;

    // Add filter handling functions
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    // Filter users based on current filters
    const filteredUsers = users.filter(user => {
        const matchesRole = filters.role === 'all' || user.role === filters.role;
        const matchesStatus = filters.status === 'all' ||
            (filters.status === 'active' && user.isActive !== false) ||
            (filters.status === 'inactive' && user.isActive === false);
        const matchesSearch = filters.search === '' ||
            user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
            user.email?.toLowerCase().includes(filters.search.toLowerCase());

        return matchesRole && matchesStatus && matchesSearch;
    });

    return (
        <div className='container mx-auto'>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Management</h1>

            {loading && users.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-green-600 text-4xl" />
                    <p className="ml-2 text-gray-600">Loading users...</p>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">Manage system users (Admins, Suppliers, Companies).</p>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                            onClick={handleAddUser}
                        >
                            <FaPlus className="mr-2" /> Add New User
                        </button>
                    </div>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-100 p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                            <p className="mt-1 text-2xl font-semibold text-gray-900">{totalUsers}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-purple-600">Admin Users</h3>
                            <p className="mt-1 text-2xl font-semibold text-purple-800">{adminCount}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-blue-600">Value Chain Users</h3>
                            <p className="mt-1 text-2xl font-semibold text-blue-800">{supplierCount}</p>
                        </div>
                        {/* <div className="bg-orange-50 p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-orange-600">Company Users</h3>
                            <p className="mt-1 text-2xl font-semibold text-orange-800">{companyCount}</p>
                        </div> */}
                    </div>

                    {/* Filter Controls */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <select
                                name="role"
                                value={filters.role}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="supplier">Value Chain Partner</option>
                                {/* <option value="company">Company</option> */}
                            </select>
                        </div>
                        <div>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-end">
                            <button
                                onClick={() => setFilters({ role: 'all', status: 'all', search: '' })}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center"
                            >
                                <FaFilter className="mr-2" /> Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            {users.length === 0 ? 'No users found' : 'No users match the current filters'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'supplier' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {user.role === 'supplier' ? 'Value Chain Partner' : user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Unknown'} {/* Capitalize role */}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.date ? new Date(user.date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {user.isActive !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit User"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete User"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative mx-auto p-5 border w-full max-w-md bg-white rounded-md shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {modalMode === 'add' ? 'Add New User' : 'Edit User'}
                            </h3>
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => setShowModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                                    Password {modalMode === 'edit' && <span className="text-gray-400 text-xs">(Leave blank to keep current password)</span>}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required={modalMode === 'add'}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="admin">Admin</option>
                                    <option value="supplier">Value Chain Partner</option>
                                    {/* <option value="company">Company</option> */}
                                </select>
                            </div>

                            <div className="mb-4 flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-gray-700 text-sm font-medium" htmlFor="isActive">
                                    Active
                                </label>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                                    disabled={loading}
                                >
                                    {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                                    {modalMode === 'add' ? 'Create User' : 'Update User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement; 