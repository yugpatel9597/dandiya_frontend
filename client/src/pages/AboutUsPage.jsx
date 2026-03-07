import React from 'react';
import { FiTarget as GiDrumsticks } from 'react-icons/fi';

const AboutUsPage = () => {
    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="page-container max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="section-heading mb-4">About HarshDandiya</h1>
                    <p className="section-subheading">Bringing the joy of Navratri to your celebrations</p>
                </div>

                <div className="card p-8 md:p-12 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Founded with a passion for preserving Indian cultural heritage, HarshDandiya started as a small local shop in Gujarat. Today, we are proud to be India's premier online destination for high-quality Dandiya sticks and Garba accessories.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                We believe that the right pair of Dandiyas can elevate your Garba experience from ordinary to magical. That's why we source only the finest wood, craft beautiful traditional designs, and innovate with modern LED variations.
                            </p>
                        </div>
                        <div className="w-48 h-48 bg-gradient-to-br from-primary-600 to-gold-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-gold">
                            <GiDrumsticks className="text-white text-6xl" />
                        </div>
                    </div>

                    <div className="divider mb-10" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <h3 className="text-xl font-bold text-gradient-gold mb-2">Quality</h3>
                            <p className="text-sm text-gray-500">Premium wood and vibrant colors designed to last through nine nights of dancing.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gradient-gold mb-2">Authenticity</h3>
                            <p className="text-sm text-gray-500">Traditional designs crafted by skilled artisans from the heart of Gujarat.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gradient-gold mb-2">Community</h3>
                            <p className="text-sm text-gray-500">Bringing the Garba community together with the best festival gear.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
