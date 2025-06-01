import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes, FaSpinner, FaPaperclip, FaCommentAlt, FaSave, FaSearch, FaFilter, FaCalendarAlt, FaBuilding, FaChartLine, FaUsers, FaDownload } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { getMediaUrl } from './../../config';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const CompanyInfoManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [viewMode, setViewMode] = useState(null);
    const [remark, setRemark] = useState('');
    const [documentRating, setDocumentRating] = useState(0);
    const [companyDocuments, setCompanyDocuments] = useState({});
    const [currentDocKey, setCurrentDocKey] = useState(null);

    // Add filters state
    const [filters, setFilters] = useState(() => {
        const searchParams = new URLSearchParams(location.search);
        return {
            status: searchParams.get('status') || 'all',
            type: searchParams.get('type') || 'all',
            search: ''
        };
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    // Update filters when URL changes
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        setFilters(prev => ({
            ...prev,
            status: status || 'all',
            type: type || 'all'
        }));
    }, [location.search]);

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
        console.log('company', company);
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

            // Add environment, social, quality documents if they exist
            ['environment', 'social', 'quality'].forEach(category => {
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

                    // Refresh companies to get updated scores
                    await fetchCompanies();

                    // Update the selected company with fresh data
                    const updatedCompanies = await adminService.getAllESGSubmissions();
                    if (updatedCompanies.success) {
                        const freshCompanyData = updatedCompanies.data.find(c => c._id === selectedCompany._id);
                        if (freshCompanyData) {
                            setSelectedCompany(freshCompanyData);
                        }
                    }

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

                    // Refresh companies list first
                    await fetchCompanies();

                    // Get fresh data for the selected company
                    const updatedCompanies = await adminService.getAllESGSubmissions();
                    if (updatedCompanies.success) {
                        const freshCompanyData = updatedCompanies.data.find(c => c._id === selectedCompany._id);
                        if (freshCompanyData) {
                            setSelectedCompany(freshCompanyData);
                        }
                    }

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

    const handleOpenChat = (company) => {
        console.log('company', company);
        // Navigate to chat with the company
        navigate(`/admin/chat/${company.userId._id}`, {
            state: {
                companyName: company.companyInfo?.companyName,
                companyId: company.userId._id
            }
        });
    };

    const handleDownloadPdf = (company) => {
        const doc = new jsPDF();
        const { companyInfo, overallScore, environment, social, quality, governance } = company;
        let y = 20;
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;

        // Colors
        const colors = {
            primary: [41, 128, 185],
            secondary: [44, 62, 80],
            environment: [46, 204, 113],
            social: [155, 89, 182],
            quality: [52, 152, 219],
            governance: [230, 126, 34]
        };

        // Helper function to check and add new page if needed
        const checkAndAddPage = (requiredHeight) => {
            if (y + requiredHeight > pageHeight - 20) {
                doc.addPage();
                y = 20;
                return true;
            }
            return false;
        };

        // Helper function to format date
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        };

        // Helper function to draw a table
        const drawTable = (startX, startY, headers, data, colWidths, rowHeight = 8) => {
            const cellPadding = 3;
            let currentY = startY;

            // Check for new page
            const totalHeight = (data.length + 1) * rowHeight;
            if (checkAndAddPage(totalHeight)) {
                currentY = y;
            }

            // Draw headers
            doc.setFillColor(41, 128, 185);
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            let currentX = startX;

            // Draw header background
            doc.rect(startX, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight + 4, 'F');

            // Draw header text
            headers.forEach((header, i) => {
                doc.text(header, currentX + cellPadding, currentY + rowHeight + 2);
                currentX += colWidths[i];
            });
            currentY += rowHeight + 4;

            // Draw data rows
            doc.setTextColor(60, 60, 60);
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');

            data.forEach((row, rowIndex) => {
                // Check for page break
                if (currentY + rowHeight > pageHeight - 20) {
                    doc.addPage();
                    currentY = 20;
                    // Redraw headers on new page
                    doc.setFillColor(41, 128, 185);
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(10);
                    doc.setFont(undefined, 'bold');
                    currentX = startX;
                    doc.rect(startX, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight + 4, 'F');
                    headers.forEach((header, i) => {
                        doc.text(header, currentX + cellPadding, currentY + rowHeight + 2);
                        currentX += colWidths[i];
                    });
                    currentY += rowHeight + 4;
                    doc.setTextColor(60, 60, 60);
                    doc.setFontSize(9);
                    doc.setFont(undefined, 'normal');
                }

                // Draw row background
                doc.setFillColor(rowIndex % 2 === 0 ? 245 : 255, rowIndex % 2 === 0 ? 245 : 255, rowIndex % 2 === 0 ? 245 : 255);
                const rowContent = row[1].split('\n');
                const rowTotalHeight = Math.max(rowHeight, rowContent.length * 5 + 4);
                doc.rect(startX, currentY, colWidths.reduce((a, b) => a + b, 0), rowTotalHeight, 'F');

                // Draw cell content
                currentX = startX;
                row.forEach((cell, colIndex) => {
                    if (colIndex === 1 && cell.includes('\n')) {
                        // Handle multiline content
                        const lines = cell.split('\n');
                        lines.forEach((line, lineIndex) => {
                            doc.text(line, currentX + cellPadding, currentY + 5 + (lineIndex * 5));
                        });
                    } else {
                        doc.text(cell, currentX + cellPadding, currentY + 5);
                    }
                    currentX += colWidths[colIndex];
                });
                currentY += rowTotalHeight;
            });

            return currentY;
        };

        // Helper function to draw a beautiful score card
        const drawScoreCard = (startY) => {
            const cardWidth = 180;
            const cardX = (pageWidth - cardWidth) / 2;
            const rowHeight = 12;
            let currentY = startY;

            // Draw title
            doc.setFillColor(41, 128, 185);
            doc.rect(cardX, currentY, cardWidth, rowHeight, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text("ESG PERFORMANCE SCORECARD", pageWidth / 2, currentY + 8, { align: 'center' });
            currentY += rowHeight;

            // Draw score rows
            const scores = [
                ["Overall", (overallScore?.total * 100 || 0).toFixed(0) + "%"],
                ["Environment", (overallScore?.environment * 100 || 0).toFixed(0) + "%"],
                ["Social", (overallScore?.social * 100 || 0).toFixed(0) + "%"],
                ["Quality", (overallScore?.quality * 100 || 0).toFixed(0) + "%"],
                ["Governance", (overallScore?.governance * 100 || 0).toFixed(0) + "%"]
            ];

            scores.forEach((score, index) => {
                // Alternate row colors
                doc.setFillColor(index % 2 === 0 ? 245 : 255, index % 2 === 0 ? 245 : 255, index % 2 === 0 ? 245 : 255);
                doc.rect(cardX, currentY, cardWidth, rowHeight, 'F');

                // Category name
                doc.setTextColor(60, 60, 60);
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.text(score[0], cardX + 10, currentY + 8);

                // Score with color-coded background
                const scoreValue = parseInt(score[1]);
                const scoreWidth = 40;
                const scoreX = cardX + cardWidth - scoreWidth - 10;

                // Score background
                let scoreColor;
                if (scoreValue >= 70) scoreColor = [46, 204, 113]; // Green
                else if (scoreValue >= 40) scoreColor = [241, 196, 15]; // Yellow
                else scoreColor = [231, 76, 60]; // Red

                doc.setFillColor(...scoreColor);
                doc.roundedRect(scoreX, currentY + 2, scoreWidth, rowHeight - 4, 2, 2, 'F');

                // Score text
                doc.setTextColor(255, 255, 255);
                doc.setFont(undefined, 'bold');
                doc.text(score[1], scoreX + scoreWidth / 2, currentY + 8, { align: 'center' });

                currentY += rowHeight;
            });

            return currentY + 10;
        };

        // Helper function to format object values with better structure
        const formatObjectValue = (value) => {
            if (!value || typeof value !== 'object') return String(value || 'N/A');

            if (Array.isArray(value)) {
                return value.map(item => formatObjectValue(item)).join('\n');
            }

            const formattedParts = [];

            // Format CSR Projects specially
            if (value._id && value.name) {
                return `Project: ${value.name}\nYear: ${value.year}\nDescription: ${value.description}\n`;
            }

            // Format common fields
            const fieldMappings = {
                fairWages: 'Fair Wages',
                benefits: 'Benefits',
                wageAudits: 'Wage Audits',
                leadershipPercentage: 'Leadership %',
                boardPercentage: 'Board %',
                details: 'Details',
                casesRaised: 'Cases Raised',
                resolutionOutcomes: 'Resolution Outcomes',
                hoursPerEmployee: 'Hours/Employee',
                keyPrograms: 'Key Programs',
                initiatives: 'Initiatives',
                localHiring: 'Local Hiring',
                programs: 'Programs',
                participation: 'Participation',
                spend: 'Spend',
                measurement: 'Measurement',
                reporting: 'Reporting',
                feedback: 'Feedback'
            };

            Object.entries(value).forEach(([key, val]) => {
                if (val && !['_id', 'certificate', 'points', 'remarks'].includes(key)) {
                    const label = fieldMappings[key] || key.replace(/([A-Z])/g, ' $1').trim();
                    if (typeof val === 'object') {
                        formattedParts.push(`${label}:\n${formatObjectValue(val)}`);
                    } else {
                        formattedParts.push(`${label}: ${val}`);
                    }
                }
            });

            return formattedParts.join('\n');
        };

        // Title and Company Info
        doc.setFontSize(16);
        doc.setTextColor(...colors.primary);
        const companyName = companyInfo?.companyName || "Company Report";
        doc.text(companyName, pageWidth / 2, y, { align: 'center' });
        y += 10;

        // doc.setFontSize(12);
        // doc.text("ESG Assessment Report", pageWidth / 2, y, { align: 'center' });
        // y += 10;

        // doc.setFontSize(10);
        // doc.text("Generated: " + new Date().toLocaleDateString(), pageWidth / 2, y, { align: 'center' });
        // y += 15;

        // // Draw Score Card
        // y = drawScoreCard(y) + 10;

        // Company Details
        const companyDetails = [
            ["Registration Number", companyInfo?.registrationNumber || "N/A"],
            ["Business Type", companyInfo?.businessType || "N/A"],
            ["Establishment Year", companyInfo?.establishmentYear || "N/A"],
            ["Company Address", companyInfo?.companyAddress || "N/A"]
        ];

        y = drawTable(14, y, ["Field", "Details"], companyDetails, [60, 120]) + 10;

        // Function to format section data with improved object handling
        const formatSectionData = (data, sectionName) => {
            if (!data) return [];
            const result = [];

            // Add main value if exists
            if (data.value) {
                result.push([
                    sectionName,
                    formatObjectValue(data.value),
                    formatDate(data.lastUpdated)
                ]);
            }

            // Add other fields
            Object.entries(data).forEach(([key, value]) => {
                if (!['certificate', 'points', 'remarks', 'lastUpdated', 'value'].includes(key)) {
                    result.push([
                        key.replace(/([A-Z])/g, ' $1').trim(),
                        formatObjectValue(value),
                        formatDate(data.lastUpdated)
                    ]);
                }
            });

            return result;
        };

        // Environment Data
        if (environment) {
            checkAndAddPage(20);
            doc.setFontSize(12);
            doc.setTextColor(...colors.environment);
            doc.text("Environmental Assessment", 14, y);
            y += 10;

            const envHeaders = ["PARAMETER", "VALUE", "LAST UPDATED"];
            const envData = [];

            Object.entries(environment).forEach(([section, data]) => {
                const sectionData = formatSectionData(data, section.replace(/([A-Z])/g, ' $1').trim());
                envData.push(...sectionData);
            });

            if (envData.length > 0) {
                y = drawTable(14, y, envHeaders, envData, [50, 90, 50]) + 10;
            }
        }

        // Social Data
        if (social) {
            checkAndAddPage(20);
            doc.setFontSize(12);
            doc.setTextColor(...colors.social);
            doc.text("Social Assessment", 14, y);
            y += 10;

            const socialHeaders = ["PARAMETER", "VALUE", "LAST UPDATED"];
            const socialData = [];

            Object.entries(social).forEach(([section, data]) => {
                const sectionData = formatSectionData(data, section.replace(/([A-Z])/g, ' $1').trim());
                socialData.push(...sectionData);
            });

            if (socialData.length > 0) {
                y = drawTable(14, y, socialHeaders, socialData, [50, 90, 50]) + 10;
            }
        }

        // Quality Data
        if (quality) {
            checkAndAddPage(20);
            doc.setFontSize(12);
            doc.setTextColor(...colors.quality);
            doc.text("Quality Assessment", 14, y);
            y += 10;

            const qualityHeaders = ["PARAMETER", "VALUE", "LAST UPDATED"];
            const qualityData = [];

            Object.entries(quality).forEach(([section, data]) => {
                const sectionData = formatSectionData(data, section.replace(/([A-Z])/g, ' $1').trim());
                qualityData.push(...sectionData);
            });

            if (qualityData.length > 0) {
                y = drawTable(14, y, qualityHeaders, qualityData, [60, 80, 50]) + 10;
            }
        }

        // Governance Data
        if (governance) {
            checkAndAddPage(20);
            doc.setFontSize(12);
            doc.setTextColor(...colors.governance);
            doc.text("Governance Assessment", 14, y);
            y += 10;

            const governanceHeaders = ["PARAMETER", "VALUE", "LAST UPDATED"];
            const governanceData = [];

            Object.entries(governance).forEach(([section, data]) => {
                const sectionData = formatSectionData(data, section.replace(/([A-Z])/g, ' $1').trim());
                governanceData.push(...sectionData);
            });

            if (governanceData.length > 0) {
                y = drawTable(14, y, governanceHeaders, governanceData, [60, 80, 50]) + 10;
            }
        }

        // Save the PDF
        doc.save(`${companyName.replace(/[^a-z0-9]/gi, '_')}_ESG_Assessment_Report.pdf`);
    };

    const renderCompanyDetails = () => {
        if (!selectedCompany) return null;

        const { companyInfo } = selectedCompany;
        if (!companyInfo) return <p>No company information available</p>;

        return (
            <div className="space-y-8">
                {/* Overall ESG Score Card */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-5 border border-blue-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-indigo-600" /> ESG Performance Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center col-span-1 md:col-span-1">
                            <div className="text-3xl font-bold text-indigo-700">
                                {selectedCompany.overallScore?.total ? (selectedCompany.overallScore.total * 100).toFixed(0) : '0'}
                                <span className="text-lg font-normal text-indigo-400">%</span>
                            </div>
                            <div className="mt-1 text-sm font-medium text-gray-500">Overall Score</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {selectedCompany.overallScore?.environment ? (selectedCompany.overallScore.environment * 100).toFixed(0) : '0'}%
                            </div>
                            <div className="mt-1 text-sm font-medium text-gray-500">Environment</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {selectedCompany.overallScore?.social ? (selectedCompany.overallScore.social * 100).toFixed(0) : '0'}%
                            </div>
                            <div className="mt-1 text-sm font-medium text-gray-500">Social</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold text-green-600">
                                {selectedCompany.overallScore?.quality ? (selectedCompany.overallScore.quality * 100).toFixed(0) : '0'}%
                            </div>
                            <div className="mt-1 text-sm font-medium text-gray-500">Quality</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold text-amber-600">
                                {selectedCompany.overallScore?.governance ? (selectedCompany.overallScore.governance * 100).toFixed(0) : '0'}%
                            </div>
                            <div className="mt-1 text-sm font-medium text-gray-500">Governance</div>
                        </div>
                    </div>
                </div>

                {/* Basic Information Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 rounded-t-lg">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FaBuilding className="mr-2 text-gray-600" /> Company Information
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm uppercase font-semibold text-gray-500 tracking-wider mb-3">Company Details</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Company Name</p>
                                        <p className="text-gray-800 font-medium">{companyInfo.companyName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Registration Number</p>
                                        <p className="text-gray-800 font-medium">{companyInfo.registrationNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Business Type</p>
                                        <p className="text-gray-800 font-medium">{companyInfo.businessType || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm uppercase font-semibold text-gray-500 tracking-wider mb-3">Additional Information</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Establishment Year</p>
                                        <p className="text-gray-800 font-medium">{companyInfo.establishmentYear || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Company Address</p>
                                        <p className="text-gray-800 font-medium">{companyInfo.companyAddress || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Roles Defined Clearly</p>
                                        <p className="text-gray-800 font-medium">{companyInfo.rolesDefinedClearly || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organization Roles Section */}
                {companyInfo.organizationRoles && companyInfo.organizationRoles.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 rounded-t-lg">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FaUsers className="mr-2 text-gray-600" /> Organization Roles
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-l-lg">Role</th>
                                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-r-lg">Responsibility</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {companyInfo.organizationRoles.map((role, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{role.role || 'N/A'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{role.responsibility || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Documents Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 rounded-t-lg">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FaPaperclip className="mr-2 text-gray-600" /> Documents & Certificates
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Registration Certificate */}
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-800">Registration Certificate</h4>
                                    {companyInfo.registrationCertificate ? (
                                        <div className="flex items-center">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                                                onClick={() => handleDocumentView('registrationCertificate')}
                                            >
                                                <FaEye className="mr-1" /> View & Rate
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Not uploaded</span>
                                    )}
                                </div>
                                {companyDocuments.registrationCertificate?.rating > 0 && (
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Rating</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            {companyDocuments.registrationCertificate?.rating}/1
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Environment Documents */}
                            {selectedCompany.environment && Object.keys(selectedCompany.environment).some(section => selectedCompany.environment[section]?.certificate) && (
                                <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
                                    <h4 className="font-medium text-blue-800 mb-3">Environment Documents</h4>
                                    <div className="space-y-2">
                                        {Object.keys(selectedCompany.environment).map(section => (
                                            selectedCompany.environment[section]?.certificate && (
                                                <div key={`env_${section}`} className="flex items-center justify-between p-2 bg-white rounded border border-blue-100">
                                                    <span className="text-sm text-gray-700">{section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                                    <div className="flex items-center space-x-3">
                                                        {companyDocuments[`environment_${section}`]?.rating > 0 && (
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                                {companyDocuments[`environment_${section}`]?.rating}/1
                                                            </span>
                                                        )}
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                            onClick={() => handleDocumentView(`environment_${section}`)}
                                                        >
                                                            <FaEye className="inline mr-1" /> View
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Social Documents */}
                            {selectedCompany.social && Object.keys(selectedCompany.social).some(section => selectedCompany.social[section]?.certificate) && (
                                <div className="p-4 border border-gray-200 rounded-lg bg-purple-50">
                                    <h4 className="font-medium text-purple-800 mb-3">Social Documents</h4>
                                    <div className="space-y-2">
                                        {Object.keys(selectedCompany.social).map(section => (
                                            selectedCompany.social[section]?.certificate && (
                                                <div key={`social_${section}`} className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                                                    <span className="text-sm text-gray-700">{section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                                    <div className="flex items-center space-x-3">
                                                        {companyDocuments[`social_${section}`]?.rating > 0 && (
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                                {companyDocuments[`social_${section}`]?.rating}/1
                                                            </span>
                                                        )}
                                                        <button
                                                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                                                            onClick={() => handleDocumentView(`social_${section}`)}
                                                        >
                                                            <FaEye className="inline mr-1" /> View
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quality Documents */}
                            {selectedCompany.quality && Object.keys(selectedCompany.quality).some(section => selectedCompany.quality[section]?.certificate) && (
                                <div className="p-4 border border-gray-200 rounded-lg bg-green-50">
                                    <h4 className="font-medium text-green-800 mb-3">Quality Documents</h4>
                                    <div className="space-y-2">
                                        {Object.keys(selectedCompany.quality).map(section => (
                                            selectedCompany.quality[section]?.certificate && (
                                                <div key={`qual_${section}`} className="flex items-center justify-between p-2 bg-white rounded border border-green-100">
                                                    <span className="text-sm text-gray-700">{section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                                    <div className="flex items-center space-x-3">
                                                        {companyDocuments[`quality_${section}`]?.rating > 0 && (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                                {companyDocuments[`quality_${section}`]?.rating}/1
                                                            </span>
                                                        )}
                                                        <button
                                                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                            onClick={() => handleDocumentView(`quality_${section}`)}
                                                        >
                                                            <FaEye className="inline mr-1" /> View
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Governance Documents */}
                            {selectedCompany.governance && Object.keys(selectedCompany.governance).some(section => selectedCompany.governance[section]?.certificate) && (
                                <div className="p-4 border border-gray-200 rounded-lg bg-amber-50">
                                    <h4 className="font-medium text-amber-800 mb-3">Governance Documents</h4>
                                    <div className="space-y-2">
                                        {Object.keys(selectedCompany.governance).map(section => (
                                            selectedCompany.governance[section]?.certificate && (
                                                <div key={`gov_${section}`} className="flex items-center justify-between p-2 bg-white rounded border border-amber-100">
                                                    <span className="text-sm text-gray-700">{section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                                    <div className="flex items-center space-x-3">
                                                        {companyDocuments[`governance_${section}`]?.rating > 0 && (
                                                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                                                {companyDocuments[`governance_${section}`]?.rating}/1
                                                            </span>
                                                        )}
                                                        <button
                                                            className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                                                            onClick={() => handleDocumentView(`governance_${section}`)}
                                                        >
                                                            <FaEye className="inline mr-1" /> View
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDocumentView = () => {
        const isValidDocument = currentDocKey && companyDocuments[currentDocKey];
        const documentPath = isValidDocument ? companyDocuments[currentDocKey]?.path || '' : '';
        const fullDocumentUrl = getMediaUrl(documentPath);
        const documentData = isValidDocument ? companyDocuments[currentDocKey] : {};

        const documentName = currentDocKey === 'registrationCertificate'
            ? 'Registration Certificate'
            : currentDocKey.split('_').map((word, idx) =>
                idx === 0
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word.replace(/([A-Z])/g, ' $1').trim()
            ).join(' - ');

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
                {/* Document Header */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{documentName}</h3>
                        <p className="text-sm text-gray-500">
                            {documentPath ? documentPath.split('/').pop() : 'No file name available'}
                        </p>
                    </div>
                    <button
                        onClick={() => setViewMode('details')}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Document Preview Column */}
                    <div className="col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                            <h4 className="font-medium text-gray-700">Document Preview</h4>
                        </div>
                        <div className="p-4">
                            {documentPath ? (
                                documentPath.endsWith('.pdf') ? (
                                    <iframe
                                        src={fullDocumentUrl}
                                        className="w-full h-[50vh] rounded border border-gray-200"
                                        title="Document Preview"
                                    />
                                ) : documentPath.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                    <img
                                        src={fullDocumentUrl}
                                        alt="Document Preview"
                                        className="max-w-full h-auto max-h-96 mx-auto rounded-lg shadow-sm"
                                    />
                                ) : (
                                    <div className="bg-gray-900 p-6 rounded-lg text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-white font-medium">Document Preview Not Available</p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            This file format is not supported for preview.
                                        </p>
                                        <a
                                            href={fullDocumentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            Open Document
                                        </a>
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                    <p className="mt-2 text-gray-500">No Document Available</p>
                                </div>
                            )}

                            {/* Document Data Section */}
                            <div className="mt-6 space-y-4">
                                {/* Value and Unit Display */}
                                {documentData.value && (
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-700 mb-1">Reported Value</h5>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {documentData.value} {getUnit(currentDocKey)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Additional Saved Data */}
                                {currentDocKey && currentDocKey !== 'registrationCertificate' && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h5 className="text-sm font-medium text-gray-700 mb-3">Document Information</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Extract category and section from currentDocKey */}
                                            {(() => {
                                                if (!currentDocKey.includes('_')) return null;

                                                const [category, section] = currentDocKey.split('_');
                                                const categoryData = selectedCompany[category];

                                                if (!categoryData || !categoryData[section]) return null;

                                                // Display all key-value pairs from the section data
                                                return Object.entries(categoryData[section])
                                                    .filter(([key]) => !['certificate', 'remarks', 'points'].includes(key))
                                                    .map(([key, value]) => {
                                                        // Handle different types of values
                                                        let displayValue = 'N/A';

                                                        if (value === null || value === undefined) {
                                                            displayValue = 'N/A';
                                                        } else if (typeof value === 'boolean') {
                                                            displayValue = value ? 'Yes' : 'No';
                                                        } else if (typeof value === 'object') {
                                                            // Handle nested objects
                                                            if (value !== null) {
                                                                // For objects with specific known structures
                                                                if (key === 'initiatives' || key === 'programs') {
                                                                    displayValue = value.length ? `${value.length} items` : 'None';
                                                                } else if (key === 'localHiring' || key === 'participation' || key === 'spend' ||
                                                                    key === 'measurement' || key === 'reporting' || key === 'feedback') {
                                                                    // For these specific objects, show a summary of their properties
                                                                    const summary = Object.entries(value)
                                                                        .filter(([k, v]) => v !== null && v !== undefined)
                                                                        .map(([k, v]) => `${k}: ${typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v}`)
                                                                        .join(', ');
                                                                    displayValue = summary || 'None';
                                                                } else {
                                                                    // For any other object, convert to string representation
                                                                    try {
                                                                        // Format the object in a more readable way
                                                                        if (Object.keys(value).length > 0) {
                                                                            // Create a structured view for objects
                                                                            displayValue = (
                                                                                <div className="space-y-2">
                                                                                    {Object.entries(value).map(([subKey, subValue]) => (
                                                                                        <div key={subKey} className="pl-3 border-l-2 border-gray-200">
                                                                                            <span className="text-xs font-medium text-gray-500">{subKey.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}: </span>
                                                                                            <span className="text-gray-700">
                                                                                                {typeof subValue === 'boolean'
                                                                                                    ? (subValue ? 'Yes' : 'No')
                                                                                                    : Array.isArray(subValue)
                                                                                                        ? subValue.join(', ')
                                                                                                        : (subValue || 'N/A')}
                                                                                            </span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            );
                                                                        } else {
                                                                            displayValue = 'No data';
                                                                        }
                                                                    } catch (e) {
                                                                        displayValue = 'Complex Object';
                                                                    }
                                                                }
                                                            }
                                                        } else {
                                                            // For primitive values (string, number, etc.)
                                                            displayValue = String(value);
                                                        }

                                                        return (
                                                            <div key={key} className="space-y-1">
                                                                <dt className="text-sm font-medium text-gray-500">
                                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                                </dt>
                                                                <dd className="text-sm text-gray-900">
                                                                    {displayValue}
                                                                </dd>
                                                            </div>
                                                        );
                                                    });
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {/* Registration Certificate Additional Data */}
                                {currentDocKey === 'registrationCertificate' && selectedCompany.companyInfo && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h5 className="text-sm font-medium text-gray-700 mb-3">Company Registration Information</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(selectedCompany.companyInfo)
                                                .filter(([key]) => !['registrationCertificate', 'remarks', 'points', 'organizationRoles'].includes(key))
                                                .map(([key, value]) => {
                                                    // Handle different types of values
                                                    let displayValue = 'N/A';

                                                    if (value === null || value === undefined) {
                                                        displayValue = 'N/A';
                                                    } else if (typeof value === 'boolean') {
                                                        displayValue = value ? 'Yes' : 'No';
                                                    } else if (typeof value === 'object') {
                                                        // Handle objects and arrays
                                                        if (Array.isArray(value)) {
                                                            displayValue = value.length ? `${value.length} items` : 'None';
                                                        } else {
                                                            // Handle special case for objects with type, level, validity, _id
                                                            if (value && typeof value === 'object' && 'type' in value && 'level' in value && 'validity' in value && '_id' in value) {
                                                                displayValue = `${value.type || ''} (Level: ${value.level || ''})`;
                                                            } else {
                                                                // For other objects
                                                                try {
                                                                    displayValue = JSON.stringify(value);
                                                                } catch (e) {
                                                                    displayValue = 'Complex Object';
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        // For primitive values
                                                        displayValue = String(value);
                                                    }

                                                    return (
                                                        <div key={key} className="p-3 bg-white rounded border border-gray-100">
                                                            <p className="text-xs font-medium text-gray-500 mb-1">
                                                                {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                                                            </p>
                                                            <p className="text-gray-800">
                                                                {displayValue}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Rating Section Column */}
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                            <h4 className="font-medium text-gray-700">Document Review</h4>
                        </div>
                        <div className="p-4">
                            {/* Document Rating */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating (0-1)
                                </label>
                                <div className="flex flex-col space-y-2">
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.1"
                                        value={documentRating}
                                        onChange={(e) => setDocumentRating(parseFloat(e.target.value))}
                                        className="w-full accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>0.1</span>
                                        <span>0.5</span>
                                        <span>1.0</span>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                                            {documentRating.toFixed(1)}/1.0
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Document Remarks */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks
                                </label>
                                <textarea
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="5"
                                    placeholder="Add your assessment remarks here..."
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-2">
                                <button
                                    type="button"
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    onClick={handleSaveRemark}
                                >
                                    <FaSave className="mr-2" /> Save Rating & Remarks
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    onClick={() => setViewMode('details')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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

    // Filter companies based on current filters
    const filteredCompanies = companies.filter(company => {
        const matchesStatus = filters.status === 'all' || company.status === filters.status;
        const matchesSearch = filters.search === '' ||
            company.companyInfo?.companyName?.toLowerCase().includes(filters.search.toLowerCase()) ||
            company.companyInfo?.registrationNumber?.toLowerCase().includes(filters.search.toLowerCase());

        // Handle type filter (month)
        if (filters.type === 'month') {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const companyDate = new Date(company.lastUpdated);
            return matchesStatus && matchesSearch && companyDate >= lastMonth;
        }

        return matchesStatus && matchesSearch;
    });

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

                    {/* Filter Controls */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search companies..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="submitted">Submitted</option>
                                <option value="reviewed">Reviewed</option>
                            </select>
                        </div>
                        <div>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">All Time</option>
                                <option value="month">Last Month</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-end">
                            <button
                                onClick={() => setFilters({ status: 'all', type: 'all', search: '' })}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center"
                            >
                                <FaFilter className="mr-2" /> Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Companies Table */}
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
                            {filteredCompanies.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        {companies.length === 0 ? 'No company information found' : 'No companies match the current filters'}
                                    </td>
                                </tr>
                            ) : (
                                filteredCompanies.map((company) => (
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
                                            <button
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Chat"
                                                onClick={() => {
                                                    handleOpenChat(company);
                                                    handleDownloadPdf(company);
                                                }}
                                            >
                                                <FaCommentAlt />
                                            </button>
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
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative mx-auto w-full max-w-7xl bg-white rounded-lg shadow-2xl overflow-hidden">
                        {/* Modal Header with gradient background */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-white bg-opacity-25 flex items-center justify-center mr-3">
                                        <FaBuilding className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {selectedCompany.companyInfo?.companyName || 'Company Details'}
                                        </h2>
                                        <p className="text-sm text-blue-100">
                                            {selectedCompany.companyInfo?.registrationNumber || 'No Registration Number'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="text-white hover:text-blue-200 transition-colors"
                                    onClick={handleCloseModal}
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Status and Actions Bar */}
                        <div className="bg-gray-50 px-6 py-3 border-b flex flex-wrap justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClass(selectedCompany.status)}`}>
                                    {selectedCompany.status.charAt(0).toUpperCase() + selectedCompany.status.slice(1)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Submitted: {selectedCompany.lastUpdated ? new Date(selectedCompany.lastUpdated).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="flex space-x-2 mt-2 sm:mt-0">
                                <button
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors flex items-center text-sm"
                                    onClick={() => handleOpenChat(selectedCompany)}
                                >
                                    <FaCommentAlt className="mr-1" /> Chat
                                </button>
                                <button
                                    className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors flex items-center text-sm"
                                    onClick={() => handleStatusChange(selectedCompany._id, 'approved')}
                                >
                                    <FaCheck className="mr-1" /> Approve
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors flex items-center text-sm"
                                    onClick={() => handleStatusChange(selectedCompany._id, 'rejected')}
                                >
                                    <FaTimes className="mr-1" /> Reject
                                </button>
                                <button
                                    className="px-3 py-1 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors flex items-center text-sm"
                                    onClick={() => handleDownloadPdf(selectedCompany)}
                                >
                                    <FaDownload className="mr-1" /> Download PDF
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            {viewMode === 'details' && renderCompanyDetails()}
                            {viewMode === 'document' && renderDocumentView()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyInfoManagement; 