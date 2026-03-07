import React from 'react';
import { FiShield } from 'react-icons/fi';

const PrivacyPolicyPage = () => {
    return (
        <div className="pt-24 pb-16 bg-gray-950 min-h-screen">
            <div className="page-container max-w-4xl">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FiShield className="text-3xl text-primary-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-invert prose-primary max-w-none">
                    <p className="text-gray-300 lead">
                        Welcome to HarshDandiya. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Important Information and Who We Are</h2>
                    <p className="text-gray-300">
                        This privacy policy aims to give you information on how HarshDandiya collects and processes your personal data through your use of this website, including any data you may provide through this website when you purchase a product or sign up to our newsletter.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. The Data We Collect About You</h2>
                    <p className="text-gray-300">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                        <li><strong>Financial Data</strong> includes bank account and payment card details (processed securely via our payment partners).</li>
                        <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. How We Use Your Personal Data</h2>
                    <p className="text-gray-300">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Data Security</h2>
                    <p className="text-gray-300">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Contact Us</h2>
                    <p className="text-gray-300">
                        If you have any questions about this privacy policy or our privacy practices, please contact us at:
                        <br />
                        Email: hello@harshdandiya.com
                        <br />
                        Address: Ahmedabad, Gujarat, India
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
