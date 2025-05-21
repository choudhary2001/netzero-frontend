import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaDownload, FaEdit, FaStar } from 'react-icons/fa';
import esgService from '../../services/esgService';
import { toast } from 'react-toastify';

const ESGReview = () => {
    const [esgSubmissions, setEsgSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [reviewData, setReviewData] = useState({
        status: 'reviewed',
        reviewComments: '',
        points: {}
    });

    useEffect(() => {
        fetchESGSubmissions();
    }, []);

    const fetchESGSubmissions = async () => {
        try {
            setLoading(true);
            const response = await esgService.getAllESGData();
            if (response.success) {
                // Filter only submitted or reviewed ESG data
                const filteredData = response.data.filter(
                    submission => ['submitted', 'reviewed', 'approved', 'rejected'].includes(submission.status)
                );
                setEsgSubmissions(filteredData);
            } else {
                toast.error('Failed to fetch ESG submissions');
            }
        } catch (error) {
            console.error('Error fetching ESG submissions:', error);
            toast.error('Error loading ESG submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSubmission = (submission) => {
        setSelectedSubmission(submission);
        // Initialize review data with existing values if available
        setReviewData({
            status: submission.status || 'reviewed',
            reviewComments: submission.reviewComments || '',
            points: {}
        });
    };

    const handlePointsChange = (category, section, value) => {
        setReviewData(prev => ({
            ...prev,
            points: {
                ...prev.points,
                [category]: {
                    ...prev.points[category],
                    [section]: parseInt(value, 10)
                }
            }
        }));
    };

    const handleStatusChange = (status) => {
        setReviewData(prev => ({
            ...prev,
            status
        }));
    };

    const handleCommentsChange = (e) => {
        setReviewData(prev => ({
            ...prev,
            reviewComments: e.target.value
        }));
    };

    const handleSubmitReview = async () => {
        try {
            setLoading(true);

            // First update points for each section
            if (selectedSubmission && Object.keys(reviewData.points).length > 0) {
                for (const category in reviewData.points) {
                    for (const section in reviewData.points[category]) {
                        const points = reviewData.points[category][section];
                        await esgService.updateSectionPoints(
                            selectedSubmission._id,
                            category,
                            section,
                            points
                        );
                    }
                }
            }

            // Then update the overall status and comments
            const response = await esgService.reviewESGData(
                selectedSubmission._id,
                reviewData.status,
                reviewData.reviewComments
            );

            if (response.success) {
                toast.success('ESG submission reviewed successfully');
                fetchESGSubmissions(); // Refresh the list
                setSelectedSubmission(null);
            } else {
                toast.error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Error submitting review');
        } finally {
            setLoading(false);
        }
    };

    const renderPointsInput = (category, section, currentPoints) => {
        return (
            <div className="flex items-center">
                <input
                    type="number"
                    min="0"
                    max="10"
                    value={reviewData.points[category]?.[section] !== undefined ? reviewData.points[category][section] : currentPoints}
                    onChange={(e) => handlePointsChange(category, section, e.target.value)}
                    className="w-16 border border-gray-300 rounded-md p-1 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="text-gray-500 ml-1">/10</span>
            </div>
        );
    };

    const getCategoryStatusColor = (category) => {
        if (!selectedSubmission || !selectedSubmission.overallScore) return 'bg-gray-100';

        const score = selectedSubmission.overallScore[category];
        if (score >= 8) return 'bg-green-100 text-green-800';
        if (score >= 5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">ESG Submissions Review</h1>

            {loading && !selectedSubmission ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-green-600 text-4xl" />
                    <p className="ml-2 text-gray-600">Loading submissions...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Submissions List */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-200px)]">
                        <h2 className="text-xl font-semibold mb-4">Pending Reviews</h2>

                        {esgSubmissions.length === 0 ? (
                            <p className="text-gray-500">No submissions to review.</p>
                        ) : (
                            <ul className="space-y-3">
                                {esgSubmissions.map((submission) => (
                                    <li
                                        key={submission._id}
                                        className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${selectedSubmission?._id === submission._id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                            }`}
                                        onClick={() => handleSelectSubmission(submission)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{submission.userId?.name || 'Unknown User'}</p>
                                                <p className="text-sm text-gray-500">{submission.companyId?.name || 'Unknown Company'}</p>
                                                <p className="text-xs text-gray-400">
                                                    Submitted: {new Date(submission.lastUpdated).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                                        submission.status === 'reviewed' ? 'bg-purple-100 text-purple-800' :
                                                            submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Submission Review */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-200px)]">
                        {selectedSubmission ? (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Review Submission</h2>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleStatusChange('approved')}
                                            className={`px-3 py-2 rounded-md ${reviewData.status === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <FaCheckCircle className="inline mr-1" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('rejected')}
                                            className={`px-3 py-2 rounded-md ${reviewData.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <FaTimesCircle className="inline mr-1" /> Reject
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-medium mb-2">Submission Info</h3>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p><span className="font-medium">Supplier:</span> {selectedSubmission.userId?.name || 'Unknown'}</p>
                                        <p><span className="font-medium">Company:</span> {selectedSubmission.companyId?.name || 'Unknown'}</p>
                                        <p><span className="font-medium">Submitted:</span> {new Date(selectedSubmission.lastUpdated).toLocaleString()}</p>
                                        <p><span className="font-medium">Status:</span> {selectedSubmission.status}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-medium mb-2">Category Scores</h3>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div className={`p-3 rounded-md ${getCategoryStatusColor('environment')}`}>
                                            <p className="font-medium">Environment</p>
                                            <p className="text-2xl font-bold">{selectedSubmission.overallScore?.environment.toFixed(1) || 0}<span className="text-sm">/1</span></p>
                                        </div>
                                        <div className={`p-3 rounded-md ${getCategoryStatusColor('social')}`}>
                                            <p className="font-medium">Social</p>
                                            <p className="text-2xl font-bold">{selectedSubmission.overallScore?.social.toFixed(1) || 0}<span className="text-sm">/1</span></p>
                                        </div>
                                        <div className={`p-3 rounded-md ${getCategoryStatusColor('quality')}`}>
                                            <p className="font-medium">Quality</p>
                                            <p className="text-2xl font-bold">{selectedSubmission.overallScore?.quality.toFixed(1) || 0}<span className="text-sm">/1</span></p>
                                        </div>
                                        <div className={`p-3 rounded-md ${getCategoryStatusColor('governance')}`}>
                                            <p className="font-medium">Governance</p>
                                            <p className="text-2xl font-bold">{selectedSubmission.overallScore?.governance.toFixed(1) || 0}<span className="text-sm">/1</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Environment Section */}
                                <div className="mb-6">
                                    <h3 className="font-medium mb-2">Environment</h3>
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="text-left p-2">Metric</th>
                                                <th className="text-left p-2">Value</th>
                                                <th className="text-left p-2">Certificate</th>
                                                <th className="text-left p-2">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedSubmission.environment && Object.entries(selectedSubmission.environment).map(([key, data]) => (
                                                <tr key={key} className="border-t">
                                                    <td className="p-2 font-medium">
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </td>
                                                    <td className="p-2">{data.value || 'Not provided'}</td>
                                                    <td className="p-2">
                                                        {data.certificate ? (
                                                            <a href={data.certificate} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                <FaDownload className="inline mr-1" /> View
                                                            </a>
                                                        ) : 'No certificate'}
                                                    </td>
                                                    <td className="p-2">
                                                        {renderPointsInput('environment', key, data.points || 0)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Social Section */}
                                <div className="mb-6">
                                    <h3 className="font-medium mb-2">Social</h3>
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="text-left p-2">Metric</th>
                                                <th className="text-left p-2">Value</th>
                                                <th className="text-left p-2">Certificate</th>
                                                <th className="text-left p-2">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedSubmission.social && Object.entries(selectedSubmission.social).map(([key, data]) => (
                                                <tr key={key} className="border-t">
                                                    <td className="p-2 font-medium">
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </td>
                                                    <td className="p-2">{data.value || 'Not provided'}</td>
                                                    <td className="p-2">
                                                        {data.certificate ? (
                                                            <a href={data.certificate} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                <FaDownload className="inline mr-1" /> View
                                                            </a>
                                                        ) : 'No certificate'}
                                                    </td>
                                                    <td className="p-2">
                                                        {renderPointsInput('social', key, data.points || 0)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Quality Section */}
                                <div className="mb-6">
                                    <h3 className="font-medium mb-2">Quality</h3>
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="text-left p-2">Metric</th>
                                                <th className="text-left p-2">Value</th>
                                                <th className="text-left p-2">Certificate</th>
                                                <th className="text-left p-2">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedSubmission.quality && Object.entries(selectedSubmission.quality).map(([key, data]) => (
                                                <tr key={key} className="border-t">
                                                    <td className="p-2 font-medium">
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </td>
                                                    <td className="p-2">{data.value || 'Not provided'}</td>
                                                    <td className="p-2">
                                                        {data.certificate ? (
                                                            <a href={data.certificate} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                <FaDownload className="inline mr-1" /> View
                                                            </a>
                                                        ) : 'No certificate'}
                                                    </td>
                                                    <td className="p-2">
                                                        {renderPointsInput('quality', key, data.points || 0)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Governance Section */}
                                <div className="mb-6">
                                    <h3 className="font-medium mb-2">Governance</h3>
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="text-left p-2">Metric</th>
                                                <th className="text-left p-2">Value</th>
                                                <th className="text-left p-2">Certificate</th>
                                                <th className="text-left p-2">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedSubmission.governance && Object.entries(selectedSubmission.governance).map(([key, data]) => (
                                                <tr key={key} className="border-t">
                                                    <td className="p-2 font-medium">
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </td>
                                                    <td className="p-2">{data.value || 'Not provided'}</td>
                                                    <td className="p-2">
                                                        {data.certificate ? (
                                                            <a href={data.certificate} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                <FaDownload className="inline mr-1" /> View
                                                            </a>
                                                        ) : 'No certificate'}
                                                    </td>
                                                    <td className="p-2">
                                                        {renderPointsInput('governance', key, data.points || 0)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Review Comments */}
                                <div className="mb-6">
                                    <h3 className="font-medium mb-2">Review Comments</h3>
                                    <textarea
                                        value={reviewData.reviewComments}
                                        onChange={handleCommentsChange}
                                        className="w-full border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Add your comments for the supplier..."
                                    ></textarea>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setSelectedSubmission(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitReview}
                                        disabled={loading}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        {loading ? <FaSpinner className="inline animate-spin mr-1" /> : null}
                                        Submit Review
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <FaEdit className="text-5xl mb-2" />
                                <p>Select a submission to review</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ESGReview; 