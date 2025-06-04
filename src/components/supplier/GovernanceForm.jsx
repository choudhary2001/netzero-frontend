import { useLocation } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft, FaCheckCircle, FaCloudUploadAlt, FaSpinner, FaDownload } from 'react-icons/fa';
import esgService from '../../services/esgService';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { getMediaUrl } from '../../config';

const GovernanceForm = () => {
    const location = useLocation();
    const [view, setView] = useState(location.search.includes('view=true'));
    const [formData, setFormData] = useState({
        governanceStructure: {
            value: '',
            certificate: null,
            points: 0,
            remarks: ''
        },
        policiesCompliance: {
            value: '',
            certificate: null,
            points: 0,
            remarks: ''
        },
        reportingTargets: {
            value: '',
            certificate: null,
            points: 0,
            remarks: ''
        },
        supplierDueDiligence: {
            value: '',
            certificate: null,
            points: 0,
            remarks: ''
        },
        incidentsRemediation: {
            value: '',
            certificate: null,
            points: 0,
            remarks: ''
        }
    });

    const steps = [
        { id: 'structure', label: 'Governance Structure' },
        { id: 'policies', label: 'Policies & Compliance' },
        { id: 'reporting', label: 'Reporting & Targets' },
        { id: 'supplier', label: 'Supplier Due Diligence' },
        { id: 'incidents', label: 'Incidents & Remediation' }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [fileLabels, setFileLabels] = useState({
        governanceStructure: 'No file chosen',
        policiesCompliance: 'No file chosen',
        reportingTargets: 'No file chosen',
        supplierDueDiligence: 'No file chosen',
        incidentsRemediation: 'No file chosen'
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiReady, setApiReady] = useState(false);
    const [saved, setSaved] = useState({
        governanceStructure: false,
        policiesCompliance: false,
        reportingTargets: false,
        supplierDueDiligence: false,
        incidentsRemediation: false
    });

    // Test API connection when component mounts
    useEffect(() => {
        const testApiConnection = async () => {
            try {
                setLoading(true);
                const response = await esgService.testConnection();

                if (response.success) {
                    console.log('ESG API is accessible and working');
                    setApiReady(true);
                } else {
                    console.error('ESG API test failed:', response.message);
                    toast.error('Could not connect to the ESG service. Please try again later.');
                }
            } catch (error) {
                console.error('Error testing API connection:', error);
                toast.error('Connection to the ESG service failed. Please check if the backend is running.');
            } finally {
                setLoading(false);
            }
        };

        testApiConnection();
    }, []);

    // Fetch existing governance data when API is ready
    useEffect(() => {
        if (!apiReady) return;

        const fetchGovernanceData = async () => {
            try {
                setLoading(true);
                const response = await esgService.getESGData();
                console.log('response', response.data);
                if (response.success && response.data && response.data.governance) {
                    const governanceData = response.data.governance;
                    const newFormData = { ...formData };
                    const newFileLabels = { ...fileLabels };
                    const newSaved = { ...saved };

                    Object.keys(newFormData).forEach(key => {
                        if (governanceData[key]) {
                            newFormData[key] = {
                                value: governanceData[key].value || '',
                                certificate: governanceData[key].certificate || null,
                                points: governanceData[key].points || 0,
                                remarks: governanceData[key].remarks || ''
                            };

                            if (governanceData[key].certificate) {
                                newFileLabels[key] = governanceData[key].certificate.split('/').pop();
                                newSaved[key] = true;
                            }
                        }
                    });

                    setFormData(newFormData);
                    setFileLabels(newFileLabels);
                    setSaved(newSaved);
                    toast.success('Governance data loaded successfully');
                }
            } catch (error) {
                console.error('Error fetching governance data:', error);
                toast.error('Failed to load your governance data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchGovernanceData();
    }, [apiReady]);

    const handleChange = (section, value) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                value
            }
        });
        setSaved({
            ...saved,
            [section]: false
        });
    };

    const handleFileChange = (section, e) => {
        const file = e.target.files[0];
        if (file) {
            setFileLabels({
                ...fileLabels,
                [section]: file.name
            });
            setFormData({
                ...formData,
                [section]: {
                    ...formData[section],
                    certificate: file
                }
            });
            setSaved({
                ...saved,
                [section]: false
            });
        }
    };

    const handleDownload = async (section) => {
        console.log('formData[section].certificate', formData[section].certificate);
        if (formData[section].certificate) {
            try {
                setLoading(true);
                const fileUrl = getMediaUrl(formData[section].certificate);
                console.log('fileUrl', fileUrl);
                const filename = formData[section].certificate.split('/').pop();

                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error('Network response was not ok');

                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);

                toast.success('Download started');
            } catch (error) {
                console.error('Error downloading file:', error);
                toast.error('Error downloading file. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const validateCurrentStep = () => {
        const currentSection = steps[currentStep].id;
        let sectionKey;

        switch (currentSection) {
            case 'structure':
                sectionKey = 'governanceStructure';
                break;
            case 'policies':
                sectionKey = 'policiesCompliance';
                break;
            case 'reporting':
                sectionKey = 'reportingTargets';
                break;
            case 'supplier':
                sectionKey = 'supplierDueDiligence';
                break;
            case 'incidents':
                sectionKey = 'incidentsRemediation';
                break;
            default:
                return true;
        }

        // Check if the value field is empty
        if (!formData[sectionKey].value || formData[sectionKey].value.trim() === '') {
            toast.error(`Please provide details for ${steps[currentStep].label}`);
            return false;
        }

        // Check if certificate is uploaded
        if (!formData[sectionKey].certificate) {
            toast.error(`Please upload supporting documents for ${steps[currentStep].label}`);
            return false;
        }

        return true;
    };

    const validateAllSteps = () => {
        const sections = [
            { key: 'governanceStructure', label: 'Governance Structure' },
            { key: 'policiesCompliance', label: 'Policies & Compliance' },
            { key: 'reportingTargets', label: 'Reporting & Targets' },
            { key: 'supplierDueDiligence', label: 'Supplier Due Diligence' },
            { key: 'incidentsRemediation', label: 'Incidents & Remediation' }
        ];

        for (const section of sections) {
            if (!formData[section.key].value || formData[section.key].value.trim() === '') {
                toast.error(`Please provide details for ${section.label}`);
                return false;
            }
            if (!formData[section.key].certificate) {
                toast.error(`Please upload supporting documents for ${section.label}`);
                return false;
            }
        }

        return true;
    };

    const nextStep = async () => {
        if (currentStep < steps.length - 1) {
            if (!validateCurrentStep()) {
                return;
            }
            await saveCurrentStep();
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const saveCurrentStep = async () => {
        if (!validateCurrentStep()) {
            return;
        }

        try {
            setLoading(true);
            const currentSection = steps[currentStep].id;
            let sectionKey;

            switch (currentSection) {
                case 'structure':
                    sectionKey = 'governanceStructure';
                    break;
                case 'policies':
                    sectionKey = 'policiesCompliance';
                    break;
                case 'reporting':
                    sectionKey = 'reportingTargets';
                    break;
                case 'supplier':
                    sectionKey = 'supplierDueDiligence';
                    break;
                case 'incidents':
                    sectionKey = 'incidentsRemediation';
                    break;
                default:
                    throw new Error('Unknown section');
            }

            let certificateUrl = null;
            if (formData[sectionKey].certificate instanceof File) {
                const uploadResponse = await esgService.uploadCertificate(
                    formData[sectionKey].certificate,
                    'governance',
                    sectionKey
                );

                if (uploadResponse.success) {
                    certificateUrl = uploadResponse.data.filePath;
                }
            }

            const sectionData = {
                value: formData[sectionKey].value,
                certificate: certificateUrl || formData[sectionKey].certificate
            };

            const response = await esgService.updateESGData(
                'governance',
                sectionKey,
                sectionData
            );

            if (response.success) {
                setSaved({
                    ...saved,
                    [sectionKey]: true
                });
                toast.success(`${steps[currentStep].label} information saved successfully`);
            } else {
                toast.error(`Failed to save ${steps[currentStep].label} data`);
            }
        } catch (error) {
            console.error('Error saving governance data:', error);
            toast.error('Error saving data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAllSteps()) {
            return;
        }

        try {
            setSubmitting(true);
            await saveCurrentStep();
            const response = await esgService.submitESGData();
            if (response.success) {
                toast.success('Your governance information has been submitted for review!');
            } else {
                toast.error('Failed to submit data for review');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Error submitting data. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderFileUpload = (section, label, description) => (
        <div className="mt-2 mb-4">
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                {label} <span class="text-red-500">*</span>
            </label>
            <div className="mt-1">
                <input
                    type="file"
                    id={`${section}Certificate`}
                    onChange={(e) => handleFileChange(section, e)}
                    className="hidden"
                    accept="image/*,.pdf"
                    disabled={view}
                />
                <div className="flex items-center space-x-2">
                    <label
                        htmlFor={`${section}Certificate`}
                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white cursor-pointer text-sm sm:text-base transition-colors duration-200"
                    >
                        <FaCloudUploadAlt className="mr-2" />
                        Upload File
                    </label>

                    {formData[section].certificate && typeof formData[section].certificate === 'string' && (
                        <button
                            type="button"
                            onClick={() => handleDownload(section)}
                            disabled={loading}
                            className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white text-sm sm:text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <FaSpinner className="animate-spin mr-2" />
                            ) : (
                                <FaDownload className="mr-2" />
                            )}
                            {loading ? 'Downloading...' : 'Download'}
                        </button>
                    )}
                </div>

                <div className="mt-2">
                    <span className="text-gray-600 text-sm sm:text-base break-all">
                        {fileLabels[section]}
                        {saved[section] && <FaCheckCircle className="ml-2 text-green-500 inline" />}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                        {description}
                    </p>
                </div>

                {formData[section].points > 0 && (
                    <div className="mt-4 space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                        {formData[section].points > 0 && (
                            <div className="flex items-center space-x-2">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Rating</span>
                                        <span className="text-sm font-semibold text-green-600">{formData[section].points.toFixed(2)}/1</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${Math.min(formData[section].points * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {formData[section].remarks && (
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex items-start space-x-2">
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-700 block mb-1">Remarks</span>
                                        <p className="text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                            {formData[section].remarks}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    const renderStepContent = () => {
        const currentSection = steps[currentStep].id;

        switch (currentSection) {
            case 'structure':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Do you have a board-level ESG committee or equivalent oversight body? Who is accountable for ESG performance? <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                disabled={view}
                                value={formData.governanceStructure.value}
                                onChange={(e) => handleChange('governanceStructure', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                                placeholder="Describe your governance structure and accountability"
                            />
                        </div>

                        {renderFileUpload(
                            'governanceStructure',
                            'Upload Supporting Documents',
                            'Committee charter, terms of reference, organizational structure'
                        )}
                    </div>
                );
            case 'policies':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Describe your anti-corruption and anti-bribery policies. Have you conducted any third-party audits or risk assessments? What key compliance policies and procedures do you have in place? <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                disabled={view}
                                value={formData.policiesCompliance.value}
                                onChange={(e) => handleChange('policiesCompliance', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                                placeholder="Describe your policies, compliance framework, and audit processes"
                            />
                        </div>

                        {renderFileUpload(
                            'policiesCompliance',
                            'Upload Supporting Documents',
                            'Policy documents, audit reports, risk assessments, compliance framework'
                        )}
                    </div>
                );
            case 'reporting':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                How often do you report ESG performance to your board and external stakeholders? Which key metrics are included? Have you set any science-based targets (SBTi) or committed to GRI, TCFD, CDP, etc.? <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                disabled={view}
                                value={formData.reportingTargets.value}
                                onChange={(e) => handleChange('reportingTargets', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                                placeholder="Describe your reporting practices and target commitments"
                            />
                        </div>

                        {renderFileUpload(
                            'reportingTargets',
                            'Upload Supporting Documents',
                            'ESG reports, target-setting documentation, framework commitments'
                        )}
                    </div>
                );
            case 'supplier':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Do you screen your suppliers for ESG risks? Summarize your upstream due-diligence process and corrective-action rates. What IT systems or tools do you use to track and verify ESG data? <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                disabled={view}
                                value={formData.supplierDueDiligence.value}
                                onChange={(e) => handleChange('supplierDueDiligence', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                                placeholder="Describe your supplier due diligence process and data systems"
                            />
                        </div>

                        {renderFileUpload(
                            'supplierDueDiligence',
                            'Upload Supporting Documents',
                            'Supplier due diligence reports, system documentation, data tracking tools'
                        )}
                    </div>
                );
            case 'incidents':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Have you faced any material ESG non-compliance or controversies in the last 3 years? Describe the issue and your remediation plan. <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                disabled={view}
                                value={formData.incidentsRemediation.value}
                                onChange={(e) => handleChange('incidentsRemediation', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                                placeholder="Describe any incidents and your remediation approach"
                            />
                        </div>

                        {renderFileUpload(
                            'incidentsRemediation',
                            'Upload Supporting Documents',
                            'Incident reports, corrective action plans, remediation documentation'
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading && Object.values(formData).every(item =>
        item.value === '' &&
        item.certificate === null)) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-green-600 text-4xl" />
                <p className="ml-2 text-gray-600">Loading your data...</p>
            </div>
        );
    }

    if (!apiReady && !loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="font-bold">Connection Error</p>
                    <p>Could not connect to the ESG service. The backend server may not be running.</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="w-full container mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 my-4 sm:my-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-600 mb-2">Governance</h1>
                <p className="text-center text-gray-600 mb-4 sm:mb-6">Fill out your governance practices</p>

                {/* Stepper */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex-1 flex flex-col items-center min-w-[120px]">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index < currentStep
                                        ? 'bg-green-600 text-white'
                                        : index === currentStep
                                            ? 'border-2 border-green-600 text-green-600'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {index < currentStep ? <FaCheckCircle /> : index + 1}
                                </div>
                                <span className={`text-xs mt-1 text-center ${index <= currentStep ? 'text-green-600 font-medium' : 'text-gray-500'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="hidden sm:flex w-full h-1 bg-gray-200 rounded-full mb-6">
                        <div
                            className="h-full bg-green-600 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {renderStepContent()}

                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            onClick={prevStep}
                            className={`px-4 py-2 text-sm sm:text-base rounded-md ${currentStep === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            disabled={currentStep === 0 || loading}
                        >
                            <FaArrowLeft className="inline mr-2" /> Previous
                        </button>

                        <div>
                            <button
                                type="button"
                                onClick={saveCurrentStep}
                                disabled={loading}
                                className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                            >
                                {loading ? <FaSpinner className="inline animate-spin mr-2" /> : null}
                                Save
                            </button>

                            {currentStep === steps.length - 1 ? (
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    {submitting ? <FaSpinner className="inline animate-spin mr-2" /> : null}
                                    Submit for Review
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Next <FaArrowRight className="inline ml-2" />
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GovernanceForm; 