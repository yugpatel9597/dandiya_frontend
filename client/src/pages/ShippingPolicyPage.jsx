import React from 'react';
import { FiTruck } from 'react-icons/fi';

const ShippingPolicyPage = () => {
    return (
        <div className="pt-24 pb-16 bg-gray-950 min-h-screen">
            <div className="page-container max-w-4xl">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FiTruck className="text-3xl text-primary-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Shipping & Delivery Policy</h1>
                    <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-invert prose-primary max-w-none">
                    <p className="text-gray-300 lead">
                        This Shipping & Delivery Policy is part of our Terms of Service and should be therefore read alongside our main terms. Please carefully review our Shipping & Delivery Policy when purchasing our products.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Processing Time</h2>
                    <p className="text-gray-300">
                        All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Shipping Rates & Delivery Estimates</h2>
                    <p className="text-gray-300">
                        Shipping charges for your order will be calculated and displayed at checkout. Standard delivery generally takes 3-7 business days within India, depending on the delivery location.
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                        <li><strong>Standard Shipping:</strong> 3-7 Business Days (Rates calculated at checkout)</li>
                        <li><strong>Express Shipping:</strong> 1-3 Business Days (Available for select pin codes)</li>
                    </ul>
                    <p className="text-gray-300 mt-4 italic">
                        Delivery delays can occasionally occur, especially during festival seasons like Navratri.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Shipment Confirmation & Order Tracking</h2>
                    <p className="text-gray-300">
                        You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Damages</h2>
                    <p className="text-gray-300">
                        HarshDandiya is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. International Shipping</h2>
                    <p className="text-gray-300">
                        Currently, we only ship within India. We do not ship internationally at this time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicyPage;
