import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaLeaf, FaUsers, FaClipboardCheck, FaGlobe, FaLock, FaFileAlt, FaArrowRight, FaCheck, FaChevronDown, FaChevronUp, FaIndustry, FaHandshake, FaShieldAlt, FaBolt, FaThumbsUp, FaStar, FaQuoteLeft } from 'react-icons/fa';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';

const LandingPage = () => {
    // State for FAQ accordion
    const [openFaq, setOpenFaq] = useState(null);

    // Toggle FAQ item
    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // FAQ items
    const faqItems = [
        {
            question: "Do you really handle report preparation?",
            answer: "Yes. Our ESG experts aggregate, validate, and analyze data to draft your comprehensive ESG report—tailored to your chosen frameworks."
        },
        {
            question: "How do partners access the platform?",
            answer: "After you sign up, invite any number of partners; they'll receive secure links to fill out their data—all at no cost."
        },
        {
            question: "Which frameworks are supported?",
            answer: "We support BRSR, GRI, CSRD, SASB, and custom questionnaires—ensuring compliance with global and local reporting standards."
        },
        {
            question: "Is there a paid plan?",
            answer: "Our core ESG reporting and partner access remain free forever. Optional premium modules for advanced analytics are available."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20 pt-32">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-1/2 mb-12 md:mb-0 mr-4">
                                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                                    Transform Your Value Chain ESG Reporting
                                </h1>
                                <p className="text-xl mb-8 text-green-100">
                                    We generate your comprehensive ESG report and provide platform access to all your value chain partners—through Net Zero Journey, enabling seamless collaboration and data collection.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/register" className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition duration-300 inline-flex items-center">
                                        Get Started for Free
                                        <FaArrowRight className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <div className="bg-white p-1 rounded-lg shadow-2xl">
                                    <img src="/ESGValuechain.png" alt="ESG Dashboard Preview" className="rounded w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Industry Statistics Section */}
                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                                <div className="bg-white p-8 rounded-lg shadow-md">
                                    <div className="text-4xl font-bold text-green-600 mb-2">78%</div>
                                    <p className="text-gray-700">Of investors consider ESG factors in investment decisions</p>
                                </div>
                                <div className="bg-white p-8 rounded-lg shadow-md">
                                    <div className="text-4xl font-bold text-green-600 mb-2">$35T+</div>
                                    <p className="text-gray-700">Global assets under management with ESG criteria</p>
                                </div>
                                <div className="bg-white p-8 rounded-lg shadow-md">
                                    <div className="text-4xl font-bold text-green-600 mb-2">68%</div>
                                    <p className="text-gray-700">Of companies struggle with supply chain ESG data collection</p>
                                </div>
                                <div className="bg-white p-8 rounded-lg shadow-md">
                                    <div className="text-4xl font-bold text-green-600 mb-2">46%</div>
                                    <p className="text-gray-700">Reduction in compliance costs with automated ESG reporting</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Offering Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center mb-12">
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Offering</h2>
                            <p className="text-xl text-gray-600">
                                Net Zero Journey handles every step of your ESG reporting process—data gathering, analysis, and report generation—so you can focus on driving sustainable improvements. We provide platform access to all your value chain partners, ensuring full transparency and collaboration.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition duration-300">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaFileAlt className="text-green-600 text-2xl" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">End-to-End Reporting</h3>
                                <p className="text-gray-600">
                                    From data collection to audit-ready deliverables, we prepare comprehensive reports tailored to BRSR, GRI, CSRD, and more.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition duration-300">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaUsers className="text-green-600 text-2xl" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Partner Access</h3>
                                <p className="text-gray-600">
                                    Invite unlimited suppliers and stakeholders to participate on our platform—enabling seamless collaboration and data collection.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition duration-300">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaClipboardCheck className="text-green-600 text-2xl" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Audit & Regulatory Ready</h3>
                                <p className="text-gray-600">
                                    Our reports comply with leading ESG frameworks and regulatory requirements, ensuring your reporting is robust and defensible.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center mb-12">
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Choose Net Zero Journey?</h2>
                            <p className="text-xl text-gray-600">
                                Our platform stands out by simplifying complex ESG reporting while maintaining the highest standards of data quality and regulatory compliance.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaShieldAlt className="text-green-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Security First</h3>
                                <p className="text-gray-600">
                                    Enterprise-grade security with encrypted data storage and transmission. SOC 2 Type II compliant.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaBolt className="text-green-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Implementation Speed</h3>
                                <p className="text-gray-600">
                                    Be operational in days, not months. Our guided setup and templated questionnaires accelerate your journey.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaHandshake className="text-green-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
                                <p className="text-gray-600">
                                    Access to ESG specialists and dedicated customer success managers to guide your reporting journey.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaIndustry className="text-green-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Industry-Specific Templates</h3>
                                <p className="text-gray-600">
                                    Pre-built questionnaires and metrics tailored to your industry's specific ESG requirements and standards.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaThumbsUp className="text-green-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">High Response Rates</h3>
                                <p className="text-gray-600">
                                    Our user-friendly supplier interface and automated reminders ensure superior data collection completion.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaLeaf className="text-green-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Continuous Improvement</h3>
                                <p className="text-gray-600">
                                    Year-over-year tracking and benchmarking to help you identify and implement meaningful sustainability improvements.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Hear from organizations that have transformed their ESG reporting journey with our platform
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-lg shadow-md relative">
                                <div className="absolute -top-5 left-8 text-green-500 text-5xl">
                                    <FaQuoteLeft />
                                </div>
                                <p className="mt-6 mb-8 text-gray-600 italic">
                                    "Net Zero Journey has revolutionized our supply chain ESG tracking. We've onboarded over 250 suppliers in just two months with a 92% response rate—far better than our previous system."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="ml-4">
                                        <p className="font-bold">Jennifer Meyers</p>
                                        <p className="text-sm text-gray-500">Sustainability Director, Global Retail Inc.</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex text-yellow-400">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-lg shadow-md relative">
                                <div className="absolute -top-5 left-8 text-green-500 text-5xl">
                                    <FaQuoteLeft />
                                </div>
                                <p className="mt-6 mb-8 text-gray-600 italic">
                                    "The automated BRSR report preparation saved us at least 6 weeks of manual work. Our team now focuses on implementing sustainability initiatives instead of chasing data and formatting reports."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="ml-4">
                                        <p className="font-bold">Rahul Sharma</p>
                                        <p className="text-sm text-gray-500">ESG Compliance Lead, Tech Solutions Ltd.</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex text-yellow-400">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-lg shadow-md relative">
                                <div className="absolute -top-5 left-8 text-green-500 text-5xl">
                                    <FaQuoteLeft />
                                </div>
                                <p className="mt-6 mb-8 text-gray-600 italic">
                                    "As a medium-sized business, we needed an enterprise-grade ESG solution. Net Zero Journey provided a comprehensive platform that exceeded the capabilities of systems our larger competitors use."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="ml-4">
                                        <p className="font-bold">Maria Rodriguez</p>
                                        <p className="text-sm text-gray-500">COO, EcoManufacturing Co.</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex text-yellow-400">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Platform in Action */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Platform in Action</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className=" bg-gray-200 flex items-center justify-center">
                                    <img src="/dashboard.png" alt="ESG Dashboard Preview" className="rounded w-full" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">Dashboard with ESG Scores & Deadlines</h3>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="bg-gray-200 flex items-center justify-center">
                                    <img src="/company.png" alt="ESG Dashboard Preview" className="rounded w-full" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">Company Info & Basic Details Form</h3>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className=" bg-gray-200 flex items-center justify-center">
                                    <img src="/environment.png" alt="ESG Dashboard Preview" className="rounded w-full" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">Environment Section with Renewable Energy Input</h3>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className=" bg-gray-200 flex items-center justify-center">
                                    <img src="/social.png" alt="ESG Dashboard Preview" className="rounded w-full" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">Social Initiatives & SOP Upload</h3>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className=" bg-gray-200 flex items-center justify-center">
                                    <img src="/governance.png" alt="ESG Dashboard Preview" className="rounded w-full" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">Governance Practices & Documentation</h3>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className=" bg-gray-200 flex items-center justify-center">
                                    <img src="/carbon.png" alt="ESG Dashboard Preview" className="rounded w-full" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">Scope 1 & 2 Carbon Calculator View</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trusted By Section */}
                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold mb-4">Trusted By Industry Leaders</h2>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-12">
                            <div className="w-32   rounded">
                                <img src="/sts.png" alt="ESG Dashboard Preview" className="rounded w-full" />
                            </div>
                            <div className="w-32  rounded">
                                <img src="/tjc.png" alt="ESG Dashboard Preview" className="rounded w-full" />
                            </div>
                            <div className="w-32  rounded">
                                <img src="/shoplc.png" alt="ESG Dashboard Preview" className="rounded w-full" />
                            </div>
                            <div className="w-32 h-24 rounded">
                                <img src="/mindful_souls_home_logo.png" alt="ESG Dashboard Preview" className="rounded w-full h-24" />
                            </div>
                            <div className="w-32 h-24 rounded">
                                <img src="/vgl_logo_1.png" alt="ESG Dashboard Preview" className="rounded w-full h-24" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {/* Step 1 */}
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
                                <h3 className="text-xl font-semibold mb-3">Create Your Account</h3>
                                <p className="text-gray-600">
                                    Sign up in minutes and provide basic company details to get started.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
                                <h3 className="text-xl font-semibold mb-3">Invite Partners</h3>
                                <p className="text-gray-600">
                                    Add suppliers and stakeholders; Net Zero Journey sends automated reminders and collects ESG data seamlessly.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
                                <h3 className="text-xl font-semibold mb-3">Review & Collaborate</h3>
                                <p className="text-gray-600">
                                    Monitor real-time dashboards, address gaps collaboratively, and finalize data inputs with your partners.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">4</div>
                                <h3 className="text-xl font-semibold mb-3">Report Delivery</h3>
                                <p className="text-gray-600">
                                    Receive an audit-ready ESG report and maintain ongoing partner access for continuous tracking.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            {faqItems.map((item, index) => (
                                <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="flex justify-between items-center w-full text-left font-semibold py-2"
                                    >
                                        {item.question}
                                        {openFaq === index ? (
                                            <FaChevronUp className="text-gray-400" />
                                        ) : (
                                            <FaChevronDown className="text-gray-400" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <div className="mt-2 text-gray-600 pl-4">
                                            {item.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your ESG Journey Today</h2>
                        <p className="text-xl mb-8 text-green-100 max-w-3xl mx-auto">
                            Get comprehensive ESG reporting with seamless access for all your value chain partners.
                        </p>
                        <Link to="/register" className="bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-lg font-semibold transition duration-300 inline-flex items-center text-lg">
                            Get Started
                            <FaArrowRight className="ml-2" />
                        </Link>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
};

export default LandingPage; 