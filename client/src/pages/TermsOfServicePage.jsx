import React from 'react';
import { FiFileText } from 'react-icons/fi';

const TermsOfServicePage = () => {
    return (
        <div className="pt-24 pb-16 bg-gray-950 min-h-screen">
            <div className="page-container max-w-4xl">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FiFileText className="text-3xl text-primary-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-invert prose-primary max-w-none">
                    <p className="text-gray-300 lead">
                        Welcome to HarshDandiya. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-300">
                        By visiting our site and/ or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Online Store Terms</h2>
                    <p className="text-gray-300">
                        By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
                        You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Products or Services</h2>
                    <p className="text-gray-300">
                        Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
                        We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Pricing and Modifications</h2>
                    <p className="text-gray-300">
                        Prices for our products are subject to change without notice.
                        We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                        We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Accuracy of Billing and Account Information</h2>
                    <p className="text-gray-300">
                        We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Governing Law</h2>
                    <p className="text-gray-300">
                        These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
