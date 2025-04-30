import React, { useState } from 'react';
import { FaPlus, FaTrash, FaArrowRight, FaArrowLeft, FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';

const CompanyInfoForm = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        registrationNumber: '',
        establishmentYear: '',
        companyAddress: '',
        businessType: '',
        registrationCertificate: null,
        rolesDefinedClearly: '',
        organizationRoles: [
            { role: '', responsibility: '' }
        ],
        certificates: [
            { type: '', level: '', validity: '' }
        ]
    });

    const steps = [
        { id: 'basic', label: 'Basic Company Details' },
        { id: 'leadership', label: 'Leadership/Organization' },
        { id: 'sustainability', label: 'Sustainability Certificate' }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [fileLabel, setFileLabel] = useState('Choose profile photo');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileLabel(file.name);
            setFormData({
                ...formData,
                registrationCertificate: file
            });
        }
    };

    const handleCertificateChange = (index, field, value) => {
        const updatedCertificates = [...formData.certificates];
        updatedCertificates[index] = {
            ...updatedCertificates[index],
            [field]: value
        };
        setFormData({
            ...formData,
            certificates: updatedCertificates
        });
    };

    const addCertificate = () => {
        setFormData({
            ...formData,
            certificates: [...formData.certificates, { type: '', level: '', validity: '' }]
        });
    };

    const removeCertificate = (index) => {
        const certificates = [...formData.certificates];
        certificates.splice(index, 1);
        setFormData({
            ...formData,
            certificates
        });
    };

    const handleRoleChange = (index, field, value) => {
        const updatedRoles = [...formData.organizationRoles];
        updatedRoles[index] = {
            ...updatedRoles[index],
            [field]: value
        };
        setFormData({
            ...formData,
            organizationRoles: updatedRoles
        });
    };

    const addRole = () => {
        setFormData({
            ...formData,
            organizationRoles: [...formData.organizationRoles, { role: '', responsibility: '' }]
        });
    };

    const removeRole = (index) => {
        const roles = [...formData.organizationRoles];
        roles.splice(index, 1);
        setFormData({
            ...formData,
            organizationRoles: roles
        });
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

    // Helper function to render step content
    const renderStepContent = () => {
        const currentSection = steps[currentStep].id;

        switch (currentSection) {
            case 'basic':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Company Name"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Registration Number</label>
                            <input
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Registration Number"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Establishment Year</label>
                            <input
                                type="date"
                                name="establishmentYear"
                                value={formData.establishmentYear}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Business Type</label>
                            <input
                                type="text"
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Business Type"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Company Address</label>
                            <textarea
                                name="companyAddress"
                                value={formData.companyAddress}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Company Address"
                            ></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Registration Certificate</label>
                            <div className="mt-1">
                                <input
                                    type="file"
                                    id="registrationCertificate"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*,.pdf"
                                />
                                <label
                                    htmlFor="registrationCertificate"
                                    className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white cursor-pointer mr-2 sm:mr-3 text-sm sm:text-base"
                                >
                                    <FaCloudUploadAlt className="mr-2" />
                                    Upload File
                                </label>
                                <span className="text-gray-600 text-sm sm:text-base break-all">{fileLabel}</span>
                                <p className="text-xs text-gray-500 mt-1">
                                    Registration certificate, company profile, business license, etc.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'leadership':
                return (
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                            Are roles and responsibilities clearly defined with an established organogram and regular reviews?
                        </label>
                        <div className="mt-2 flex flex-wrap items-center space-x-4">
                            <label className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    name="rolesDefinedClearly"
                                    value="YES"
                                    checked={formData.rolesDefinedClearly === 'YES'}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-green-600"
                                />
                                <span className="ml-2 text-gray-700">YES</span>
                            </label>
                            <label className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    name="rolesDefinedClearly"
                                    value="NO"
                                    checked={formData.rolesDefinedClearly === 'NO'}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-green-600"
                                />
                                <span className="ml-2 text-gray-700">NO</span>
                            </label>
                        </div>

                        {formData.rolesDefinedClearly === 'YES' && (
                            <div className="mt-4">
                                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                    Please list key roles and responsibilities in your organization:
                                </p>

                                {formData.organizationRoles.map((roleInfo, index) => (
                                    <div key={index} className="mb-4 sm:mb-6 p-3 sm:p-4 border border-gray-200 rounded-md">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={roleInfo.role}
                                                    onChange={(e) => handleRoleChange(index, 'role', e.target.value)}
                                                    required
                                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="Role/Position"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={roleInfo.responsibility}
                                                    onChange={(e) => handleRoleChange(index, 'responsibility', e.target.value)}
                                                    required
                                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="Key Responsibilities"
                                                />
                                            </div>
                                            <div className="flex justify-end md:col-span-2">
                                                {formData.organizationRoles.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRole(index)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                        aria-label="Remove role"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addRole}
                                    className="flex items-center text-green-500 border border-green-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-green-50 text-sm sm:text-base"
                                >
                                    <FaPlus className="mr-2" />
                                    Add Role
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 'sustainability':
                return (
                    <div>
                        <p className="text-gray-600 mb-4 text-sm sm:text-base">
                            What sustainability certifications does your facility hold (e.g., ZED, Green Rating)?
                            Specify the level (Bronze/Silver/Gold) and validity.
                        </p>

                        {formData.certificates.map((cert, index) => (
                            <div key={index} className="mb-4 sm:mb-6 p-3 sm:p-4 border border-gray-200 rounded-md">
                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            value={cert.type}
                                            onChange={(e) => handleCertificateChange(index, 'type', e.target.value)}
                                            required
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Certificate Type"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                        <select
                                            value={cert.level}
                                            onChange={(e) => handleCertificateChange(index, 'level', e.target.value)}
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="">Select Level</option>
                                            <option value="Bronze">Bronze</option>
                                            <option value="Silver">Silver</option>
                                            <option value="Gold">Gold</option>
                                        </select>

                                        <input
                                            type="date"
                                            value={cert.validity}
                                            onChange={(e) => handleCertificateChange(index, 'validity', e.target.value)}
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        {formData.certificates.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeCertificate(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                aria-label="Remove certificate"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addCertificate}
                            className="flex items-center text-green-500 border border-green-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-green-50 text-sm sm:text-base"
                        >
                            <FaPlus className="mr-2" />
                            Add Certificate
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full container mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-4 ">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-600 mb-2">Company Information</h1>
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

export default CompanyInfoForm; 