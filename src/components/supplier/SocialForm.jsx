import React, { useState } from 'react';
import { FaArrowRight, FaArrowLeft, FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';

const SocialForm = () => {
    const [formData, setFormData] = useState({
        swachhWorkplace: {
            value: '',
            certificate: null
        },
        occupationalSafety: {
            value: '',
            certificate: null
        },
        hrManagement: {
            value: '',
            certificate: null
        },
        csrResponsibility: {
            value: '',
            certificate: null
        }
    });

    const steps = [
        { id: 'swachh', label: 'Swachh Workplace' },
        { id: 'safety', label: 'Occupational Safety' },
        { id: 'hr', label: 'HR Management' },
        { id: 'csr', label: 'CSR & Social Responsibilities' }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [fileLabels, setFileLabels] = useState({
        swachhWorkplace: 'No file chosen',
        occupationalSafety: 'No file chosen',
        hrManagement: 'No file chosen',
        csrResponsibility: 'No file chosen'
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
            case 'swachh':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Are cleaning and hygiene SOPs in place and is the workplace maintained as per guidelines?
                            </label>
                            <input
                                type="text"
                                value={formData.swachhWorkplace.value}
                                onChange={(e) => handleChange('swachhWorkplace', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your workplace cleanliness practices"
                            />
                        </div>

                        {renderFileUpload(
                            'swachhWorkplace',
                            'Upload Supporting Documents',
                            'Cleaning SOP documents, audit reports, training records'
                        )}
                    </div>
                );
            case 'safety':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Is there a formal safety policy with regular training, PPE usage, mock drills, and incident reporting?
                            </label>
                            <input
                                type="text"
                                value={formData.occupationalSafety.value}
                                onChange={(e) => handleChange('occupationalSafety', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your occupational safety measures"
                            />
                        </div>

                        {renderFileUpload(
                            'occupationalSafety',
                            'Upload Supporting Documents',
                            'Safety policy, training logs, drill/incident reports'
                        )}
                    </div>
                );
            case 'hr':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Are HR processes defined, including employee induction, skill mapping, and training & engagement programs?
                            </label>
                            <input
                                type="text"
                                value={formData.hrManagement.value}
                                onChange={(e) => handleChange('hrManagement', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your HR management practices"
                            />
                        </div>

                        {renderFileUpload(
                            'hrManagement',
                            'Upload Supporting Documents',
                            'HR policies, training records, skill mapping documents'
                        )}
                    </div>
                );
            case 'csr':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                                Is there a CSR policy with action plans addressing governance, labor, environment, and community development?
                            </label>
                            <input
                                type="text"
                                value={formData.csrResponsibility.value}
                                onChange={(e) => handleChange('csrResponsibility', e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe your CSR policy and activities"
                            />
                        </div>

                        {renderFileUpload(
                            'csrResponsibility',
                            'Upload Supporting Documents',
                            'CSR policy documents, action plans, community engagement records'
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full container mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-4 ">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-600 mb-2">Social</h1>
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

export default SocialForm; 