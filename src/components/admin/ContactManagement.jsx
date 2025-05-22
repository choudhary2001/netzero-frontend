import React, { useState, useEffect } from 'react';

import {
    FaEnvelope,
    FaCheck,
    FaSpinner,
    FaTrash,
    FaEye,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationCircle,
    FaFilter,
    FaSort,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';

import adminService from '../../services/adminService';

const ContactManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        inProgress: 0,
        resolved: 0,
        unread: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
    const [statusFilter, setStatusFilter] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0
    });
    const [adminNotes, setAdminNotes] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchContacts = async () => {
        setLoading(true);
        setError(null);
        try {
            // Create query parameters object
            const params = {
                page,
                limit,
                sort,
                order
            };

            // Only add status filter if it has a value
            if (statusFilter && statusFilter.trim() !== '') {
                params.status = statusFilter.trim();
            }

            console.log('Sending filter params to API:', params);

            const response = await adminService.getAllContacts(params);
            console.log('Response from API:', response);

            if (response.success) {
                setContacts(response.contacts);
                setPagination(response.pagination);
            } else {
                setError(response.message || 'Failed to fetch contacts');
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching contacts:', err);
            setError(err.message || 'Failed to fetch contacts');
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {

            const response = await adminService.getContactStats();

            setStats(response.stats);
        } catch (err) {
            console.error('Error fetching contact stats:', err);
        }
    };

    const fetchContactDetails = async (id) => {
        setLoading(true);
        setError(null);
        try {

            const response = await adminService.getContactById(id);

            setSelectedContact(response.contact);
            setAdminNotes(response.contact.adminNotes || '');
            setViewMode('detail');
            setLoading(false);
        } catch (err) {
            console.error('Error fetching contact details:', err);
            setError(err.response?.message || 'Failed to fetch contact details');
            setLoading(false);
        }
    };

    const updateContactStatus = async (status) => {
        setUpdatingStatus(true);
        try {


            await adminService.updateContact(selectedContact._id, {
                status,
                adminNotes
            });

            setSelectedContact({
                ...selectedContact,
                status,
                adminNotes
            });

            // Refresh contact list and stats
            fetchContacts();
            fetchStats();
            setUpdatingStatus(false);
        } catch (err) {
            console.error('Error updating contact status:', err);
            setError(err.response?.message || 'Failed to update contact status');
            setUpdatingStatus(false);
        }
    };

    const deleteContact = async (id) => {
        if (!window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {

            await adminService.deleteContact(id);

            // If we're in detail view, go back to list
            if (viewMode === 'detail' && selectedContact._id === id) {
                setViewMode('list');
                setSelectedContact(null);
            }

            // Refresh contact list and stats
            fetchContacts();
            fetchStats();
        } catch (err) {
            console.error('Error deleting contact:', err);
            setError(err.response?.message || 'Failed to delete contact');
            setLoading(false);
        }
    };

    const handleSortChange = (field) => {
        if (sort === field) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSort(field);
            setOrder('desc');
        }
        setPage(1); // Reset to first page on sort change
    };

    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1); // Reset to first page on filter change
    };

    const goToPage = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPage(newPage);
        }
    };

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Load contacts and stats on component mount and when dependencies change
    useEffect(() => {
        fetchContacts();
    }, [page, limit, sort, order, statusFilter]);

    useEffect(() => {
        fetchStats();
    }, []);

    // Render status badge with appropriate color
    const StatusBadge = ({ status }) => {
        let bgColor = 'bg-gray-100 text-gray-800';

        if (status === 'new') {
            bgColor = 'bg-blue-100 text-blue-800';
        } else if (status === 'in-progress') {
            bgColor = 'bg-yellow-100 text-yellow-800';
        } else if (status === 'resolved') {
            bgColor = 'bg-green-100 text-green-800';
        }

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-6">Contact Management</h1>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500 mb-1">Total</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500 mb-1">New</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500 mb-1">In Progress</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500 mb-1">Resolved</p>
                        <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500 mb-1">Unread</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.unread}</p>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Filters */}
                        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center">
                                <FaFilter className="text-gray-400 mr-2" />
                                <select
                                    value={statusFilter}
                                    onChange={handleFilterChange}
                                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">All Status</option>
                                    <option value="new">New</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>

                            <div className="text-sm text-gray-500">
                                {pagination.total > 0 ?
                                    `Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, pagination.total)} of ${pagination.total} contacts` :
                                    'No contacts found'}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border-b border-red-100 text-red-700 flex items-center">
                                <FaExclamationCircle className="mr-2" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Contact List */}
                        {loading ? (
                            <div className="p-8 text-center">
                                <FaSpinner className="animate-spin text-green-600 text-2xl mx-auto mb-2" />
                                <p>Loading contacts...</p>
                            </div>
                        ) : contacts.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No contacts found. Adjust your filters or try again later.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <button
                                                    onClick={() => handleSortChange('name')}
                                                    className="flex items-center focus:outline-none"
                                                >
                                                    Name
                                                    {sort === 'name' && (
                                                        order === 'asc' ?
                                                            <FaArrowUp className="ml-1 text-green-600" /> :
                                                            <FaArrowDown className="ml-1 text-green-600" />
                                                    )}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                                <button
                                                    onClick={() => handleSortChange('email')}
                                                    className="flex items-center focus:outline-none"
                                                >
                                                    Email
                                                    {sort === 'email' && (
                                                        order === 'asc' ?
                                                            <FaArrowUp className="ml-1 text-green-600" /> :
                                                            <FaArrowDown className="ml-1 text-green-600" />
                                                    )}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <button
                                                    onClick={() => handleSortChange('subject')}
                                                    className="flex items-center focus:outline-none"
                                                >
                                                    Subject
                                                    {sort === 'subject' && (
                                                        order === 'asc' ?
                                                            <FaArrowUp className="ml-1 text-green-600" /> :
                                                            <FaArrowDown className="ml-1 text-green-600" />
                                                    )}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                                <button
                                                    onClick={() => handleSortChange('createdAt')}
                                                    className="flex items-center focus:outline-none"
                                                >
                                                    Date
                                                    {sort === 'createdAt' && (
                                                        order === 'asc' ?
                                                            <FaArrowUp className="ml-1 text-green-600" /> :
                                                            <FaArrowDown className="ml-1 text-green-600" />
                                                    )}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {contacts.map((contact) => (
                                            <tr key={contact._id} className={!contact.isRead ? 'bg-blue-50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {!contact.isRead && (
                                                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                                        )}
                                                        <div className="font-medium text-gray-900">
                                                            {contact.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                    <div className="text-sm text-gray-500">{contact.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 truncate max-w-xs">
                                                        {contact.subject}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={contact.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                    <div className="text-sm text-gray-500">
                                                        {formatDate(contact.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => fetchContactDetails(contact._id)}
                                                        className="text-green-600 hover:text-green-900 mr-3"
                                                    >
                                                        <FaEye className="inline" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteContact(contact._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <FaTrash className="inline" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                                <button
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page === 1}
                                    className={`flex items-center px-3 py-1 rounded-md text-sm ${page === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-green-600 hover:bg-green-50'
                                        }`}
                                >
                                    <FaChevronLeft className="mr-1" />
                                    Previous
                                </button>

                                <div className="hidden md:flex">
                                    {[...Array(pagination.pages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => goToPage(i + 1)}
                                            className={`mx-1 px-3 py-1 rounded-md text-sm ${page === i + 1
                                                ? 'bg-green-600 text-white'
                                                : 'text-gray-700 hover:bg-green-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <div className="md:hidden text-sm text-gray-700">
                                    Page {page} of {pagination.pages}
                                </div>

                                <button
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page === pagination.pages}
                                    className={`flex items-center px-3 py-1 rounded-md text-sm ${page === pagination.pages
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-green-600 hover:bg-green-50'
                                        }`}
                                >
                                    Next
                                    <FaChevronRight className="ml-1" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Back button */}
                        <div className="p-4 border-b border-gray-200">
                            <button
                                onClick={() => {
                                    setViewMode('list');
                                    setSelectedContact(null);
                                    setError(null);
                                }}
                                className="flex items-center text-green-600 hover:text-green-900"
                            >
                                <FaChevronLeft className="mr-2" />
                                Back to all contacts
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border-b border-red-100 text-red-700 flex items-center">
                                <FaExclamationCircle className="mr-2" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Contact Details */}
                        {loading ? (
                            <div className="p-8 text-center">
                                <FaSpinner className="animate-spin text-green-600 text-2xl mx-auto mb-2" />
                                <p>Loading contact details...</p>
                            </div>
                        ) : selectedContact ? (
                            <div className="p-6">
                                <div className="flex justify-between items-start flex-wrap mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedContact.subject}</h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Received {formatDate(selectedContact.createdAt)}
                                        </p>
                                    </div>
                                    <StatusBadge status={selectedContact.status} />
                                </div>

                                {/* Contact information */}
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="mb-2"><span className="font-medium">Name:</span> {selectedContact.name}</p>
                                            <p className="mb-2"><span className="font-medium">Email:</span> {selectedContact.email}</p>
                                            {selectedContact.company && (
                                                <p><span className="font-medium">Company:</span> {selectedContact.company}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin actions */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Notes</h3>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                                        rows={4}
                                        placeholder="Add internal notes about this contact..."
                                    ></textarea>

                                    <div className="flex flex-wrap gap-3 justify-end">
                                        <button
                                            onClick={() => updateContactStatus('new')}
                                            disabled={selectedContact.status === 'new' || updatingStatus}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedContact.status === 'new' || updatingStatus
                                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                }`}
                                        >
                                            Mark as New
                                        </button>
                                        <button
                                            onClick={() => updateContactStatus('in-progress')}
                                            disabled={selectedContact.status === 'in-progress' || updatingStatus}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedContact.status === 'in-progress' || updatingStatus
                                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                }`}
                                        >
                                            Mark In Progress
                                        </button>
                                        <button
                                            onClick={() => updateContactStatus('resolved')}
                                            disabled={selectedContact.status === 'resolved' || updatingStatus}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedContact.status === 'resolved' || updatingStatus
                                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                        >
                                            {updatingStatus ? (
                                                <FaSpinner className="animate-spin inline mr-1" />
                                            ) : (
                                                <FaCheck className="inline mr-1" />
                                            )}
                                            Mark as Resolved
                                        </button>
                                        <button
                                            onClick={() => deleteContact(selectedContact._id)}
                                            disabled={updatingStatus}
                                            className="px-4 py-2 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                                        >
                                            <FaTrash className="inline mr-1" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Contact not found or has been deleted.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactManagement; 