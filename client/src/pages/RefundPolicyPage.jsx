import React from 'react';
import { FiRefreshCcw } from 'react-icons/fi';

const RefundPolicyPage = () => {
    return (
        <div className="pt-24 pb-16 bg-gray-950 min-h-screen">
            <div className="page-container max-w-4xl">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FiRefreshCcw className="text-3xl text-primary-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Cancellation & Refund Policy</h1>
                    <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-invert prose-primary max-w-none">
                    <p className="text-gray-300 lead">
                        At HarshDandiya, we want you to be completely satisfied with your purchase. Our cancellation and refund policy is designed to be transparent and fair to all our customers.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Order Cancellations</h2>
                    <p className="text-gray-300">
                        We accept order cancellations before the product is shipped or produced. If the order is cancelled, you will get a full refund. We cannot cancel the order if the product is already shipped out.
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                        <li>To cancel an order, please contact us immediately at hello@harshdandiya.com with your order number.</li>
                        <li>Cancellations are only confirmed once you receive an email response from our support team.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Returns & Refunds</h2>
                    <p className="text-gray-300">
                        We offer a 7-day return policy for most items. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
                    </p>

                    <h3 className="text-xl font-medium text-white mt-6 mb-3">Eligible reasons for return/refund:</h3>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                        <li>Defective or damaged products received.</li>
                        <li>Incorrect item shipped.</li>
                        <li>Product differs significantly from the description on our website.</li>
                    </ul>

                    <h3 className="text-xl font-medium text-white mt-6 mb-3">Non-returnable items:</h3>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                        <li>Items that have been used or damaged after delivery.</li>
                        <li>Customized or personalized items.</li>
                        <li>Items purchased during clearance sales.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Refund Process</h2>
                    <p className="text-gray-300">
                        Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                    </p>
                    <p className="text-gray-300 mt-2">
                        If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 5-7 business days.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Late or Missing Refunds</h2>
                    <p className="text-gray-300">
                        If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted.
                        If you’ve done all of this and you still have not received your refund yet, please contact us at hello@harshdandiya.com.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicyPage;
