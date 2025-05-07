import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaArrowRight, FaArrowLeft, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import esgService from '../../services/esgService';
import { toast } from 'react-toastify';

const EnvironmentForm = () => {
    const [formData, setFormData] = useState({
        renewableEnergy: {
            value: '',
            certificate: null
        },
        waterConsumption: {
            value: '',
            certificate: null
        },
        rainwaterHarvesting: {
            value: '',
            certificate: null
        },
        emissionControl: {
            value: '',
            certificate: null
        },
        resourceConservation: {
            value: '',
            certificate: null
        }
    });

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState({
        renewableEnergy: false,
        waterConsumption: false,
        rainwaterHarvesting: false,
        emissionControl: false,
        resourceConservation: false
    });

    const steps = [
        { id: 'energy', label: 'Renewable Energy' },
        { id: 'water', label: 'Water Consumption' },
        { id: 'rainwater', label: 'Rainwater Harvesting' },
        { id: 'emission', label: 'Emission Control' },
        { id: 'resource', label: 'Resource Conservation' }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [fileLabels, setFileLabels] = useState({
        renewableEnergy: 'No file chosen',
        waterConsumption: 'No file chosen',
        rainwaterHarvesting: 'No file chosen',
        emissionControl: 'No file chosen',
        resourceConservation: 'No file chosen'
    });

    const [apiReady, setApiReady] = useState(false);

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

    // Fetch existing ESG data when API is ready
    useEffect(() => {
        if (!apiReady) return;

        const fetchESGData = async () => {
            try {
                setLoading(true);
                const response = await esgService.getESGData();

                // The service now returns a consistent response structure even on errors
                if (response.success && response.data && response.data.environment) {
                    // Update form data with existing values
                    const envData = response.data.environment;
                    const updatedFormData = { ...formData };
                    const updatedFileLabels = { ...fileLabels };
                    const updatedSaved = { ...saved };

                    // Populate each section if it exists
                    Object.keys(formData).forEach(key => {
                        if (envData[key]) {
                            updatedFormData[key].value = envData[key].value || '';
                            updatedFileLabels[key] = envData[key].certificate ? 'Certificate uploaded' : 'No file chosen';
                            updatedSaved[key] = true;
                        }
                    });

                    setFormData(updatedFormData);
                    setFileLabels(updatedFileLabels);
                    setSaved(updatedSaved);
                } else if (!response.success) {
                    // Show a more user-friendly message for first-time users
                    console.log('No existing data found or server error:', response.message);
                    // We don't show an error toast for first-time users with no data
                    if (response.message && !response.message.includes('404')) {
                        toast.info('Start by filling out your environmental metrics');
                    }
                }
            } catch (error) {
                console.error('Error fetching ESG data:', error);
                toast.error('Failed to load your previous data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchESGData();
    }, [apiReady]);

    const handleChange = (section, value) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                value
            }
        });

        // Reset saved status when field is modified
        if (saved[section]) {
            setSaved({
                ...saved,
                [section]: false
            });
        }
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

            // Reset saved status when file is changed
            if (saved[section]) {
                setSaved({
                    ...saved,
                    [section]: false
                });
            }
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            // Save current section before proceeding
            saveCurrentSection();
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Save the current section data
    const saveCurrentSection = async () => {
        try {
            const currentSection = getCurrentSectionKey();
            setLoading(true);

            // First upload certificate if available
            let certificateUrl = null;
            if (formData[currentSection].certificate && formData[currentSection].certificate instanceof File) {
                const uploadResponse = await esgService.uploadCertificate(
                    formData[currentSection].certificate,
                    'environment',
                    currentSection
                );

                if (uploadResponse.success) {
                    certificateUrl = uploadResponse.data.filePath;
                }
            }

            // Prepare data for API
            const sectionData = {
                value: formData[currentSection].value,
                certificate: certificateUrl || formData[currentSection].certificate
            };

            // Update ESG data
            const response = await esgService.updateESGData(
                'environment',
                currentSection,
                sectionData
            );

            if (response.success) {
                setSaved({
                    ...saved,
                    [currentSection]: true
                });
                toast.success(`${steps[currentStep].label} information saved`);
            } else {
                toast.error('Failed to save section data');
            }
        } catch (error) {
            console.error('Error saving section:', error);
            toast.error('Error saving data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get the current section key based on step
    const getCurrentSectionKey = () => {
        const currentSectionId = steps[currentStep].id;

        switch (currentSectionId) {
            case 'energy': return 'renewableEnergy';
            case 'water': return 'waterConsumption';
            case 'rainwater': return 'rainwaterHarvesting';
            case 'emission': return 'emissionControl';
            case 'resource': return 'resourceConservation';
            default: return 'renewableEnergy';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            // Save current section first
            await saveCurrentSection();

            // Submit the entire ESG data for review
            const response = await esgService.submitESGData();

            if (response.success) {
                toast.success('Your environmental data has been submitted for review!');
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
            case 'energy':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                What portion of your energy consumption is from renewable sources (in kWh/month or as a percentage)?
                            </label>
                            <input
                                type="text"
                                value={formData.renewableEnergy.value}
                                onChange={(e) => handleChange('renewableEnergy', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter value (e.g., 500 kWh/month or 30%)"
                            />
                        </div>

                        {renderFileUpload(
                            'renewableEnergy',
                            'Upload Supporting Documents',
                            'Renewable energy certificates, generation data (solar, wind), etc.'
                        )}
                    </div>
                );
            case 'water':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                What is your facility's total water consumption (in cubic meters/month or year)?
                            </label>
                            <input
                                type="text"
                                value={formData.waterConsumption.value}
                                onChange={(e) => handleChange('waterConsumption', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter value (e.g., 200 m³/month)"
                            />
                        </div>

                        {renderFileUpload(
                            'waterConsumption',
                            'Upload Supporting Documents',
                            'Water bills, meter readings, water audit reports, etc.'
                        )}
                    </div>
                );
            case 'rainwater':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Are you practicing rainwater harvesting? If yes, what is the total volume collected (in cubic meters)?
                            </label>
                            <input
                                type="text"
                                value={formData.rainwaterHarvesting.value}
                                onChange={(e) => handleChange('rainwaterHarvesting', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter value (e.g., Yes, 50 m³/year or No)"
                            />
                        </div>

                        {renderFileUpload(
                            'rainwaterHarvesting',
                            'Upload Supporting Documents',
                            'System design documents, collection logs, maintenance records, etc.'
                        )}
                    </div>
                );
            case 'emission':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Are systems in place to manage emissions, effluent discharges, and waste per local norms?
                            </label>
                            <input
                                type="text"
                                value={formData.emissionControl.value}
                                onChange={(e) => handleChange('emissionControl', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter details of your systems"
                            />
                        </div>

                        {renderFileUpload(
                            'emissionControl',
                            'Upload Supporting Documents',
                            'Compliance certificates, environmental audit reports, training records, etc.'
                        )}
                    </div>
                );
            case 'resource':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Are targets set to reduce non-renewable resource use and maximize renewable?
                            </label>
                            <input
                                type="text"
                                value={formData.resourceConservation.value}
                                onChange={(e) => handleChange('resourceConservation', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your conservation targets and methods"
                            />
                        </div>

                        {renderFileUpload(
                            'resourceConservation',
                            'Upload Supporting Documents',
                            'Resource consumption logs, conservation targets, training records, etc.'
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading && Object.values(formData).every(item => !item.value)) {
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
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-600 mb-2">Environment</h1>
                <p className="text-center text-gray-600 mb-4 sm:mb-6">Fill out your environmental metrics</p>

                {/* Stepper */}
                <div className="mb-6 sm:mb-8">
                    <ol className="flex items-center w-full space-x-2 sm:space-x-4">
                        {steps.map((step, index) => (
                            <li key={step.id} className={`flex items-center space-x-1 sm:space-x-2 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                                <span className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shrink-0 ${index <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                    {index + 1}
                                </span>
                                <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-500">
                                    {step.label}
                                </span>
                                {index < steps.length - 1 && (
                                    <span className="flex-1 h-0.5 w-full bg-gray-200 border-dashed"></span>
                                )}
                            </li>
                        ))}
                    </ol>
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
                                onClick={saveCurrentSection}
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

export default EnvironmentForm; 