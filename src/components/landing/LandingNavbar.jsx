import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaLeaf } from 'react-icons/fa';

const LandingNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <FaLeaf className={`text-2xl mr-2 ${isScrolled ? 'text-green-600' : 'text-white'}`} />
                        <span className={`font-bold text-xl ${isScrolled ? 'text-gray-800' : 'text-white'}`}>Net Zero Journey</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`font-medium hover:text-green-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                            Home
                        </Link>
                        <Link to="/about" className={`font-medium hover:text-green-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                            About
                        </Link>
                        <Link to="/contact" className={`font-medium hover:text-green-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                            Contact
                        </Link>

                        <Link to="/login" className={`${isScrolled ? 'bg-green-600 text-white' : 'bg-white text-green-700'} px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity`}>
                            Login
                        </Link>
                        <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className={`${isScrolled ? 'text-gray-800' : 'text-white'} focus:outline-none`}
                        >
                            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} pt-4 pb-2`}>
                    <div className="flex flex-col space-y-4 bg-white mt-2 p-4 rounded-lg shadow-lg">
                        <Link to="/" className="font-medium text-gray-800 hover:text-green-600 transition-colors" onClick={toggleMenu}>
                            Home
                        </Link>
                        <Link to="/about" className="font-medium text-gray-800 hover:text-green-600 transition-colors" onClick={toggleMenu}>
                            About
                        </Link>
                        <Link to="/contact" className="font-medium text-gray-800 hover:text-green-600 transition-colors" onClick={toggleMenu}>
                            Contact
                        </Link>

                        <div className="pt-2 flex flex-col space-y-2">
                            <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 text-center" onClick={toggleMenu}>
                                Login
                            </Link>
                            <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 text-center" onClick={toggleMenu}>
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default LandingNavbar; 