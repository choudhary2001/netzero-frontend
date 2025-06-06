import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const LandingFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {/* Company Info */}
                    <div>
                        <Link to="/" className="flex items-center mb-4">
                            <FaLeaf className="text-2xl mr-2 text-green-500" />
                            <span className="font-bold text-xl text-white">Net Zero Journey</span>
                        </Link>
                        <p className="mb-4">
                            Empowering businesses to track, report, and improve their environmental, social, and governance metrics.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.linkedin.com/company/netzerojourney/" target="_blank" className="text-gray-400 hover:text-green-400 transition-colors">
                                <FaLinkedin className="text-xl" />
                            </a>
                            <a href="https://x.com/netzerojourney" target="_blank" className="text-gray-400 hover:text-green-400 transition-colors">
                                <FaTwitter className="text-xl" />
                            </a>
                            <a href="https://www.instagram.com/netzerojourney/" target="_blank" className="text-gray-400 hover:text-green-400 transition-colors">
                                <FaInstagram className="text-xl" />
                            </a>
                            <a href="https://www.facebook.com/netzerojourney/" target="_blank" className="text-gray-400 hover:text-green-400 transition-colors">
                                <FaFacebook className="text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="hover:text-green-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-green-400 transition-colors">
                                    Contact Us
                                </Link>
                            </li>

                        </ul>
                    </div>



                    {/* Legal & Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Legal & Contact</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/privacy-policy" className="hover:text-green-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-green-400 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>

                            <li className="flex items-center mt-4">
                                <FaEnvelope className="mr-2 text-green-500" />
                                <a href="mailto:info@netzerojourney.com" className="hover:text-green-400 transition-colors">
                                    info@netzerojourney.com
                                </a>
                            </li>
                            <li className="flex items-center mt-2">
                                <FaPhone className="mr-2 text-green-500" />
                                <a href="tel:+918209181530" className="hover:text-green-400 transition-colors">
                                    +91 8209181530
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>



                {/* Copyright */}
                <div className="border-t border-gray-800 pt-8 mt-8 text-sm text-center">
                    <p>&copy; {currentYear} Net Zero Journey. All rights reserved.</p>
                    <p className="mt-2">

                        <Link to="/privacy-policy" className="hover:text-green-400 transition-colors mx-2">Privacy Policy</Link> |
                        <Link to="/terms" className="hover:text-green-400 transition-colors mx-2">Terms of Service</Link>

                    </p>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter; 