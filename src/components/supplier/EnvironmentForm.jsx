import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaArrowRight, FaArrowLeft, FaCheckCircle, FaSpinner, FaDownload } from 'react-icons/fa';
import esgService from '../../services/esgService';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { getMediaUrl } from '../../config';

const EnvironmentForm = () => {
    const location = useLocation();
    const [view, setView] = useState(location.search.includes('view=true'));
    const [formData, setFormData] = useState({
        renewableEnergy: {
            value: '',  // kWh/month or percentage
            certificate: null,
            points: 0,
            remarks: '',
            lastUpdated: new Date()
        },
        waterConsumption: {
            baseline: '',  // Baseline water consumption
            targets: '',   // Water reduction targets
            progress: '',  // Progress towards targets
            certificate: null,
            points: 0,
            remarks: '',
            lastUpdated: new Date()
        },
        rainwaterHarvesting: {
            volume: '',  // Annual volume in kL/yr
            rechargeCapacity: '',  // Recharge capacity
            infrastructure: '',  // Infrastructure details
            maintenance: '',  // Maintenance process
            certificate: null,
            points: 0,
            remarks: '',
            lastUpdated: new Date()
        },
        emissionControl: {
            chemicalManagement: '',  // Chemical management and disposal methods
            chemicalList: [],  // List of chemicals
            disposalMethods: [],  // Disposal methods
            eiaReports: '',  // Environmental Impact Assessment reports
            lcaReports: '',  // Life Cycle Assessment reports
            certificate: null,
            points: 0,
            remarks: '',
            lastUpdated: new Date()
        },
        resourceConservation: {
            wasteDiversion: '',  // Percentage of waste diverted
            packagingMeasures: '',  // Packaging impact measures
            certifications: [],  // Environmental certifications
            certificate: null,
            points: 0,
            remarks: '',
            lastUpdated: new Date()
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
        { id: 'renewableEnergy', label: 'Renewable Energy' },
        { id: 'waterConsumption', label: 'Water Consumption' },
        { id: 'rainwaterHarvesting', label: 'Rainwater Harvesting' },
        { id: 'emissionControl', label: 'Emission Control' },
        { id: 'resourceConservation', label: 'Resource Conservation' }
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
                console.log(response);
                if (response.success && response.data && response.data.environment) {
                    // Update form data with existing values
                    const envData = response.data.environment;
                    const updatedFormData = { ...formData };
                    const updatedFileLabels = { ...fileLabels };
                    const updatedSaved = { ...saved };

                    // Populate each section if it exists
                    Object.keys(formData).forEach(key => {
                        if (envData[key]) {
                            updatedFormData[key] = {
                                ...envData[key],
                                lastUpdated: new Date()
                            };

                            if (envData[key].certificate) {
                                updatedFileLabels[key] = envData[key].certificate.split('/').pop();
                                updatedSaved[key] = true;
                            }
                        }
                    });

                    setFormData(updatedFormData);
                    setFileLabels(updatedFileLabels);
                    setSaved(updatedSaved);
                } else if (!response.success) {
                    console.log('No existing data found or server error:', response.message);
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

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
                lastUpdated: new Date()
            }
        }));

        if (saved[section]) {
            setSaved(prev => ({
                ...prev,
                [section]: false
            }));
        }
    };

    const handleArrayChange = (section, field, value, index) => {
        setFormData(prev => {
            const newArray = [...(prev[section][field] || [])];
            if (index !== undefined) {
                newArray[index] = value;
            } else {
                newArray.push(value);
            }
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: newArray,
                    lastUpdated: new Date()
                }
            };
        });

        if (saved[section]) {
            setSaved(prev => ({
                ...prev,
                [section]: false
            }));
        }
    };

    const removeArrayItem = (section, field, index) => {
        setFormData(prev => {
            const newArray = [...prev[section][field]];
            newArray.splice(index, 1);
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: newArray,
                    lastUpdated: new Date()
                }
            };
        });

        if (saved[section]) {
            setSaved(prev => ({
                ...prev,
                [section]: false
            }));
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
            setSaved({
                ...saved,
                [section]: false
            });
        }
    };

    const nextStep = async () => {
        if (currentStep < steps.length - 1) {
            if (validateCurrentSection()) {
                // Save current data before proceeding
                await saveCurrentSection();
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Add validation function to check if the current section is complete
    const validateCurrentSection = () => {
        const currentSection = getCurrentSectionKey();
        const sectionData = formData[currentSection];

        switch (currentSection) {
            case 'renewableEnergy':
                if (!sectionData.value || sectionData.value.trim() === '') {
                    toast.error('Please enter renewable energy consumption value');
                    return false;
                }
                break;

            case 'waterConsumption':
                if (!sectionData.baseline || sectionData.baseline.trim() === '') {
                    toast.error('Please enter baseline water consumption');
                    return false;
                }
                if (!sectionData.targets || sectionData.targets.trim() === '') {
                    toast.error('Please describe water reduction targets');
                    return false;
                }
                break;

            case 'rainwaterHarvesting':
                if (!sectionData.volume || sectionData.volume.trim() === '') {
                    toast.error('Please enter annual rainwater harvested volume');
                    return false;
                }
                if (!sectionData.infrastructure || sectionData.infrastructure.trim() === '') {
                    toast.error('Please describe harvesting infrastructure');
                    return false;
                }
                break;

            case 'emissionControl':
                if (!sectionData.chemicalManagement || sectionData.chemicalManagement.trim() === '') {
                    toast.error('Please describe chemical management');
                    return false;
                }
                if (!Array.isArray(sectionData.chemicalList) || sectionData.chemicalList.length === 0) {
                    toast.error('Please add at least one chemical to the list');
                    return false;
                }
                break;

            case 'resourceConservation':
                if (!sectionData.wasteDiversion || sectionData.wasteDiversion.trim() === '') {
                    toast.error('Please enter waste diversion percentage');
                    return false;
                }
                if (!sectionData.packagingMeasures || sectionData.packagingMeasures.trim() === '') {
                    toast.error('Please describe packaging impact measures');
                    return false;
                }
                break;
        }

        return true;
    };

    // Update the saveCurrentSection function to validate before saving
    const saveCurrentSection = async () => {
        try {
            const currentSection = getCurrentSectionKey();

            // Validate current section data
            if (!validateCurrentSection()) {
                return;
            }

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

            // Prepare data for API based on current section
            let sectionData;

            switch (currentSection) {
                case 'renewableEnergy':
                    sectionData = {
                        value: formData[currentSection].value,
                        certificate: certificateUrl || formData[currentSection].certificate,
                        remarks: formData[currentSection].remarks || '',
                        points: formData[currentSection].points || 0,
                        lastUpdated: new Date()
                    };
                    break;

                case 'waterConsumption':
                    sectionData = {
                        baseline: formData[currentSection].baseline,
                        targets: formData[currentSection].targets,
                        progress: formData[currentSection].progress,
                        certificate: certificateUrl || formData[currentSection].certificate,
                        remarks: formData[currentSection].remarks || '',
                        points: formData[currentSection].points || 0,
                        lastUpdated: new Date()
                    };
                    break;

                case 'rainwaterHarvesting':
                    sectionData = {
                        volume: formData[currentSection].volume,
                        rechargeCapacity: formData[currentSection].rechargeCapacity,
                        infrastructure: formData[currentSection].infrastructure,
                        maintenance: formData[currentSection].maintenance,
                        certificate: certificateUrl || formData[currentSection].certificate,
                        remarks: formData[currentSection].remarks || '',
                        points: formData[currentSection].points || 0,
                        lastUpdated: new Date()
                    };
                    break;

                case 'emissionControl':
                    sectionData = {
                        chemicalManagement: formData[currentSection].chemicalManagement,
                        chemicalList: formData[currentSection].chemicalList || [],
                        disposalMethods: formData[currentSection].disposalMethods || [],
                        eiaReports: formData[currentSection].eiaReports,
                        lcaReports: formData[currentSection].lcaReports,
                        certificate: certificateUrl || formData[currentSection].certificate,
                        remarks: formData[currentSection].remarks || '',
                        points: formData[currentSection].points || 0,
                        lastUpdated: new Date()
                    };
                    break;

                case 'resourceConservation':
                    sectionData = {
                        wasteDiversion: formData[currentSection].wasteDiversion,
                        packagingMeasures: formData[currentSection].packagingMeasures,
                        certifications: formData[currentSection].certifications || [],
                        certificate: certificateUrl || formData[currentSection].certificate,
                        remarks: formData[currentSection].remarks || '',
                        points: formData[currentSection].points || 0,
                        lastUpdated: new Date()
                    };
                    break;

                default:
                    // Fallback to basic structure if unknown section
                    sectionData = {
                        value: formData[currentSection].value,
                        certificate: certificateUrl || formData[currentSection].certificate,
                        remarks: formData[currentSection].remarks || '',
                        points: formData[currentSection].points || 0,
                        lastUpdated: new Date()
                    };
            }

            console.log('Saving data for section:', currentSection, sectionData);

            // Update ESG data
            const response = await esgService.updateESGData(
                'environment',
                currentSection,
                sectionData
            );

            if (response.success) {
                // Update formData with any changes from server (like certificateUrl)
                setFormData(prev => ({
                    ...prev,
                    [currentSection]: {
                        ...prev[currentSection],
                        certificate: certificateUrl || prev[currentSection].certificate
                    }
                }));

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
            case 'renewableEnergy': return 'renewableEnergy';
            case 'waterConsumption': return 'waterConsumption';
            case 'rainwaterHarvesting': return 'rainwaterHarvesting';
            case 'emissionControl': return 'emissionControl';
            case 'resourceConservation': return 'resourceConservation';
            default: return 'renewableEnergy';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            // Validate current section first
            if (!validateCurrentSection()) {
                setSubmitting(false);
                return;
            }

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

    // Update download handler to force download
    const handleDownload = async (section) => {
        if (formData[section].certificate && typeof formData[section].certificate === 'string') {
            try {
                setLoading(true);
                const fileUrl = getMediaUrl(formData[section].certificate);
                const filename = formData[section].certificate.split('/').pop();

                // Fetch the file
                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error('Network response was not ok');

                // Get the blob from the response
                const blob = await response.blob();

                // Create a blob URL
                const blobUrl = window.URL.createObjectURL(blob);

                // Create a temporary link and trigger download
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename; // Force download with filename
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();

                // Clean up
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

    // Helper function to render file upload section
    const renderFileUpload = (section, label, description, remarks, points) => (
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

                {/* Rating and Remarks Container */}
                {points > 0 && (
                    <div className="mt-4 space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                        {points > 0 && (
                            <div className="flex items-center space-x-2">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Rating</span>
                                        <span className="text-sm font-semibold text-green-600">{points.toFixed(2)}/1</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${Math.min(points * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {remarks && (
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex items-start space-x-2">
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-700 block mb-1">Remarks</span>
                                        <p className="text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                            {remarks}
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

    // Current section content based on step
    const renderStepContent = () => {
        const currentSection = getCurrentSectionKey();
        const sectionData = formData[currentSection];

        switch (currentSection) {
            case 'renewableEnergy':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Renewable Energy Consumption
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type="number"
                                    value={sectionData.value}
                                    onChange={(e) => handleChange('renewableEnergy', 'value', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2 pr-24"
                                    placeholder="Enter renewable energy consumption"
                                    disabled={view}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">kWh/month</span>
                                </div>
                            </div>
                        </div>
                        {renderFileUpload('renewableEnergy', 'Renewable Energy Documents',
                            'Upload renewable energy certificates', sectionData.remarks, sectionData.points)}
                    </div>
                );

            case 'waterConsumption':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Baseline Water Consumption
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type="number"
                                    value={sectionData.baseline}
                                    onChange={(e) => handleChange('waterConsumption', 'baseline', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2 pr-24"
                                    placeholder="Enter baseline water consumption"
                                    disabled={view}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">kL/month</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Water Reduction Targets
                            </label>
                            <textarea
                                value={sectionData.targets}
                                onChange={(e) => handleChange('waterConsumption', 'targets', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your water reduction targets"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Progress Towards Targets
                            </label>
                            <textarea
                                value={sectionData.progress}
                                onChange={(e) => handleChange('waterConsumption', 'progress', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your progress towards water reduction targets"
                                disabled={view}
                            />
                        </div>
                        {renderFileUpload('waterConsumption', 'Water Consumption Documents',
                            'Upload water-use policy or monitoring data', sectionData.remarks, sectionData.points)}
                    </div>
                );

            case 'rainwaterHarvesting':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Annual Rainwater Harvested Volume
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type="number"
                                    value={sectionData.volume}
                                    onChange={(e) => handleChange('rainwaterHarvesting', 'volume', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2 pr-16"
                                    placeholder="Enter annual volume"
                                    disabled={view}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">kL/yr</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Recharge Capacity
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type="number"
                                    value={sectionData.rechargeCapacity}
                                    onChange={(e) => handleChange('rainwaterHarvesting', 'rechargeCapacity', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2 pr-16"
                                    placeholder="Enter recharge capacity"
                                    disabled={view}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">kL/day</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Infrastructure Details
                            </label>
                            <textarea
                                value={sectionData.infrastructure}
                                onChange={(e) => handleChange('rainwaterHarvesting', 'infrastructure', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your harvesting infrastructure"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Maintenance Process
                            </label>
                            <textarea
                                value={sectionData.maintenance}
                                onChange={(e) => handleChange('rainwaterHarvesting', 'maintenance', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your maintenance process"
                                disabled={view}
                            />
                        </div>
                        {renderFileUpload('rainwaterHarvesting', 'Rainwater Harvesting Documents',
                            'Upload rainwater-harvesting design docs, monitoring reports', sectionData.remarks, sectionData.points)}
                    </div>
                );

            case 'emissionControl':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Chemical Management
                            </label>
                            <textarea
                                value={sectionData.chemicalManagement}
                                onChange={(e) => handleChange('emissionControl', 'chemicalManagement', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your chemical management and disposal methods"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Chemical List
                            </label>
                            <div className="space-y-2">
                                {sectionData.chemicalList.map((chemical, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={chemical}
                                            onChange={(e) => handleArrayChange('emissionControl', 'chemicalList', e.target.value, index)}
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                            placeholder="Enter chemical name"
                                            disabled={view}
                                        />
                                        {!view && (
                                            <button
                                                onClick={() => removeArrayItem('emissionControl', 'chemicalList', index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!view && (
                                    <button
                                        onClick={() => handleArrayChange('emissionControl', 'chemicalList', '')}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        Add Chemical
                                    </button>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Disposal Methods
                            </label>
                            <div className="space-y-2">
                                {sectionData.disposalMethods.map((method, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={method}
                                            onChange={(e) => handleArrayChange('emissionControl', 'disposalMethods', e.target.value, index)}
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                            placeholder="Enter disposal method"
                                            disabled={view}
                                        />
                                        {!view && (
                                            <button
                                                onClick={() => removeArrayItem('emissionControl', 'disposalMethods', index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!view && (
                                    <button
                                        onClick={() => handleArrayChange('emissionControl', 'disposalMethods', '')}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        Add Method
                                    </button>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Environmental Impact Assessment Reports
                            </label>
                            <textarea
                                value={sectionData.eiaReports}
                                onChange={(e) => handleChange('emissionControl', 'eiaReports', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your EIA reports"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Life Cycle Assessment Reports
                            </label>
                            <textarea
                                value={sectionData.lcaReports}
                                onChange={(e) => handleChange('emissionControl', 'lcaReports', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your LCA reports"
                                disabled={view}
                            />
                        </div>
                        {renderFileUpload('emissionControl', 'Emission Control Documents',
                            'Upload chemical inventories, EIA/LCA reports', sectionData.remarks, sectionData.points)}
                    </div>
                );

            case 'resourceConservation':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Waste Diversion Percentage
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type="number"
                                    value={sectionData.wasteDiversion}
                                    onChange={(e) => handleChange('resourceConservation', 'wasteDiversion', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2 pr-16"
                                    placeholder="Enter percentage of waste diverted"
                                    min="0"
                                    max="100"
                                    disabled={view}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Packaging Impact Measures
                            </label>
                            <textarea
                                value={sectionData.packagingMeasures}
                                onChange={(e) => handleChange('resourceConservation', 'packagingMeasures', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your packaging impact measures"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Environmental Certifications
                            </label>
                            <div className="space-y-2">
                                {sectionData.certifications.map((cert, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={cert}
                                            onChange={(e) => handleArrayChange('resourceConservation', 'certifications', e.target.value, index)}
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                            placeholder="Enter certification name"
                                            disabled={view}
                                        />
                                        {!view && (
                                            <button
                                                onClick={() => removeArrayItem('resourceConservation', 'certifications', index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!view && (
                                    <button
                                        onClick={() => handleArrayChange('resourceConservation', 'certifications', '')}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        Add Certification
                                    </button>
                                )}
                            </div>
                        </div>
                        {renderFileUpload('resourceConservation', 'Resource Conservation Documents',
                            'Upload waste-management report, packaging policy, certification documents', sectionData.remarks, sectionData.points)}
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
                                    {index < currentStep ? <FaCheckCircle /> : index + 1}
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