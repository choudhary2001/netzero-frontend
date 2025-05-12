import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes, FaSpinner, FaPaperclip, FaCommentAlt, FaSave } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { getMediaUrl } from './../../config';

const CompanyInfoManagement = () => {
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [viewMode, setViewMode] = useState(null);
    const [remark, setRemark] = useState('');
    const [documentRating, setDocumentRating] = useState(0);
    const [companyDocuments, setCompanyDocuments] = useState({});
    const [currentDocKey, setCurrentDocKey] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllESGSubmissions();

            if (response.success) {
                // Filter submissions that have company info
                const companiesWithInfo = response.data.filter(
                    submission => submission.companyInfo && Object.keys(submission.companyInfo).length > 0
                );
                setCompanies(companiesWithInfo);
            } else {
                toast.error('Failed to fetch company information');
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            toast.error('Error loading company information');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'submitted': return 'bg-yellow-100 text-yellow-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'reviewed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleViewCompany = (company) => {
        setSelectedCompany(company);
        setViewMode('details');
        console.log('company', company.companyInfo);
        // Initialize document rating and remarks based on company data
        if (company) {
            const docs = {};
            if (company.companyInfo && company.companyInfo.registrationCertificate) {
                docs.registrationCertificate = {
                    path: company.companyInfo.registrationCertificate,
                    rating: company.companyInfo.points || 0,
                    remarks: company.companyInfo.remarks || '',
                    value: company.companyInfo.value || '',
                    certificate: company.companyInfo.certificate || ''
                };
            }

            // Add environment, social, governance documents if they exist
            ['environment', 'social', 'governance'].forEach(category => {
                if (company[category]) {
                    Object.keys(company[category]).forEach(section => {
                        if (company[category][section] && company[category][section].certificate) {
                            docs[`${category}_${section}`] = {
                                path: company[category][section].certificate,
                                rating: company[category][section].points || 0,
                                remarks: company[category][section].remarks || '',
                                value: company[category][section].value || '',
                                certificate: company[category][section].certificate || ''
                            };
                        }
                    });
                }
            });

            setCompanyDocuments(docs);
        }
    };

    const handleCloseModal = () => {
        setSelectedCompany(null);
        setViewMode(null);
        setRemark('');
        setDocumentRating(0);
        setCompanyDocuments({});
        setCurrentDocKey(null);
    };

    const handleStatusChange = async (companyId, newStatus) => {
        try {
            setLoading(true);
            const response = await adminService.reviewESGData(companyId, newStatus, '');

            if (response.success) {
                toast.success(`Company status updated to ${newStatus}`);
                // Refresh company list
                fetchCompanies();

                // Close modal if the company is the selected one
                if (selectedCompany && selectedCompany._id === companyId) {
                    handleCloseModal();
                }
            } else {
                toast.error('Failed to update company status');
            }
        } catch (error) {
            console.error('Error updating company status:', error);
            toast.error('Error updating company status');
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentView = (docKey) => {
        setViewMode('document');
        setCurrentDocKey(docKey);
        console.log('companyDocuments', companyDocuments[docKey]);
        setRemark(companyDocuments[docKey]?.remarks || '');
        setDocumentRating(companyDocuments[docKey]?.rating || 0);
    };

    const handleSaveRemark = async () => {
        if (!currentDocKey || !selectedCompany) return;

        try {
            setLoading(true);

            // Determine if this is company info or ESG category
            if (currentDocKey === 'registrationCertificate') {
                // Update company info remarks
                const response = await adminService.updateCompanyInfoRemarks(
                    selectedCompany._id,
                    documentRating,
                    remark,
                );

                if (response.success) {
                    toast.success('Company document rating and remarks saved successfully');

                    // Update local state
                    setCompanyDocuments(prev => ({
                        ...prev,
                        registrationCertificate: {
                            ...prev.registrationCertificate,
                            rating: documentRating,
                            remarks: remark
                        }
                    }));

                    setViewMode('details');
                } else {
                    toast.error('Failed to save company document rating and remarks');
                }
            } else {
                // Extract category and section
                const [category, section] = currentDocKey.split('_');

                // Update ESG category section points and remarks
                const response = await adminService.updateSectionPoints(
                    selectedCompany._id,
                    category,
                    section,
                    documentRating,
                    remark
                );

                if (response.success) {
                    toast.success('Document rating and remarks saved successfully');

                    // Update local state
                    setCompanyDocuments(prev => ({
                        ...prev,
                        [currentDocKey]: {
                            ...prev[currentDocKey],
                            rating: documentRating,
                            remarks: remark
                        }
                    }));

                    // Update the selected company's score if it exists
                    if (selectedCompany && selectedCompany[category] && selectedCompany[category][section]) {
                        setSelectedCompany(prev => ({
                            ...prev,
                            [category]: {
                                ...prev[category],
                                [section]: {
                                    ...prev[category][section],
                                    points: documentRating,
                                    remarks: remark
                                }
                            }
                        }));
                    }

                    // Refresh companies to get updated scores
                    fetchCompanies();
                    setViewMode('details');
                } else {
                    toast.error('Failed to save document rating and remarks');
                }
            }
        } catch (error) {
            console.error('Error saving remarks:', error);
            toast.error('Error saving remarks');
        } finally {
            setLoading(false);
        }
    };

    const renderCompanyDetails = () => {
        if (!selectedCompany) return null;

        const { companyInfo } = selectedCompany;
        if (!companyInfo) return <p>No company information available</p>;

        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Company Name</p>
                            <p className="text-gray-800">{companyInfo.companyName || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Registration Number</p>
                            <p className="text-gray-800">{companyInfo.registrationNumber || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Establishment Year</p>
                            <p className="text-gray-800">{companyInfo.establishmentYear || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Business Type</p>
                            <p className="text-gray-800">{companyInfo.businessType || 'N/A'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Company Address</p>
                            <p className="text-gray-800">{companyInfo.companyAddress || 'N/A'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Roles Defined Clearly</p>
                            <p className="text-gray-800">{companyInfo.rolesDefinedClearly || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Organization Roles Section */}
                {companyInfo.organizationRoles && companyInfo.organizationRoles.length > 0 && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Roles</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsibility</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {companyInfo.organizationRoles.map((role, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{role.role || 'N/A'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900">{role.responsibility || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Certificates Section */}
                {companyInfo.certificates && companyInfo.certificates.length > 0 && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Certificates</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {companyInfo.certificates.map((cert, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{cert.type || 'N/A'}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{cert.level || 'N/A'}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{cert.validity || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Documents</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-700">Registration Certificate</span>
                            {companyInfo.registrationCertificate ? (
                                <div className="flex items-center">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 mr-2"
                                        onClick={() => handleDocumentView('registrationCertificate')}
                                    >
                                        <FaPaperclip className="mr-1 inline" /> View & Rate
                                    </button>
                                    {companyDocuments.registrationCertificate?.rating > 0 && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                            Rated: {companyDocuments.registrationCertificate?.rating}/1
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-gray-500 text-sm">Not uploaded</span>
                            )}
                        </div>

                        {/* Environment Documents */}
                        {selectedCompany.environment && (
                            <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Environment Documents</h4>
                                {Object.keys(selectedCompany.environment).map(section => (
                                    selectedCompany.environment[section]?.certificate && (
                                        <div key={`env_${section}`} className="flex items-center justify-between py-2 border-b">
                                            <span className="text-gray-700">{section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                            <div className="flex items-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 mr-2"
                                                    onClick={() => handleDocumentView(`environment_${section}`)}
                                                >
                                                    <FaPaperclip className="mr-1 inline" /> View & Rate
                                                </button>
                                                {companyDocuments[`environment_${section}`]?.rating > 0 && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                                        Rated: {companyDocuments[`environment_${section}`]?.rating}/1
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {/* Social Documents */}
                        {selectedCompany.social && (
                            <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Social Documents</h4>
                                {Object.keys(selectedCompany.social).map(section => (
                                    selectedCompany.social[section]?.certificate && (
                                        <div key={`social_${section}`} className="flex items-center justify-between py-2 border-b">
                                            <span className="text-gray-700">{section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                            <div className="flex items-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 mr-2"
                                                    onClick={() => handleDocumentView(`social_${section}`)}
                                                >
                                                    <FaPaperclip className="mr-1 inline" /> View & Rate
                                                </button>
                                                {companyDocuments[`social_${section}`]?.rating > 0 && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                                        Rated: {companyDocuments[`social_${section}`]?.rating}/1
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {/* Governance Documents */}
                        {selectedCompany.governance && (
                            <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Governance Documents</h4>
                                {Object.keys(selectedCompany.governance).map(section => (
                                    selectedCompany.governance[section]?.certificate && (
                                        <div key={`gov_${section}`} className="flex items-center justify-between py-2 border-b">
                                            <span className="text-gray-700">{section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                            <div className="flex items-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 mr-2"
                                                    onClick={() => handleDocumentView(`governance_${section}`)}
                                                >
                                                    <FaPaperclip className="mr-1 inline" /> View & Rate
                                                </button>
                                                {companyDocuments[`governance_${section}`]?.rating > 0 && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                                        Rated: {companyDocuments[`governance_${section}`]?.rating}/1
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">ESG Scores</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-md text-center">
                            <p className="text-sm font-medium text-blue-700">Environment</p>
                            <p className="text-2xl font-bold text-blue-800">
                                {selectedCompany.overallScore?.environment.toFixed(1) || '0'}/1
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-md text-center">
                            <p className="text-sm font-medium text-purple-700">Social</p>
                            <p className="text-2xl font-bold text-purple-800">
                                {selectedCompany.overallScore?.social.toFixed(1) || '0'}/1
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-md text-center">
                            <p className="text-sm font-medium text-green-700">Governance</p>
                            <p className="text-2xl font-bold text-green-800">
                                {selectedCompany.overallScore?.governance.toFixed(1) || '0'}/1
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDocumentView = () => {
        if (!currentDocKey || !companyDocuments[currentDocKey]) {
            return <p>Document not found</p>;
        }

        const documentPath = companyDocuments[currentDocKey].path;
        const fullDocumentUrl = getMediaUrl(documentPath);
        const documentData = companyDocuments[currentDocKey];

        // Helper function to get unit based on document key
        const getUnit = (key) => {
            if (key.includes('renewableEnergy')) return 'kWh/month';
            if (key.includes('waterConsumption')) return 'm³/month';
            if (key.includes('rainwaterHarvesting')) return 'm³/year';
            if (key.includes('emissionControl')) return 'tons/year';
            if (key.includes('resourceConservation')) return '%';
            return '';
        };

        return (
            <div className="space-y-6">


                {/* Document Preview */}
                <div className="bg-white p-4 rounded-md border border-gray-300">
                    {documentPath ? (
                        documentPath.endsWith('.pdf') ? (
                            <iframe
                                src={fullDocumentUrl}
                                className="w-full h-[70vh] rounded border border-gray-200"
                                title="Document Preview"
                            />
                        ) : documentPath.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <img
                                src={fullDocumentUrl}
                                alt="Document Preview"
                                className="max-w-full h-auto max-h-96 mx-auto"
                            />
                        ) : (
                            <div className="bg-gray-800 p-4 rounded-md text-center text-white">
                                <p>Document Preview Not Available</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    The document format is not supported for preview.
                                </p>
                                <a
                                    href={fullDocumentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
                                >
                                    Open Document
                                </a>
                            </div>
                        )
                    ) : (
                        <div className="bg-gray-800 p-4 rounded-md text-center text-white">
                            <p>No Document Available</p>
                        </div>
                    )}

                    {/* Value and Unit Display */}
                    {documentData.value && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h5 className="text-sm font-medium text-gray-700">Reported Value</h5>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {documentData.value} {getUnit(currentDocKey)}
                                    </p>
                                </div>

                            </div>

                        </div>
                    )}
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Document Review</h3>

                    {/* Document Rating */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating (0-1)
                        </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={documentRating}
                                onChange={(e) => setDocumentRating(parseFloat(e.target.value))}
                                className="mr-2 w-full"
                            />
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md w-12 text-center">
                                {documentRating}/1
                            </span>
                        </div>
                    </div>

                    {/* Document Remarks */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Remarks
                        </label>
                        <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Add remarks about this document..."
                        ></textarea>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            onClick={() => setViewMode('details')}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                            onClick={handleSaveRemark}
                        >
                            <FaSave className="mr-2" /> Save Rating & Remarks
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='container mx-auto p-4'>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Company Information Management</h1>

            {loading && companies.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-green-600 text-4xl" />
                    <p className="ml-2 text-gray-600">Loading company information...</p>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <p className="text-gray-600 mb-4">Review and manage submitted company information.</p>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg Number</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESG Score</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {companies.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No company information found
                                    </td>
                                </tr>
                            ) : (
                                companies.map((company) => (
                                    <tr key={company._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {company.companyInfo?.companyName || 'Unnamed Company'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {company.companyInfo?.registrationNumber || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {company.lastUpdated ? new Date(company.lastUpdated).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(company.status)}`}>
                                                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {company.overallScore?.total ? company.overallScore.total.toFixed(2) + '/1' : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                className="text-indigo-600 hover:text-indigo-900"
                                                title="View Details"
                                                onClick={() => handleViewCompany(company)}
                                            >
                                                <FaEye />
                                            </button>
                                            {/* {company.status === 'submitted' && ( */}
                                            <>
                                                <button
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Approve"
                                                    onClick={() => handleStatusChange(company._id, 'approved')}
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Reject"
                                                    onClick={() => handleStatusChange(company._id, 'rejected')}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </>
                                            {/* )} */}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Company Detail Modal */}
            {selectedCompany && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative mx-auto p-5 border w-full max-w-4xl bg-white rounded-md shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-medium text-gray-900">
                                {selectedCompany.companyInfo?.companyName || 'Company Details'}
                            </h2>
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={handleCloseModal}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[70vh]">
                            {viewMode === 'details' && renderCompanyDetails()}
                            {viewMode === 'document' && renderDocumentView()}
                        </div>

                        <div className="mt-6 flex justify-end">
                            {viewMode === 'details' && (
                                <>
                                    <button
                                        className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </button>
                                    {/* {selectedCompany.status === 'submitted' && ( */}
                                    <>
                                        <button
                                            className="mr-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            onClick={() => handleStatusChange(selectedCompany._id, 'approved')}
                                        >
                                            <FaCheck className="inline mr-1" /> Approve
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            onClick={() => handleStatusChange(selectedCompany._id, 'rejected')}
                                        >
                                            <FaTimes className="inline mr-1" /> Reject
                                        </button>
                                    </>
                                    {/* )} */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyInfoManagement; 