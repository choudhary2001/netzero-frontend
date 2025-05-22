import React from 'react';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';

const Terms = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 pt-32">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms and Conditions</h1>
                        <p className="text-xl text-green-100 max-w-3xl mx-auto">
                            Please read these terms carefully before using our platform
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
                                    These terms and conditions (the "Terms") govern your use of the Net Zero Journey platform and website
                                    (the "Service") operated by Net Zero Journey ("us", "we", or "our").
                                </p>
                                <p className="mb-4">
                                    By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms,
                                    you may not access the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Definitions</h2>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                                    <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Net Zero Journey.</li>
                                    <li><strong>Content</strong> refers to content such as text, images, or other information that can be posted, uploaded, linked to or otherwise made available by You, regardless of the form of that content.</li>
                                    <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
                                    <li><strong>Service</strong> refers to the Website.</li>
                                    <li><strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
                                    <li><strong>Website</strong> refers to Net Zero Journey, accessible from www.netzerojourney.com</li>
                                    <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Accounts</h2>
                                <p className="mb-4">
                                    When you create an account with us, you must provide us information that is accurate, complete, and current at all times.
                                    Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                                </p>
                                <p className="mb-4">
                                    You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password,
                                    whether your password is with our Service or a third-party service.
                                </p>
                                <p className="mb-4">
                                    You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach
                                    of security or unauthorized use of your account.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Intellectual Property</h2>
                                <p className="mb-4">
                                    The Service and its original content, features and functionality are and will remain the exclusive property of Net Zero Journey
                                    and its licensors. The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.
                                </p>
                                <p className="mb-4">
                                    Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Net Zero Journey.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. User Content</h2>
                                <p className="mb-4">
                                    Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics,
                                    videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                                </p>
                                <p className="mb-4">
                                    By posting Content to the Service, you grant us the right and license to use, modify, perform, display, reproduce,
                                    and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit,
                                    post or display on or through the Service and you are responsible for protecting those rights.
                                </p>
                                <p className="mb-4">
                                    You represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights
                                    and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights,
                                    publicity rights, copyrights, contract rights or any other rights of any person.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Termination</h2>
                                <p className="mb-4">
                                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever,
                                    including without limitation if you breach the Terms.
                                </p>
                                <p className="mb-4">
                                    Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account,
                                    you may simply discontinue using the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Limitation of Liability</h2>
                                <p className="mb-4">
                                    In no event shall Net Zero Journey, nor its directors, employees, partners, agents, suppliers, or affiliates,
                                    be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation,
                                    loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or
                                    inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any
                                    content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content,
                                    whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been
                                    informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Governing Law</h2>
                                <p className="mb-4">
                                    These Terms shall be governed and construed in accordance with the laws of the Country, without regard to its conflict of law provisions.
                                </p>
                                <p className="mb-4">
                                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                                    If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms
                                    will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace
                                    any prior agreements we might have between us regarding the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Changes to Terms</h2>
                                <p className="mb-4">
                                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will
                                    try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                                </p>
                                <p className="mb-4">
                                    By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                                    If you do not agree to the new terms, please stop using the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Contact Us</h2>
                                <p className="mb-4">
                                    If you have any questions about these Terms, please contact us:
                                </p>
                                <address className="not-italic">
                                    <strong>Net Zero Journey</strong><br />
                                    Email: legal@netzerojourney.com<br />
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

export default Terms; 