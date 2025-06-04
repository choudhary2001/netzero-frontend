import React, { useState } from 'react';
import { FiHelpCircle, FiBookOpen, FiMail, FiMessageSquare, FiPhoneCall, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaHeadset, FaEnvelope, FaComments, FaFileAlt, FaQuestionCircle } from 'react-icons/fa';

const HelpSupport = () => {
    // State for FAQ accordion
    const [openFaq, setOpenFaq] = useState(null);

    // Toggle FAQ item
    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // FAQ data
    const faqs = [
        {
            question: "How do I update my company information?",
            answer: "You can update your company information by navigating to your Profile settings. Look for the 'Edit Profile' or 'Company Information' section."
        },
        {
            question: "What is ESG certification?",
            answer: "ESG (Environmental, Social, and Governance) certification validates that your company meets specific standards related to environmental impact, social responsibility, and corporate governance practices."
        },
        {
            question: "How often should I update my ESG data?",
            answer: "We recommend updating your ESG data quarterly, or whenever significant changes occur in your company's practices or policies that would affect your environmental impact, social responsibility, or governance practices."
        },
        {
            question: "How is my ESG score calculated?",
            answer: "Your ESG score is calculated using a proprietary algorithm that weighs various factors across environmental, social, and governance categories. The exact calculation is adjusted regularly to reflect current best practices and standards."
        },
        {
            question: "How can I improve my ESG score?",
            answer: "To improve your ESG score, focus on implementing sustainable practices, enhancing diversity and inclusion initiatives, improving employee welfare, and strengthening governance policies. Each section of your ESG profile includes specific recommendations for improvement."
        }
    ];

    // Documentation links
    const documentationLinks = [
        { title: "ESG Assessment Guide", url: "#", description: "Complete guide to understanding and completing your ESG assessment" },
        { title: "Certificate Requirements", url: "#", description: "Detailed list of required certificates for each section" },
        { title: "Best Practices", url: "#", description: "Tips to improve your ESG score and sustainability practices" },
        { title: "Industry Standards", url: "#", description: "Overview of industry ESG standards and benchmarks" },
        { title: "Video Tutorials", url: "#", description: "Step-by-step video guides for using the platform" }
    ];

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <FiMessageSquare className="text-green-500 mr-3 text-xl" />
                        <h2 className="text-lg font-semibold text-gray-800">Live Chat</h2>
                    </div>
                    <div className="ml-8">
                        <p className="text-gray-600 mb-3">
                            Chat with our support team in real-time during business hours.
                        </p>
                        <Link
                            to="/supplier/chat"
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            Start Chat Session
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <FiMail className="text-blue-500 mr-3 text-xl" />
                        <h2 className="text-lg font-semibold text-gray-800">Email Support</h2>
                    </div>
                    <div className="ml-8">
                        <p className="text-gray-600 mb-3">
                            Send us an email and we'll respond within 24 hours.
                        </p>
                        <a href="mailto:info@netzerojourney.org" className="text-blue-600 hover:text-blue-700 font-medium">
                            info@netzerojourney.org
                        </a>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <FiPhoneCall className="text-purple-500 mr-3 text-xl" />
                        <h2 className="text-lg font-semibold text-gray-800">Call Us</h2>
                    </div>
                    <div className="ml-8">
                        <p className="text-gray-600 mb-3">
                            Available Monday to Friday, 9am to 6pm IST.
                        </p>
                        <a href="tel:+918209181530" className="text-purple-600 hover:text-purple-700 font-medium">
                            +91 8209181530
                        </a>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <FiBookOpen className="text-yellow-500 mr-3 text-xl" />
                        <h2 className="text-lg font-semibold text-gray-800">Knowledge Base</h2>
                    </div>
                    <div className="ml-8">
                        <p className="text-gray-600 mb-3">
                            Browse our documentation to learn more about using our platform.
                        </p>
                        <a href="#" className="text-yellow-600 hover:text-yellow-700 font-medium">
                            View Documentation
                        </a>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="flex items-center mb-4">
                    <FiHelpCircle className="text-red-500 mr-3 text-xl" />
                    <h2 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4 mt-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4">
                            <button
                                className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-gray-600 focus:outline-none"
                                onClick={() => toggleFaq(index)}
                            >
                                <span>{faq.question}</span>
                                {openFaq === index ? (
                                    <FiChevronUp className="text-gray-500" />
                                ) : (
                                    <FiChevronDown className="text-gray-500" />
                                )}
                            </button>
                            {openFaq === index && (
                                <div className="mt-2 text-gray-600">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">
                            <span className="font-medium">Address:</span><br />
                            Net Zero Journey<br />
                            C-scheme<br />
                            Jaipur, India
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Email:</span><br />
                            <a href="mailto:info@netzerojourney.org" className="text-blue-600 hover:underline">
                                info@netzerojourney.org
                            </a>
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Phone:</span><br />
                            <a href="tel:+918209181530" className="text-blue-600 hover:underline">
                                +91 8209181530
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport; 