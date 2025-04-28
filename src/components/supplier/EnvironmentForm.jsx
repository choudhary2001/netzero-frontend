import React, { useState } from 'react';
import { FaCloudUploadAlt, FaArrowRight, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

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

    const handleChange = (section, value) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                value
            }
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
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // API call would go here
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
                <span className="text-gray-600 text-sm sm:text-base break-all">{fileLabels[section]}</span>
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

    return (
        <div className="w-full container mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 my-4 sm:my-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-600 mb-2">Environment</h1>
                <p className="text-center text-gray-600 mb-4 sm:mb-6">Ready to jump back in?</p>

                {/* Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex-1 flex flex-col items-center min-w-[150px]">
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
                                {/* {index < steps.length - 1 && (
                                    <div className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-200">
                                        <div
                                            className="h-full bg-green-600"
                                            style={{ width: index < currentStep ? '100%' : '0%' }}
                                        ></div>
                                    </div>
                                )} */}
                            </div>
                        ))}
                    </div>
                    <div className="hidden sm:flex w-full h-1 bg-gray-200 rounded-full mb-8">
                        <div
                            className="h-full bg-green-600 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <h2 className="text-lg sm:text-xl font-bold text-green-600 mb-2">
                            {steps[currentStep].label}
                        </h2>
                        <div className="border-b border-gray-300 mb-4 sm:mb-6"></div>

                        {renderStepContent()}
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            onClick={prevStep}
                            className={`px-4 py-2 flex items-center ${currentStep === 0
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-green-600 hover:text-green-800'
                                }`}
                            disabled={currentStep === 0}
                        >
                            <FaArrowLeft className="mr-2" /> Previous
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 sm:px-8 py-2 sm:py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md flex items-center"
                            >
                                Next <FaArrowRight className="ml-2" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-6 sm:px-8 py-2 sm:py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnvironmentForm; 