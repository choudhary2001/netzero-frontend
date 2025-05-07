import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft, FaCheckCircle, FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import esgService from '../../services/esgService';
import { toast } from 'react-toastify';

const GovernanceForm = () => {
    const [formData, setFormData] = useState({
        deliveryPerformance: {
            value: '',
            certificate: null
        },
        qualityManagement: {
            value: '',
            certificate: null
        },
        processControl: {
            value: '',
            certificate: null
        },
        materialManagement: {
            value: '',
            certificate: null
        },
        maintenanceCalibration: {
            value: '',
            certificate: null
        },
        technologyUpgradation: {
            value: '',
            certificate: null
        }
    });

    const steps = [
        { id: 'delivery', label: 'Delivery Performance' },
        { id: 'quality', label: 'Quality Management' },
        { id: 'process', label: 'Process Control' },
        { id: 'material', label: 'Material Management' },
        { id: 'maintenance', label: 'Maintenance & Calibration' },
        { id: 'technology', label: 'Technology Upgradation' }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [fileLabels, setFileLabels] = useState({
        deliveryPerformance: 'No file chosen',
        qualityManagement: 'No file chosen',
        processControl: 'No file chosen',
        materialManagement: 'No file chosen',
        maintenanceCalibration: 'No file chosen',
        technologyUpgradation: 'No file chosen'
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiReady, setApiReady] = useState(false);
    const [saved, setSaved] = useState({
        deliveryPerformance: false,
        qualityManagement: false,
        processControl: false,
        materialManagement: false,
        maintenanceCalibration: false,
        technologyUpgradation: false
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

                if (response.success && response.data && response.data.governance) {
                    // Update form data with existing values
                    const governanceData = response.data.governance;

                    // Create a new state object to update
                    const newFormData = { ...formData };
                    const newFileLabels = { ...fileLabels };
                    const newSaved = { ...saved };

                    // Update each section if it exists
                    Object.keys(newFormData).forEach(key => {
                        if (governanceData[key]) {
                            newFormData[key] = {
                                value: governanceData[key].value || '',
                                certificate: governanceData[key].certificate || null
                            };

                            if (governanceData[key].certificate) {
                                newFileLabels[key] = 'Certificate uploaded';
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

    const nextStep = async () => {
        if (currentStep < steps.length - 1) {
            // Save current data before proceeding
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
        try {
            setLoading(true);
            const currentSection = steps[currentStep].id;
            let sectionKey;

            // Map the step ID to the corresponding formData key
            switch (currentSection) {
                case 'delivery':
                    sectionKey = 'deliveryPerformance';
                    break;
                case 'quality':
                    sectionKey = 'qualityManagement';
                    break;
                case 'process':
                    sectionKey = 'processControl';
                    break;
                case 'material':
                    sectionKey = 'materialManagement';
                    break;
                case 'maintenance':
                    sectionKey = 'maintenanceCalibration';
                    break;
                case 'technology':
                    sectionKey = 'technologyUpgradation';
                    break;
                default:
                    throw new Error('Unknown section');
            }

            // First upload certificate if available and it's a File object
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

            // Prepare data for API
            const sectionData = {
                value: formData[sectionKey].value,
                certificate: certificateUrl || formData[sectionKey].certificate
            };

            // Update ESG data for this section
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

        try {
            setSubmitting(true);

            // First save the current step
            await saveCurrentStep();

            // Then submit the entire ESG data for review
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

    // Helper function to render file upload section
    const renderFileUpload = (section, label, description) => (
        <div className="mt-2 mb-4">
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                {label}
            </label>
            <div className="mt-1">
                <input
                    type="file"
                    id={`${section}Certificate`}
                    onChange={(e) => handleFileChange(section, e)}
                    className="hidden"
                    accept="image/*,.pdf"
                />
                <label
                    htmlFor={`${section}Certificate`}
                    className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white cursor-pointer mr-2 sm:mr-3 text-sm sm:text-base"
                >
                    <FaCloudUploadAlt className="mr-2" />
                    Upload File
                </label>
                <span className="text-gray-600 text-sm sm:text-base break-all">
                    {fileLabels[section]}
                    {saved[section] && <FaCheckCircle className="ml-2 text-green-500 inline" />}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                    {description}
                </p>
            </div>
        </div>
    );

    // Current section content based on step
    const renderStepContent = () => {
        const currentSection = steps[currentStep].id;

        switch (currentSection) {
            case 'delivery':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Is delivery performance monitored and periodically reviewed by management?
                            </label>
                            <input
                                type="text"
                                value={formData.deliveryPerformance.value}
                                onChange={(e) => handleChange('deliveryPerformance', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your delivery performance monitoring"
                            />
                        </div>

                        {renderFileUpload(
                            'deliveryPerformance',
                            'Upload Supporting Documents',
                            'Delivery metrics, review meeting notes, corrective action logs, etc.'
                        )}
                    </div>
                );
            case 'quality':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Are quality standards defined and are testing/certification processes in place?
                            </label>
                            <input
                                type="text"
                                value={formData.qualityManagement.value}
                                onChange={(e) => handleChange('qualityManagement', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your quality management standards"
                            />
                        </div>

                        {renderFileUpload(
                            'qualityManagement',
                            'Upload Supporting Documents',
                            'Quality manuals, audit reports, testing certificates, CAPA logs etc.'
                        )}
                    </div>
                );
            case 'process':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Are SOPs established for critical processes with continuous monitoring and periodic reviews?
                            </label>
                            <input
                                type="text"
                                value={formData.processControl.value}
                                onChange={(e) => handleChange('processControl', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your process control procedures"
                            />
                        </div>

                        {renderFileUpload(
                            'processControl',
                            'Upload Supporting Documents',
                            'Process documents, monitoring logs, review reports, etc.'
                        )}
                    </div>
                );
            case 'material':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Is there a plan for optimal inventory control and proper material handling?
                            </label>
                            <input
                                type="text"
                                value={formData.materialManagement.value}
                                onChange={(e) => handleChange('materialManagement', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your material management practices"
                            />
                        </div>

                        {renderFileUpload(
                            'materialManagement',
                            'Upload Supporting Documents',
                            'Inventory records, handling SOPs, storage audit reports, etc.'
                        )}
                    </div>
                );
            case 'maintenance':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Are preventive maintenance and calibration plans implemented with MTTR/MTBF tracking?
                            </label>
                            <input
                                type="text"
                                value={formData.maintenanceCalibration.value}
                                onChange={(e) => handleChange('maintenanceCalibration', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your maintenance and calibration processes"
                            />
                        </div>

                        {renderFileUpload(
                            'maintenanceCalibration',
                            'Upload Supporting Documents',
                            'Maintenance schedules, calibration records, audit logs, etc.'
                        )}
                    </div>
                );
            case 'technology':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Is there a proactive plan for technology upgrades, including digital tools (IoT, sensors, smart machines)?
                            </label>
                            <input
                                type="text"
                                value={formData.technologyUpgradation.value}
                                onChange={(e) => handleChange('technologyUpgradation', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your technology upgradation plans"
                            />
                        </div>

                        {renderFileUpload(
                            'technologyUpgradation',
                            'Upload Supporting Documents',
                            'Technology roadmaps, upgrade plans, digital transformation initiatives, etc.'
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
                <p className="text-center text-gray-600 mb-4 sm:mb-6">Please fill out information about your governance practices</p>

                {/* Stepper */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex-1 flex flex-col items-center min-w-[100px]">
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
                            className={`px-4 py-2 text-sm sm:text-base rounded-md ${currentStep === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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