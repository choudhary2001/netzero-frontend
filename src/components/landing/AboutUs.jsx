import React from 'react';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';
import { FaLeaf, FaGlobe, FaUsers, FaLightbulb, FaHandshake, FaChartLine } from 'react-icons/fa';

const AboutUs = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 pt-32">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">About Net Zero Journey</h1>
                        <p className="text-xl text-green-100 max-w-3xl mx-auto">
                            We're on a mission to make ESG reporting accessible to all businesses and their supply chains.
                        </p>
                    </div>
                </section>

                {/* Our Story */}
                <section className="py-16">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Our Story</h2>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
                                <div className="p-8">
                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                        Net Zero Journey began with a simple observation: while large corporations increasingly faced pressure to improve their ESG
                                        (Environmental, Social, and Governance) performance, the tools available were expensive, complex, and unsuited for
                                        collaborative supply chain management.
                                    </p>
                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                        Founded in 2022 by a team of sustainability experts and technology innovators, we set out to build a platform that would
                                        democratize access to ESG reporting tools. Our founders believed that sustainability shouldn't be limited by budget constraints
                                        or technical barriers – it should be accessible to organizations of all sizes.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        What began as a simple carbon calculator evolved into a comprehensive ESG management platform that now serves hundreds of companies
                                        and thousands of suppliers worldwide. Our commitment to providing free access to core functionality has remained unwavering,
                                        as we believe that shared sustainability goals require shared tools and data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Mission and Values */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center mb-12">
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission & Values</h2>
                            <p className="text-xl text-gray-600">
                                Guided by our commitment to environmental stewardship and business responsibility
                            </p>
                        </div>

                        {/* Mission */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12 max-w-4xl mx-auto">
                            <div className="md:flex">
                                <div className="md:flex-shrink-0 bg-green-600 md:w-48 flex items-center justify-center p-8">
                                    <FaLeaf className="text-white text-5xl" />
                                </div>
                                <div className="p-8">
                                    <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">Our Mission</div>
                                    <p className="mt-2 text-gray-700">
                                        To accelerate the transition to sustainable business practices by making ESG reporting accessible,
                                        actionable, and affordable for every company and their entire value chain.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Values */}
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-3 rounded-full mr-4">
                                        <FaGlobe className="text-green-600 text-xl" />
                                    </div>
                                    <h3 className="font-semibold text-xl">Environmental Leadership</h3>
                                </div>
                                <p className="text-gray-600">
                                    We practice what we preach by minimizing our own environmental footprint and constantly
                                    innovating to help others do the same.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-3 rounded-full mr-4">
                                        <FaUsers className="text-green-600 text-xl" />
                                    </div>
                                    <h3 className="font-semibold text-xl">Inclusive Collaboration</h3>
                                </div>
                                <p className="text-gray-600">
                                    We believe sustainability requires participation at all levels of the supply chain, regardless of company size or resources.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-3 rounded-full mr-4">
                                        <FaLightbulb className="text-green-600 text-xl" />
                                    </div>
                                    <h3 className="font-semibold text-xl">Continuous Innovation</h3>
                                </div>
                                <p className="text-gray-600">
                                    We constantly evolve our platform to stay ahead of emerging ESG frameworks and reporting requirements.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-3 rounded-full mr-4">
                                        <FaHandshake className="text-green-600 text-xl" />
                                    </div>
                                    <h3 className="font-semibold text-xl">Radical Transparency</h3>
                                </div>
                                <p className="text-gray-600">
                                    We advocate for and facilitate honest reporting, meaningful metrics, and actionable insights over greenwashing.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Impact Section */}
                <section className="py-16 bg-gray-900 text-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-3xl font-bold mb-6 text-center">Our Impact</h2>
                            <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
                                Together with our customers, we're driving meaningful change across industries
                            </p>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-400 flex items-center justify-center mb-2">
                                        <FaChartLine className="mr-2" />
                                        <span>500+</span>
                                    </div>
                                    <p className="text-xl mb-2">Companies</p>
                                    <p className="text-gray-400 text-sm">
                                        Businesses using our platform to monitor and improve their ESG performance
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-400 flex items-center justify-center mb-2">
                                        <span>25,000+</span>
                                    </div>
                                    <p className="text-xl mb-2">Suppliers</p>
                                    <p className="text-gray-400 text-sm">
                                        Supply chain partners engaged in sustainability reporting
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-400 flex items-center justify-center mb-2">
                                        <span>30%</span>
                                    </div>
                                    <p className="text-xl mb-2">Average Improvement</p>
                                    <p className="text-gray-400 text-sm">
                                        Typical first-year enhancement in overall ESG scores for our customers
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Journey to a Sustainable Future</h2>
                        <p className="text-xl mb-8 max-w-3xl mx-auto">
                            Start your sustainability reporting today and become part of the solution.
                        </p>
                        <div className="flex justify-center space-x-4 flex-wrap">
                            <a
                                href="/register"
                                className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition duration-300"
                            >
                                Get Started Free
                            </a>
                            <a
                                href="/contact"
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-3 rounded-lg font-semibold transition duration-300"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
};

export default AboutUs; 