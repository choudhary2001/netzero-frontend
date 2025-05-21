import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft, FaCheckCircle, FaCloudUploadAlt, FaSpinner, FaDownload, FaPlus, FaTimes } from 'react-icons/fa';
import esgService from '../../services/esgService';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { getMediaUrl } from '../../config';

const SocialForm = () => {
    const location = useLocation();
    const [view, setView] = useState(location.search.includes('view=true'));
    const [formData, setFormData] = useState({
        swachhWorkplace: {
            sopDetails: '',  // Cleaning and hygiene SOP details
            workplaceMaintenance: '',  // Workplace maintenance guidelines
            certificate: null,
            points: 0,
            remarks: '',
            lastUpdated: new Date()
        },
        occupationalSafety: {
            ltifr: '',  // Latest Lost-Time Injury Frequency Rate
            safetyTraining: {
                programs: ['Test Program - Basic Safety Training - 1 hour'],  // Adding a test program
                coverage: '',  // Employee coverage percentage
            },
            emergencyResponse: {
                plan: '',  // Emergency response plan
                drillFrequency: '',  // Drill frequency
            },
            riskAssessment: '',  // H&S risk assessment methods
            healthServices: {
                facilities: '',  // On-site health facilities
                checkupFrequency: '',  // Health check-up frequency
            },
            insurance: '',  // Work-related injury insurance
            certificate: null,
            points: 0,
            remarks: '',
            lastUpdated: new Date()
        },
        hrManagement: {
            humanRightsPolicy: '',  // Human rights policy details
            supplierCode: '',  // Supplier code of conduct
            wagesBenefits: {
                fairWages: '',  // Fair wages implementation
                benefits: '',  // Benefits details
                wageAudits: '',  // Wage audit information
            },
            diversity: {
                leadershipPercentage: '',  // Women/underrepresented groups in leadership
                boardPercentage: '',  // Women/underrepresented groups on board
            },
            grievanceMechanism: {
                details: '',  // Grievance mechanism details
                casesRaised: 0,  // Number of cases raised
                resolutionOutcomes: '',  // Resolution outcomes
            },
            trainingDevelopment: {
                hoursPerEmployee: '',  // Training hours per employee
                keyPrograms: [],  // Key training programs
            },
            certificate: null,
            points: 0,
            remarks: '',
            lastUpdated: new Date()
        },
        csrSocialResponsibilities: {
            communityInvestment: {
                initiatives: [],  // Community investment initiatives
                localHiring: '',  // Local hiring initiatives
            },
            csrProjects: [],  // Initialize as empty array
            employeeOutreach: {
                programs: [],  // Employee outreach programs
                participation: '',  // Participation details
                spend: '',  // Program spend
            },
            socialOutcomes: {
                measurement: '',  // How outcomes are measured
                reporting: '',  // How outcomes are reported
                feedback: '',  // Community feedback
            },
            certificate: null,
            points: 0,
            remarks: '',
            lastUpdated: new Date()
        }
    });

    const steps = [
        { id: 'swachhWorkplace', label: 'Swachh Workplace' },
        { id: 'occupationalSafety', label: 'Occupational Safety' },
        { id: 'hrManagement', label: 'HR Management' },
        { id: 'csrSocialResponsibilities', label: 'CSR & Social Responsibilities' }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [fileLabels, setFileLabels] = useState({
        swachhWorkplace: 'No file chosen',
        occupationalSafety: 'No file chosen',
        hrManagement: 'No file chosen',
        csrSocialResponsibilities: 'No file chosen'
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiReady, setApiReady] = useState(false);
    const [saved, setSaved] = useState({
        swachhWorkplace: false,
        occupationalSafety: false,
        hrManagement: false,
        csrSocialResponsibilities: false
    });
    const [newItemText, setNewItemText] = useState('');
    const [activeArrayField, setActiveArrayField] = useState({
        section: '',
        field: '',
        subField: null
    });

    // Add help text for each section
    const helpText = {
        swachhWorkplace: {
            sopDetails: "Describe your cleaning and hygiene Standard Operating Procedures (SOPs) in detail. Include frequency of cleaning, responsible personnel, and specific guidelines.",
            workplaceMaintenance: "Explain your workplace maintenance guidelines, including regular maintenance schedules, inspection procedures, and maintenance staff responsibilities.",
            certificate: "Upload documents that demonstrate your cleaning SOPs, audit reports, and training records. These should show compliance with workplace hygiene standards."
        },
        occupationalSafety: {
            ltifr: "Enter your latest Lost-Time Injury Frequency Rate (LTIFR). This is typically calculated as (Number of lost-time injuries × 1,000,000) / Total hours worked.",
            safetyTraining: {
                programs: "List all safety training programs conducted annually. Include program names, duration, and topics covered.",
                coverage: "Enter the percentage of employees/workers covered by safety training programs."
            },
            emergencyResponse: {
                plan: "Describe your emergency response plan in detail, including evacuation procedures, emergency contacts, and response protocols.",
                drillFrequency: "Specify how often emergency drills are conducted (e.g., 'Monthly', 'Quarterly', 'Bi-annually')."
            },
            riskAssessment: "Explain your Health & Safety risk assessment methods, including how risks are identified, evaluated, and mitigated.",
            healthServices: {
                facilities: "Describe the on-site health facilities and services available to employees, including medical staff and equipment.",
                checkupFrequency: "Specify how often health check-ups are conducted for employees."
            },
            insurance: "Detail your work-related injury insurance coverage, including coverage limits and types of injuries covered.",
            certificate: "Upload safety training schedules, LTIFR reports, and emergency drill records to demonstrate your safety practices."
        },
        hrManagement: {
            humanRightsPolicy: "Describe your human rights policy, including provisions for child labor, forced labor, working hours, and freedom of association.",
            supplierCode: "Explain your supplier code of conduct and how it ensures ethical business practices throughout your supply chain.",
            wagesBenefits: {
                fairWages: "Describe how you ensure fair wages, including any wage audits or living-wage benchmarking processes.",
                benefits: "Detail the benefits provided to employees, including health insurance, retirement plans, and other perks.",
                wageAudits: "Explain your wage audit process and how you ensure compliance with fair wage standards."
            },
            diversity: {
                leadershipPercentage: "Enter the percentage of leadership positions held by women or under-represented groups.",
                boardPercentage: "Enter the percentage of board positions held by women or under-represented groups."
            },
            grievanceMechanism: {
                details: "Describe your employee grievance mechanism, including how employees can raise concerns and the resolution process.",
                casesRaised: "Enter the number of cases raised through the grievance mechanism in the last year.",
                resolutionOutcomes: "Summarize the outcomes of resolved cases and any improvements made based on feedback."
            },
            trainingDevelopment: {
                hoursPerEmployee: "Enter the average number of training hours per employee per year.",
                keyPrograms: "List the key training and development programs offered to employees."
            },
            certificate: "Upload policy documents, wage audit summaries, diversity dashboard, grievance logs, and training metrics."
        },
        csrSocialResponsibilities: {
            communityInvestment: {
                initiatives: "List your community investment initiatives, including programs for local development and community support.",
                localHiring: "Describe your local hiring initiatives and how they benefit the community."
            },
            csrProjects: {
                name: "Enter the name of the CSR project.",
                description: "Provide a detailed description of the project and its objectives.",
                impact: "Summarize the social impact of the project, including measurable outcomes.",
                year: "Enter the year the project was implemented."
            },
            employeeOutreach: {
                programs: "List your employee outreach and volunteering programs.",
                participation: "Describe employee participation in outreach programs, including engagement rates.",
                spend: "Enter the total spend on employee outreach programs."
            },
            socialOutcomes: {
                measurement: "Explain how you measure social outcomes, including metrics and evaluation methods.",
                reporting: "Describe how social outcomes are reported and communicated to stakeholders.",
                feedback: "Summarize community feedback and how it influences your social initiatives."
            },
            certificate: "Upload project reports, impact assessments, and media coverage of your CSR initiatives."
        }
    };

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

    // Fetch existing social data when API is ready
    useEffect(() => {
        if (!apiReady) return;

        const fetchSocialData = async () => {
            try {
                setLoading(true);
                const response = await esgService.getESGData();

                if (response.success && response.data && response.data.social) {
                    // Update form data with existing values
                    const socialData = response.data.social;

                    // Create a new state object to update
                    const newFormData = { ...formData };
                    const newFileLabels = { ...fileLabels };
                    const newSaved = { ...saved };

                    // Update each section if it exists
                    Object.keys(newFormData).forEach(key => {
                        if (socialData[key]) {
                            // Ensure nested objects are properly merged
                            newFormData[key] = {
                                ...newFormData[key], // Keep default structure
                                ...socialData[key], // Override with server data
                                lastUpdated: new Date(),
                                // Ensure nested objects are properly initialized
                                ...(key === 'occupationalSafety' && {
                                    safetyTraining: {
                                        ...newFormData[key].safetyTraining,
                                        ...(socialData[key].safetyTraining || {})
                                    },
                                    emergencyResponse: {
                                        ...newFormData[key].emergencyResponse,
                                        ...(socialData[key].emergencyResponse || {})
                                    },
                                    healthServices: {
                                        ...newFormData[key].healthServices,
                                        ...(socialData[key].healthServices || {})
                                    }
                                }),
                                ...(key === 'hrManagement' && {
                                    wagesBenefits: {
                                        ...newFormData[key].wagesBenefits,
                                        ...(socialData[key].wagesBenefits || {})
                                    },
                                    diversity: {
                                        ...newFormData[key].diversity,
                                        ...(socialData[key].diversity || {})
                                    },
                                    grievanceMechanism: {
                                        ...newFormData[key].grievanceMechanism,
                                        ...(socialData[key].grievanceMechanism || {})
                                    },
                                    trainingDevelopment: {
                                        ...newFormData[key].trainingDevelopment,
                                        ...(socialData[key].trainingDevelopment || {})
                                    }
                                }),
                                ...(key === 'csrSocialResponsibilities' && {
                                    communityInvestment: {
                                        ...newFormData[key].communityInvestment,
                                        ...(socialData[key].communityInvestment || {})
                                    },
                                    employeeOutreach: {
                                        ...newFormData[key].employeeOutreach,
                                        ...(socialData[key].employeeOutreach || {})
                                    },
                                    socialOutcomes: {
                                        ...newFormData[key].socialOutcomes,
                                        ...(socialData[key].socialOutcomes || {})
                                    }
                                })
                            };

                            if (socialData[key].certificate) {
                                newFileLabels[key] = socialData[key].certificate.split('/').pop();
                                newSaved[key] = true;
                            }
                        }
                    });

                    setFormData(newFormData);
                    setFileLabels(newFileLabels);
                    setSaved(newSaved);

                    toast.success('Social data loaded successfully');
                }
            } catch (error) {
                console.error('Error fetching social data:', error);
                toast.error('Failed to load your social data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSocialData();
    }, [apiReady]);

    const handleChange = (section, field, value, subField = null) => {
        setFormData(prev => {
            const newData = { ...prev };

            if (subField) {
                // Handle nested objects
                if (!newData[section][field]) {
                    newData[section][field] = {};
                }
                newData[section][field] = {
                    ...newData[section][field],
                    [subField]: value
                };
            } else {
                // Handle direct fields
                newData[section][field] = value;
            }

            // Update lastUpdated timestamp
            newData[section].lastUpdated = new Date();

            return newData;
        });

        // Update saved status
        if (saved[section]) {
            setSaved(prev => ({
                ...prev,
                [section]: false
            }));
        }
    };

    const handleArrayChange = (section, field, value, index, subField = null) => {
        console.log('handleArrayChange called with:', { section, field, value, index, subField });

        setFormData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));

            if (subField) {
                // Handle nested arrays (like initiatives, programs)
                if (!newData[section][field][subField]) {
                    newData[section][field][subField] = [];
                }
                const array = newData[section][field][subField];

                if (index !== undefined) {
                    array[index] = value;
                } else {
                    array.push(value);
                }
            } else {
                // Handle direct arrays (like csrProjects)
                if (!newData[section][field]) {
                    newData[section][field] = [];
                }
                const array = newData[section][field];

                if (index !== undefined) {
                    // For updating existing items
                    if (field === 'csrProjects') {
                        // For CSR projects, ensure we're updating with a valid object
                        array[index] = {
                            name: value.name || '',
                            description: value.description || '',
                            impact: value.impact || '',
                            year: value.year || ''
                        };
                    } else {
                        array[index] = value;
                    }
                } else {
                    // For adding new items
                    if (field === 'csrProjects') {
                        // For CSR projects, ensure we're adding a proper object
                        const newProject = {
                            name: value.name || '',
                            description: value.description || '',
                            impact: value.impact || '',
                            year: value.year || new Date().getFullYear()
                        };
                        array.push(newProject);
                    } else {
                        array.push(value);
                    }
                }
            }

            // Update lastUpdated timestamp
            newData[section].lastUpdated = new Date();

            // Mark section as unsaved
            setSaved(prev => ({
                ...prev,
                [section]: false
            }));

            return newData;
        });
    };

    const removeArrayItem = (section, field, index, subField = null) => {
        setFormData(prev => {
            const newData = { ...prev };

            if (subField) {
                // Handle nested arrays
                const newArray = [...newData[section][field][subField]];
                newArray.splice(index, 1);
                newData[section][field][subField] = newArray;
            } else {
                // Handle regular arrays
                const newArray = [...newData[section][field]];
                newArray.splice(index, 1);
                newData[section][field] = newArray;
            }

            // Update lastUpdated timestamp
            newData[section].lastUpdated = new Date();

            return newData;
        });

        // Update saved status
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
            if (validateCurrentStep()) {
                // Save current data before proceeding
                await saveCurrentStep();
                setCurrentStep(currentStep + 1);
            }
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
            console.log('Saving section:', currentSection, 'with data:', formData[currentSection]);

            // First upload certificate if available and it's a File object
            let certificateUrl = formData[currentSection].certificate;
            if (formData[currentSection].certificate instanceof File) {
                const uploadResponse = await esgService.uploadCertificate(
                    formData[currentSection].certificate,
                    'social',
                    currentSection
                );

                if (uploadResponse.success) {
                    certificateUrl = uploadResponse.data.filePath;
                } else {
                    throw new Error('Failed to upload certificate');
                }
            }

            // Prepare data for API - ensure we're sending the complete section data
            const sectionData = {
                ...formData[currentSection],
                certificate: certificateUrl,
                // Ensure nested objects are properly included
                ...(currentSection === 'occupationalSafety' && {
                    safetyTraining: {
                        programs: Array.isArray(formData[currentSection].safetyTraining.programs)
                            ? formData[currentSection].safetyTraining.programs
                            : [],
                        coverage: formData[currentSection].safetyTraining.coverage || ''
                    },
                    emergencyResponse: {
                        plan: formData[currentSection].emergencyResponse.plan || '',
                        drillFrequency: formData[currentSection].emergencyResponse.drillFrequency || ''
                    },
                    healthServices: {
                        facilities: formData[currentSection].healthServices.facilities || '',
                        checkupFrequency: formData[currentSection].healthServices.checkupFrequency || ''
                    }
                }),
                ...(currentSection === 'csrSocialResponsibilities' && {
                    // Ensure csrProjects is properly formatted as an array of objects
                    csrProjects: Array.isArray(formData[currentSection].csrProjects)
                        ? formData[currentSection].csrProjects.map(project => ({
                            name: project?.name || '',
                            description: project?.description || '',
                            impact: project?.impact || '',
                            year: project?.year || ''
                        }))
                        : [],
                    // Ensure other nested objects are properly included
                    communityInvestment: {
                        initiatives: Array.isArray(formData[currentSection].communityInvestment?.initiatives)
                            ? formData[currentSection].communityInvestment.initiatives
                            : [],
                        localHiring: formData[currentSection].communityInvestment?.localHiring || ''
                    },
                    employeeOutreach: {
                        programs: Array.isArray(formData[currentSection].employeeOutreach?.programs)
                            ? formData[currentSection].employeeOutreach.programs
                            : [],
                        participation: formData[currentSection].employeeOutreach?.participation || '',
                        spend: formData[currentSection].employeeOutreach?.spend || ''
                    },
                    socialOutcomes: {
                        measurement: formData[currentSection].socialOutcomes?.measurement || '',
                        reporting: formData[currentSection].socialOutcomes?.reporting || '',
                        feedback: formData[currentSection].socialOutcomes?.feedback || ''
                    }
                })
            };

            console.log('Sending data to API:', sectionData);

            // Update ESG data for this section
            const response = await esgService.updateESGData(
                'social',
                currentSection,
                sectionData
            );

            if (response.success) {
                // Update local state with the saved data
                setFormData(prev => ({
                    ...prev,
                    [currentSection]: {
                        ...sectionData,
                        lastUpdated: new Date()
                    }
                }));

                setSaved(prev => ({
                    ...prev,
                    [currentSection]: true
                }));

                // Verify the data was saved correctly
                console.log('Data saved successfully. Updated state:', formData[currentSection]);

                toast.success(`${steps[currentStep].label} information saved successfully`);
            } else {
                throw new Error(response.message || 'Failed to save data');
            }
        } catch (error) {
            console.error('Error saving social data:', error);
            toast.error(error.message || 'Error saving data. Please try again.');
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
                toast.success('Your social information has been submitted for review!');
                // Optionally redirect or update UI state
            } else {
                throw new Error(response.message || 'Failed to submit data for review');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error.message || 'Error submitting data. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Update validation rules
    const validateCurrentStep = () => {
        const currentSection = steps[currentStep].id;
        const sectionData = formData[currentSection];

        switch (currentSection) {
            case 'swachhWorkplace':
                if (!sectionData.sopDetails.trim()) {
                    toast.error('Please provide detailed cleaning and hygiene SOPs');
                    return false;
                }
                if (!sectionData.workplaceMaintenance.trim()) {
                    toast.error('Please provide workplace maintenance guidelines');
                    return false;
                }
                if (!sectionData.certificate) {
                    toast.error('Please upload required documents (cleaning SOPs, audit reports, training records)');
                    return false;
                }
                break;

            case 'occupationalSafety':
                if (!sectionData.ltifr.trim()) {
                    toast.error('Please provide your latest LTIFR');
                    return false;
                }
                if (sectionData.safetyTraining.programs.length === 0) {
                    toast.error('Please add at least one safety training program');
                    // return false;
                }
                if (!sectionData.safetyTraining.coverage.trim()) {
                    toast.error('Please provide employee coverage percentage for safety training');
                    return false;
                }
                if (!sectionData.emergencyResponse.plan.trim()) {
                    toast.error('Please provide emergency response plan');
                    return false;
                }
                if (!sectionData.emergencyResponse.drillFrequency.trim()) {
                    toast.error('Please specify drill frequency');
                    return false;
                }
                if (!sectionData.riskAssessment.trim()) {
                    toast.error('Please describe your risk assessment methods');
                    return false;
                }
                if (!sectionData.healthServices.facilities.trim()) {
                    toast.error('Please describe on-site health facilities');
                    return false;
                }
                if (!sectionData.insurance.trim()) {
                    toast.error('Please provide insurance coverage details');
                    return false;
                }
                if (!sectionData.certificate) {
                    toast.error('Please upload required documents (safety training schedules, LTIFR report, emergency-drill records)');
                    return false;
                }
                break;

            case 'hrManagement':
                if (!sectionData.humanRightsPolicy.trim()) {
                    toast.error('Please provide human rights policy details');
                    return false;
                }
                if (!sectionData.supplierCode.trim()) {
                    toast.error('Please provide supplier code of conduct');
                    return false;
                }
                if (!sectionData.wagesBenefits.fairWages.trim()) {
                    toast.error('Please describe fair wages implementation');
                    return false;
                }
                if (!sectionData.wagesBenefits.benefits.trim()) {
                    toast.error('Please provide benefits details');
                    return false;
                }
                if (!sectionData.diversity.leadershipPercentage.trim()) {
                    toast.error('Please provide leadership diversity percentage');
                    return false;
                }
                if (!sectionData.diversity.boardPercentage.trim()) {
                    toast.error('Please provide board diversity percentage');
                    return false;
                }
                if (!sectionData.grievanceMechanism.details.trim()) {
                    toast.error('Please describe grievance mechanism');
                    return false;
                }
                if (!sectionData.trainingDevelopment.hoursPerEmployee.trim()) {
                    toast.error('Please provide training hours per employee');
                    return false;
                }
                if (sectionData.trainingDevelopment.keyPrograms.length === 0) {
                    toast.error('Please add at least one key training program');
                    // return false;
                }
                if (!sectionData.certificate) {
                    toast.error('Please upload required documents (policy documents, wage-audit summary, diversity dashboard, grievance log, training metrics)');
                    return false;
                }
                break;

            case 'csrSocialResponsibilities':
                // Validate communityInvestment
                if (!Array.isArray(sectionData.communityInvestment.initiatives) || sectionData.communityInvestment.initiatives.length === 0) {
                    toast.error('Please add at least one community investment initiative');
                    return false;
                }
                if (!sectionData.communityInvestment.localHiring.trim()) {
                    toast.error('Please describe your local hiring initiatives');
                    return false;
                }

                // Validate csrProjects
                if (!Array.isArray(sectionData.csrProjects) || sectionData.csrProjects.length === 0) {
                    toast.error('Please add at least one CSR project');
                    return false;
                }

                // Check if any CSR project is missing required fields
                const invalidProjects = sectionData.csrProjects.filter(project =>
                    !project ||
                    !project.name ||
                    !project.description ||
                    !project.impact
                );

                if (invalidProjects.length > 0) {
                    toast.error('Please complete all fields for each CSR project');
                    return false;
                }

                // Validate employeeOutreach
                if (!Array.isArray(sectionData.employeeOutreach.programs) || sectionData.employeeOutreach.programs.length === 0) {
                    toast.error('Please add at least one employee outreach program');
                    return false;
                }
                if (!sectionData.employeeOutreach.participation.trim()) {
                    toast.error('Please provide participation details');
                    return false;
                }

                // Validate socialOutcomes
                if (!sectionData.socialOutcomes.measurement.trim()) {
                    toast.error('Please explain how you measure social outcomes');
                    return false;
                }
                if (!sectionData.certificate) {
                    toast.error('Please upload required documents (project reports, impact assessments, media coverage)');
                    return false;
                }
                break;

            default:
                return true;
        }

        return true;
    };

    // Add download handler
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

    // Update handleAddProgram to call the more general handleAddArrayItem
    const handleAddProgram = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!newItemText || !newItemText.trim()) {
            toast.error('Please enter program details');
            return;
        }

        const programToAdd = newItemText.trim();

        // Add the new program using the general function
        handleAddArrayItem('occupationalSafety', 'safetyTraining', 'programs', programToAdd);

        // Clear form and close
        setNewItemText('');
    };

    // Generic function to handle adding items to array fields
    const handleAddArrayItem = (section, field, subField = null, value) => {
        console.log('Adding new item:', { section, field, subField, value });

        if (!value || !value.trim()) {
            toast.error('Please enter details');
            return;
        }

        setFormData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));

            if (subField) {
                // Ensure the nested array exists
                if (!newData[section][field]) {
                    newData[section][field] = {};
                }
                if (!newData[section][field][subField]) {
                    newData[section][field][subField] = [];
                }
                // Add the new item
                newData[section][field][subField].push(value.trim());
            } else {
                // Ensure the array exists
                if (!newData[section][field]) {
                    newData[section][field] = [];
                }
                // Add the new item
                if (field === 'csrProjects') {
                    // For CSR projects, create a proper object
                    newData[section][field].push({
                        name: value.trim(),
                        description: '',
                        impact: '',
                        year: new Date().getFullYear().toString()
                    });
                } else {
                    newData[section][field].push(value.trim());
                }
            }

            // Update lastUpdated timestamp
            newData[section].lastUpdated = new Date();

            return newData;
        });

        // Mark section as unsaved
        setSaved(prev => ({
            ...prev,
            [section]: false
        }));

        toast.success('Item added successfully. Remember to save your changes.');

        // Reset the active field
        setActiveArrayField({
            section: '',
            field: '',
            subField: null
        });
        setNewItemText('');
    };

    // Show add item form for a specific array field
    const showAddItemForm = (section, field, subField = null) => {
        setActiveArrayField({
            section,
            field,
            subField
        });
        setNewItemText('');
    };

    // Cancel add item form
    const cancelAddItem = () => {
        setActiveArrayField({
            section: '',
            field: '',
            subField: null
        });
        setNewItemText('');
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
        const currentSection = steps[currentStep].id;
        const sectionData = formData[currentSection];

        if (!sectionData) {
            return (
                <div className="text-center text-red-600 p-4">
                    Error: Section data not found. Please refresh the page.
                </div>
            );
        }

        const renderHelpText = (section, field, subField = null) => {
            let text;
            if (subField) {
                text = helpText[section]?.[field]?.[subField];
            } else {
                // Special case for csrProjects which has nested fields
                if (section === 'csrSocialResponsibilities' && field === 'csrProjects') {
                    text = "Add details about your CSR projects including name, description, impact, and year of implementation.";
                } else {
                    text = helpText[section]?.[field];
                }
            }

            return text ? (
                <p className="text-sm text-gray-500 mt-1">{text}</p>
            ) : null;
        };

        switch (currentSection) {
            case 'swachhWorkplace':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Cleaning and Hygiene SOP Details
                            </label>
                            {renderHelpText('swachhWorkplace', 'sopDetails')}
                            <textarea
                                value={sectionData.sopDetails}
                                onChange={(e) => handleChange('swachhWorkplace', 'sopDetails', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your cleaning and hygiene SOPs"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Workplace Maintenance Guidelines
                            </label>
                            {renderHelpText('swachhWorkplace', 'workplaceMaintenance')}
                            <textarea
                                value={sectionData.workplaceMaintenance}
                                onChange={(e) => handleChange('swachhWorkplace', 'workplaceMaintenance', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your workplace maintenance guidelines"
                                disabled={view}
                            />
                        </div>
                        {renderFileUpload('swachhWorkplace', 'Swachh Workplace Documents',
                            'Upload cleaning SOP documents, audit reports, training records', sectionData.remarks, sectionData.points)}
                    </div>
                );

            case 'occupationalSafety':
                const programs = formData.occupationalSafety.safetyTraining.programs || [];

                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Lost-Time Injury Frequency Rate (LTIFR)
                            </label>
                            {renderHelpText('occupationalSafety', 'ltifr')}
                            <input
                                type="text"
                                value={sectionData.ltifr}
                                onChange={(e) => handleChange('occupationalSafety', 'ltifr', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                placeholder="Enter your latest LTIFR"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Safety Training Programs
                            </label>
                            {renderHelpText('occupationalSafety', 'safetyTraining', 'programs')}
                            <div className="space-y-4">
                                {/* Existing Programs List */}
                                <div className="space-y-2">
                                    {programs.length > 0 ? (
                                        programs.map((program, index) => (
                                            <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-700">{program}</p>
                                                </div>
                                                {!view && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('occupationalSafety', 'safetyTraining', index, 'programs')}
                                                        className="text-red-600 hover:text-red-800 p-2"
                                                        title="Remove program"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">No programs added yet</p>
                                    )}
                                </div>

                                {/* Add Program Form */}
                                {!view && (
                                    <>
                                        {activeArrayField.section === 'occupationalSafety' &&
                                            activeArrayField.field === 'safetyTraining' &&
                                            activeArrayField.subField === 'programs' ? (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Program Details
                                                        </label>
                                                        <textarea
                                                            value={newItemText}
                                                            onChange={(e) => setNewItemText(e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                                            rows="3"
                                                            placeholder="Enter program name, duration, and topics covered"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={cancelAddItem}
                                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddArrayItem('occupationalSafety', 'safetyTraining', 'programs', newItemText)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                        >
                                                            Add Program
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => showAddItemForm('occupationalSafety', 'safetyTraining', 'programs')}
                                                className="inline-flex items-center px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-200"
                                            >
                                                <FaPlus className="mr-2" />
                                                Add New Program
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Employee Coverage Percentage
                            </label>
                            {renderHelpText('occupationalSafety', 'safetyTraining', 'coverage')}
                            <input
                                type="text"
                                value={sectionData.safetyTraining.coverage}
                                onChange={(e) => handleChange('occupationalSafety', 'safetyTraining', e.target.value, 'coverage')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                placeholder="Enter employee coverage percentage"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Emergency Response Plan
                            </label>
                            {renderHelpText('occupationalSafety', 'emergencyResponse', 'plan')}
                            <textarea
                                value={sectionData.emergencyResponse.plan}
                                onChange={(e) => handleChange('occupationalSafety', 'emergencyResponse', e.target.value, 'plan')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your emergency response plan"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Drill Frequency
                            </label>
                            {renderHelpText('occupationalSafety', 'emergencyResponse', 'drillFrequency')}
                            <input
                                type="text"
                                value={sectionData.emergencyResponse.drillFrequency}
                                onChange={(e) => handleChange('occupationalSafety', 'emergencyResponse', e.target.value, 'drillFrequency')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                placeholder="Enter drill frequency"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Risk Assessment Methods
                            </label>
                            {renderHelpText('occupationalSafety', 'riskAssessment')}
                            <textarea
                                value={sectionData.riskAssessment}
                                onChange={(e) => handleChange('occupationalSafety', 'riskAssessment', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your H&S risk assessment methods"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                On-site Health Facilities
                            </label>
                            {renderHelpText('occupationalSafety', 'healthServices', 'facilities')}
                            <textarea
                                value={sectionData.healthServices.facilities}
                                onChange={(e) => handleChange('occupationalSafety', 'healthServices', e.target.value, 'facilities')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your on-site health facilities"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Health Check-up Frequency
                            </label>
                            {renderHelpText('occupationalSafety', 'healthServices', 'checkupFrequency')}
                            <input
                                type="text"
                                value={sectionData.healthServices.checkupFrequency}
                                onChange={(e) => handleChange('occupationalSafety', 'healthServices', e.target.value, 'checkupFrequency')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                placeholder="Enter health check-up frequency"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Work-related Injury Insurance
                            </label>
                            {renderHelpText('occupationalSafety', 'insurance')}
                            <textarea
                                value={sectionData.insurance}
                                onChange={(e) => handleChange('occupationalSafety', 'insurance', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your work-related injury insurance coverage"
                                disabled={view}
                            />
                        </div>
                        {renderFileUpload('occupationalSafety', 'Occupational Safety Documents',
                            'Upload safety training schedules, LTIFR report, emergency-drill records', sectionData.remarks, sectionData.points)}
                    </div>
                );

            case 'hrManagement':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Human Rights Policy
                            </label>
                            {renderHelpText('hrManagement', 'humanRightsPolicy')}
                            <textarea
                                value={sectionData.humanRightsPolicy}
                                onChange={(e) => handleChange('hrManagement', 'humanRightsPolicy', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your human rights policy"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Supplier Code of Conduct
                            </label>
                            {renderHelpText('hrManagement', 'supplierCode')}
                            <textarea
                                value={sectionData.supplierCode}
                                onChange={(e) => handleChange('hrManagement', 'supplierCode', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your supplier code of conduct"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Fair Wages Implementation
                            </label>
                            {renderHelpText('hrManagement', 'wagesBenefits', 'fairWages')}
                            <textarea
                                value={sectionData.wagesBenefits.fairWages}
                                onChange={(e) => handleChange('hrManagement', 'wagesBenefits', e.target.value, 'fairWages')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your fair wages implementation"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Benefits Details
                            </label>
                            {renderHelpText('hrManagement', 'wagesBenefits', 'benefits')}
                            <textarea
                                value={sectionData.wagesBenefits.benefits}
                                onChange={(e) => handleChange('hrManagement', 'wagesBenefits', e.target.value, 'benefits')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your benefits program"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Wage Audit Information
                            </label>
                            {renderHelpText('hrManagement', 'wagesBenefits', 'wageAudits')}
                            <textarea
                                value={sectionData.wagesBenefits.wageAudits}
                                onChange={(e) => handleChange('hrManagement', 'wagesBenefits', e.target.value, 'wageAudits')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your wage audit process"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Leadership Diversity Percentage
                            </label>
                            {renderHelpText('hrManagement', 'diversity', 'leadershipPercentage')}
                            <input
                                type="text"
                                value={sectionData.diversity.leadershipPercentage}
                                onChange={(e) => handleChange('hrManagement', 'diversity', e.target.value, 'leadershipPercentage')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                placeholder="Enter percentage of women/underrepresented groups in leadership"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Board Diversity Percentage
                            </label>
                            {renderHelpText('hrManagement', 'diversity', 'boardPercentage')}
                            <input
                                type="text"
                                value={sectionData.diversity.boardPercentage}
                                onChange={(e) => handleChange('hrManagement', 'diversity', e.target.value, 'boardPercentage')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                placeholder="Enter percentage of women/underrepresented groups on board"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Grievance Mechanism Details
                            </label>
                            {renderHelpText('hrManagement', 'grievanceMechanism', 'details')}
                            <textarea
                                value={sectionData.grievanceMechanism.details}
                                onChange={(e) => handleChange('hrManagement', 'grievanceMechanism', e.target.value, 'details')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your grievance mechanism"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Number of Cases Raised
                            </label>
                            {renderHelpText('hrManagement', 'grievanceMechanism', 'casesRaised')}
                            <input
                                type="number"
                                value={sectionData.grievanceMechanism.casesRaised}
                                onChange={(e) => handleChange('hrManagement', 'grievanceMechanism', parseInt(e.target.value), 'casesRaised')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                placeholder="Enter number of cases raised"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Resolution Outcomes
                            </label>
                            {renderHelpText('hrManagement', 'grievanceMechanism', 'resolutionOutcomes')}
                            <textarea
                                value={sectionData.grievanceMechanism.resolutionOutcomes}
                                onChange={(e) => handleChange('hrManagement', 'grievanceMechanism', e.target.value, 'resolutionOutcomes')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe resolution outcomes"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Training Hours per Employee
                            </label>
                            {renderHelpText('hrManagement', 'trainingDevelopment', 'hoursPerEmployee')}
                            <input
                                type="text"
                                value={sectionData.trainingDevelopment.hoursPerEmployee}
                                onChange={(e) => handleChange('hrManagement', 'trainingDevelopment', e.target.value, 'hoursPerEmployee')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                placeholder="Enter training hours per employee"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Key Training Programs
                            </label>
                            {renderHelpText('hrManagement', 'trainingDevelopment', 'keyPrograms')}
                            <div className="space-y-2">
                                {sectionData.trainingDevelopment.keyPrograms.map((program, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={program}
                                            onChange={(e) => handleArrayChange('hrManagement', 'trainingDevelopment', e.target.value, index, 'keyPrograms')}
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                            placeholder="Enter training program"
                                            disabled={view}
                                        />
                                        {!view && (
                                            <button
                                                onClick={() => removeArrayItem('hrManagement', 'trainingDevelopment', index, 'keyPrograms')}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!view && (
                                    <>
                                        {activeArrayField.section === 'hrManagement' &&
                                            activeArrayField.field === 'trainingDevelopment' &&
                                            activeArrayField.subField === 'keyPrograms' ? (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Program Details
                                                        </label>
                                                        <textarea
                                                            value={newItemText}
                                                            onChange={(e) => setNewItemText(e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                                            rows="3"
                                                            placeholder="Enter training program details"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={cancelAddItem}
                                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddArrayItem('hrManagement', 'trainingDevelopment', 'keyPrograms', newItemText)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                        >
                                                            Add Program
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => showAddItemForm('hrManagement', 'trainingDevelopment', 'keyPrograms')}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                Add Program
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {renderFileUpload('hrManagement', 'HR Management Documents',
                            'Upload policy documents, wage-audit summary, diversity dashboard, grievance log, training metrics', sectionData.remarks, sectionData.points)}
                    </div>
                );

            case 'csrSocialResponsibilities':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Community Investment Initiatives
                            </label>
                            {renderHelpText('csrSocialResponsibilities', 'communityInvestment', 'initiatives')}
                            <div className="space-y-2">
                                {sectionData.communityInvestment.initiatives.map((initiative, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={initiative}
                                            onChange={(e) => handleArrayChange('csrSocialResponsibilities', 'communityInvestment', e.target.value, index, 'initiatives')}
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                            placeholder="Enter community investment initiative"
                                            disabled={view}
                                        />
                                        {!view && (
                                            <button
                                                onClick={() => removeArrayItem('csrSocialResponsibilities', 'communityInvestment', index, 'initiatives')}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!view && (
                                    <>
                                        {activeArrayField.section === 'csrSocialResponsibilities' &&
                                            activeArrayField.field === 'communityInvestment' &&
                                            activeArrayField.subField === 'initiatives' ? (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Initiative Details
                                                        </label>
                                                        <textarea
                                                            value={newItemText}
                                                            onChange={(e) => setNewItemText(e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                                            rows="3"
                                                            placeholder="Enter community investment initiative details"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={cancelAddItem}
                                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddArrayItem('csrSocialResponsibilities', 'communityInvestment', 'initiatives', newItemText)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                        >
                                                            Add Initiative
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => showAddItemForm('csrSocialResponsibilities', 'communityInvestment', 'initiatives')}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                Add Initiative
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Local Hiring Initiatives
                            </label>
                            {renderHelpText('csrSocialResponsibilities', 'communityInvestment', 'localHiring')}
                            <textarea
                                value={sectionData.communityInvestment.localHiring}
                                onChange={(e) => handleChange('csrSocialResponsibilities', 'communityInvestment', e.target.value, 'localHiring')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe your local hiring initiatives"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                CSR Projects
                            </label>
                            {renderHelpText('csrSocialResponsibilities', 'csrProjects')}
                            <div className="space-y-4">
                                {Array.isArray(sectionData.csrProjects) && sectionData.csrProjects.map((project, index) => {
                                    // Ensure project is an object with all required fields
                                    const safeProject = {
                                        name: project?.name || '',
                                        description: project?.description || '',
                                        impact: project?.impact || '',
                                        year: project?.year || ''
                                    };

                                    return (
                                        <div key={index} className="p-4 border rounded-lg space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                                <input
                                                    type="text"
                                                    value={safeProject.name}
                                                    onChange={(e) => {
                                                        const updatedProject = {
                                                            ...safeProject,
                                                            name: e.target.value
                                                        };
                                                        handleArrayChange('csrSocialResponsibilities', 'csrProjects', updatedProject, index);
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                                    placeholder="Enter project name"
                                                    disabled={view}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea
                                                    value={safeProject.description}
                                                    onChange={(e) => {
                                                        const updatedProject = {
                                                            ...safeProject,
                                                            description: e.target.value
                                                        };
                                                        handleArrayChange('csrSocialResponsibilities', 'csrProjects', updatedProject, index);
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                                    rows="2"
                                                    placeholder="Enter project description"
                                                    disabled={view}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Impact</label>
                                                <textarea
                                                    value={safeProject.impact}
                                                    onChange={(e) => {
                                                        const updatedProject = {
                                                            ...safeProject,
                                                            impact: e.target.value
                                                        };
                                                        handleArrayChange('csrSocialResponsibilities', 'csrProjects', updatedProject, index);
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                                    rows="2"
                                                    placeholder="Enter project impact"
                                                    disabled={view}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Year</label>
                                                <input
                                                    type="text"
                                                    value={safeProject.year}
                                                    onChange={(e) => {
                                                        const updatedProject = {
                                                            ...safeProject,
                                                            year: e.target.value
                                                        };
                                                        handleArrayChange('csrSocialResponsibilities', 'csrProjects', updatedProject, index);
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                                    placeholder="Enter project year"
                                                    disabled={view}
                                                />
                                            </div>
                                            {!view && (
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => removeArrayItem('csrSocialResponsibilities', 'csrProjects', index)}
                                                        className="px-3 py-1.5 text-red-600 border border-red-200 rounded-md hover:bg-red-50"
                                                    >
                                                        Remove Project
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {!view && (
                                    <>
                                        {activeArrayField.section === 'csrSocialResponsibilities' &&
                                            activeArrayField.field === 'csrProjects' &&
                                            !activeArrayField.subField ? (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Project Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={newItemText}
                                                            onChange={(e) => setNewItemText(e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                                            placeholder="Enter CSR project name"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={cancelAddItem}
                                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddArrayItem('csrSocialResponsibilities', 'csrProjects', null, newItemText)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                        >
                                                            Add Project
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => showAddItemForm('csrSocialResponsibilities', 'csrProjects', null)}
                                                className="inline-flex items-center px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-200"
                                            >
                                                <FaPlus className="mr-2" />
                                                Add New Project
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Employee Outreach Programs
                            </label>
                            {renderHelpText('csrSocialResponsibilities', 'employeeOutreach', 'programs')}
                            <div className="space-y-2">
                                {sectionData.employeeOutreach.programs.map((program, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={program}
                                            onChange={(e) => handleArrayChange('csrSocialResponsibilities', 'employeeOutreach', e.target.value, index, 'programs')}
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                            placeholder="Enter outreach program"
                                            disabled={view}
                                        />
                                        {!view && (
                                            <button
                                                onClick={() => removeArrayItem('csrSocialResponsibilities', 'employeeOutreach', index, 'programs')}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!view && (
                                    <>
                                        {activeArrayField.section === 'csrSocialResponsibilities' &&
                                            activeArrayField.field === 'employeeOutreach' &&
                                            activeArrayField.subField === 'programs' ? (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Program Details
                                                        </label>
                                                        <textarea
                                                            value={newItemText}
                                                            onChange={(e) => setNewItemText(e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                                            rows="3"
                                                            placeholder="Enter employee outreach program details"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={cancelAddItem}
                                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddArrayItem('csrSocialResponsibilities', 'employeeOutreach', 'programs', newItemText)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                        >
                                                            Add Program
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => showAddItemForm('csrSocialResponsibilities', 'employeeOutreach', 'programs')}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                Add Program
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Participation Details
                            </label>
                            {renderHelpText('csrSocialResponsibilities', 'employeeOutreach', 'participation')}
                            <textarea
                                value={sectionData.employeeOutreach.participation}
                                onChange={(e) => handleChange('csrSocialResponsibilities', 'employeeOutreach', e.target.value, 'participation')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe participation details"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Program Spend
                            </label>
                            {renderHelpText('csrSocialResponsibilities', 'employeeOutreach', 'spend')}
                            <input
                                type="text"
                                value={sectionData.employeeOutreach.spend}
                                onChange={(e) => handleChange('csrSocialResponsibilities', 'employeeOutreach', e.target.value, 'spend')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                placeholder="Enter program spend"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Outcome Measurement
                            </label>
                            {renderHelpText('csrSocialResponsibilities', 'socialOutcomes', 'measurement')}
                            <textarea
                                value={sectionData.socialOutcomes.measurement}
                                onChange={(e) => handleChange('csrSocialResponsibilities', 'socialOutcomes', e.target.value, 'measurement')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe how outcomes are measured"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Outcome Reporting
                            </label>
                            {renderHelpText('csrSocialResponsibilities', 'socialOutcomes', 'reporting')}
                            <textarea
                                value={sectionData.socialOutcomes.reporting}
                                onChange={(e) => handleChange('csrSocialResponsibilities', 'socialOutcomes', e.target.value, 'reporting')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe how outcomes are reported"
                                disabled={view}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Community Feedback
                            </label>
                            {renderHelpText('csrSocialResponsibilities', 'socialOutcomes', 'feedback')}
                            <textarea
                                value={sectionData.socialOutcomes.feedback}
                                onChange={(e) => handleChange('csrSocialResponsibilities', 'socialOutcomes', e.target.value, 'feedback')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                                rows="3"
                                placeholder="Describe community feedback"
                                disabled={view}
                            />
                        </div>
                        {renderFileUpload('csrSocialResponsibilities', 'CSR & Social Responsibility Documents',
                            'Upload project reports, impact assessments, media coverage', sectionData.remarks, sectionData.points)}
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading && Object.values(formData).every(item =>
        item.sopDetails === '' &&
        item.workplaceMaintenance === '' &&
        item.ltifr === '' &&
        item.safetyTraining.programs.length === 0 &&
        item.safetyTraining.coverage === '' &&
        item.emergencyResponse.plan === '' &&
        item.emergencyResponse.drillFrequency === '' &&
        item.riskAssessment === '' &&
        item.healthServices.facilities === '' &&
        item.healthServices.checkupFrequency === '' &&
        item.insurance === '' &&
        item.humanRightsPolicy === '' &&
        item.supplierCode === '' &&
        item.wagesBenefits.fairWages === '' &&
        item.wagesBenefits.benefits === '' &&
        item.wagesBenefits.wageAudits === '' &&
        item.diversity.leadershipPercentage === '' &&
        item.diversity.boardPercentage === '' &&
        item.grievanceMechanism.details === '' &&
        item.grievanceMechanism.casesRaised === 0 &&
        item.grievanceMechanism.resolutionOutcomes === '' &&
        item.trainingDevelopment.hoursPerEmployee === '' &&
        item.trainingDevelopment.keyPrograms.length === 0 &&
        item.communityInvestment.initiatives.length === 0 &&
        item.communityInvestment.localHiring === '' &&
        item.csrProjects.length === 0 &&
        item.employeeOutreach.programs.length === 0 &&
        item.employeeOutreach.participation === '' &&
        item.employeeOutreach.spend === '' &&
        item.socialOutcomes.measurement === '' &&
        item.socialOutcomes.reporting === '' &&
        item.socialOutcomes.feedback === '' &&
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
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-600 mb-2">Social</h1>
                <p className="text-center text-gray-600 mb-4 sm:mb-6">Please fill out information about your social initiatives</p>

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

export default SocialForm; 