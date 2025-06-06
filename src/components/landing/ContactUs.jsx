import React, { useState } from 'react';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import userService from '../../services/userService';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
    });

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Send data to our backend API
            const response = await userService.submitContactForm(formData);

            console.log('Form submitted successfully:', response.data);
            setIsSubmitting(false);
            setFormSubmitted(true);
            setFormData({
                name: '',
                email: '',
                company: '',
                subject: '',
                message: ''
            });
        } catch (err) {
            console.error('Error submitting form:', err);
            setIsSubmitting(false);
            setError(
                err.response?.data?.message ||
                'An error occurred while submitting your message. Please try again later.'
            );
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 pt-32">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl text-green-100 max-w-3xl mx-auto">
                            Have questions about Net Zero Journey? We're here to help.
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-16">
                    <div className="container mx-auto px-6">
                        <div className="max-w-5xl mx-auto">
                            <div className="grid md:grid-cols-5 gap-8">
                                {/* Contact Info */}
                                <div className="md:col-span-2">
                                    <div className="bg-white rounded-xl shadow-md p-8 h-full">
                                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Get In Touch</h2>

                                        <div className="space-y-6">
                                            <div className="flex items-start">
                                                <div className="mt-1">
                                                    <FaMapMarkerAlt className="text-green-600 text-xl mr-4" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Our Location</h3>
                                                    <p className="text-gray-600 mt-1">
                                                        C-scheme<br />
                                                        Jaipur<br />
                                                        India
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="mt-1">
                                                    <FaPhone className="text-green-600 text-xl mr-4" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Phone</h3>
                                                    <p className="text-gray-600 mt-1">
                                                        <a href="tel:+918209181530">+91 8209181530</a><br />
                                                        Mon-Fri, 9am-6pm IST
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="mt-1">
                                                    <FaEnvelope className="text-green-600 text-xl mr-4" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Email</h3>
                                                    <p className="text-gray-600 mt-1">
                                                        <a href="mailto:info@netzerojourney.org">info@netzerojourney.org</a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-gray-200">
                                            <h3 className="font-semibold text-gray-800 mb-4">Connect With Us</h3>
                                            <p className="text-gray-600 mb-4">
                                                For partnerships, press, or speaking engagements, please email:
                                            </p>
                                            <a href="mailto:info@netzerojourney.org" className="text-green-600 hover:underline">
                                                info@netzerojourney.org
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <div className="md:col-span-3">
                                    <div className="bg-white rounded-xl shadow-md p-8">
                                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>

                                        {formSubmitted ? (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                                <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
                                                <p className="text-gray-600">
                                                    Your message has been sent successfully. We'll get back to you as soon as possible.
                                                </p>
                                                <button
                                                    className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                                    onClick={() => setFormSubmitted(false)}
                                                >
                                                    Send Another Message
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                {error && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4 flex items-center">
                                                        <FaExclamationCircle className="mr-2" />
                                                        <span>{error}</span>
                                                    </div>
                                                )}

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Full Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="name"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            placeholder="John Doe"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Email Address *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            placeholder="john@example.com"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Company Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="company"
                                                        name="company"
                                                        value={formData.company}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        placeholder="Your Company"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Subject *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="subject"
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        placeholder="How can we help you?"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Message *
                                                    </label>
                                                    <textarea
                                                        id="message"
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        required
                                                        rows={5}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        placeholder="Please provide details about your inquiry..."
                                                    ></textarea>
                                                </div>

                                                <div>
                                                    <button
                                                        type="submit"
                                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex justify-center items-center"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            'Send Message'
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="py-8">
                    <div className="container mx-auto px-6">
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden h-96">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.9044283801417!2d75.7877!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db6b0c2e3c001%3A0x860e5d8e8c3e3b4c!2sC%20Scheme%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1647881234567!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Net Zero Journey Office Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Frequently Asked Questions</h2>

                            <div className="space-y-4">
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="font-semibold text-lg mb-2">What are your support hours?</h3>
                                    <p className="text-gray-600">
                                        Our support team is available Monday through Friday, 9am to 6pm Eastern Time. For urgent issues, we also provide limited weekend support.
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="font-semibold text-lg mb-2">How quickly can I expect a response?</h3>
                                    <p className="text-gray-600">
                                        We strive to respond to all inquiries within 1 business day. For technical support questions, our average response time is under 4 hours.
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="font-semibold text-lg mb-2">Do you offer on-site consulting?</h3>
                                    <p className="text-gray-600">
                                        Yes, we offer on-site consulting services for enterprise clients. Please contact our partnerships team for more information and pricing.
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="font-semibold text-lg mb-2">How can I request a product demo?</h3>
                                    <p className="text-gray-600">
                                        You can request a personalized demo by filling out the contact form on this page or by emailing demos@netzerojourney.com with your company information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
};

export default ContactUs; 