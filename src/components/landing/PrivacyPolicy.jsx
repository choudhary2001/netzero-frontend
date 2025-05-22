import React from 'react';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 pt-32">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-xl text-green-100 max-w-3xl mx-auto">
                            We're committed to protecting your data and privacy
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="space-y-8 text-gray-700">
                            <div>
                                <p className="text-sm text-gray-500">Last updated: January 1, 2023</p>
                            </div>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Introduction</h2>
                                <p className="mb-4">
                                    At Net Zero Journey, we respect your privacy and are committed to protecting your personal data.
                                    This privacy policy will inform you how we look after your personal data when you visit our website
                                    and tell you about your privacy rights and how the law protects you.
                                </p>
                                <p>
                                    This privacy policy aims to give you information on how Net Zero Journey collects and processes your
                                    personal data through your use of this website, including any data you may provide through this
                                    website when you sign up for our platform, subscribe to our newsletter, or use our services.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. The Data We Collect About You</h2>
                                <p className="mb-4">
                                    Personal data, or personal information, means any information about an individual from which that person
                                    can be identified. It does not include data where the identity has been removed (anonymous data).
                                </p>
                                <p className="mb-4">
                                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped
                                    together as follows:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, title.</li>
                                    <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                                    <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version,
                                        time zone setting and location, browser plug-in types and versions, operating system and platform, and other
                                        technology on the devices you use to access this website.</li>
                                    <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                                    <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from
                                        us and our third parties and your communication preferences.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. How We Use Your Personal Data</h2>
                                <p className="mb-4">
                                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data
                                    in the following circumstances:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and
                                        fundamental rights do not override those interests.</li>
                                    <li>Where we need to comply with a legal obligation.</li>
                                </ul>
                                <p className="mt-4">
                                    Generally, we do not rely on consent as a legal basis for processing your personal data although we will get
                                    your consent before sending third party direct marketing communications to you via email or text message.
                                    You have the right to withdraw consent to marketing at any time by contacting us.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Data Security</h2>
                                <p className="mb-4">
                                    We have put in place appropriate security measures to prevent your personal data from being accidentally
                                    lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your
                                    personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                    They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
                                </p>
                                <p>
                                    We have put in place procedures to deal with any suspected personal data breach and will notify you and
                                    any applicable regulator of a breach where we are legally required to do so.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Data Retention</h2>
                                <p>
                                    We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we
                                    collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or
                                    reporting requirements. We may retain your personal data for a longer period in the event of a complaint
                                    or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Your Legal Rights</h2>
                                <p className="mb-4">
                                    Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Request access to your personal data</li>
                                    <li>Request correction of your personal data</li>
                                    <li>Request erasure of your personal data</li>
                                    <li>Object to processing of your personal data</li>
                                    <li>Request restriction of processing your personal data</li>
                                    <li>Request transfer of your personal data</li>
                                    <li>Right to withdraw consent</li>
                                </ul>
                                <p className="mt-4">
                                    If you wish to exercise any of the rights set out above, please contact us at privacy@netzerojourney.com.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Contact Details</h2>
                                <p className="mb-4">
                                    If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                </p>
                                <address className="not-italic">
                                    <strong>Net Zero Journey</strong><br />
                                    Email: privacy@netzerojourney.com<br />
                                    Phone: +1 (234) 567-890<br />
                                    Address: 123 Sustainability Street, Green City, 12345
                                </address>
                            </section>
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
};

export default PrivacyPolicy; 