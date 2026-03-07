import { Link } from 'react-router-dom';
import { FiTarget as GiDrumsticks } from 'react-icons/fi';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {


    return (
        <footer className="bg-gray-950 border-t border-gray-800 mt-16">
            <div className="page-container py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-gold-500 rounded-xl flex items-center justify-center">
                                <GiDrumsticks className="text-white text-lg" />
                            </div>
                            <span className="text-xl font-display font-bold text-gradient">HarshDandiya</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            India's most vibrant Dandiya store. Bringing the joy of Navratri to your celebrations with premium quality sticks.
                        </p>
                        <div className="flex gap-3">
                            {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>



                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/products', label: 'All Products' },
                                { to: '/about', label: 'About Us' },
                                { to: '/contact', label: 'Contact Us' },
                                { to: '/cart', label: 'Cart' },
                                { to: '/orders', label: 'My Orders' },
                                { to: '/profile', label: 'My Profile' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <FiMapPin className="text-primary-500 flex-shrink-0" />
                                Ahmedabad, Gujarat, India
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <FiPhone className="text-primary-500 flex-shrink-0" />
                                +91 98765 43210
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <FiMail className="text-primary-500 flex-shrink-0" />
                                hello@harshdandiya.com
                            </li>
                        </ul>
                        <div className="mt-4 p-3 bg-primary-900/20 border border-primary-900/50 rounded-xl flex items-start gap-2">
                            <GiDrumsticks className="text-primary-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-primary-300 font-medium">Bulk Discount!</p>
                                <p className="text-xs text-gray-400 mt-1">Buy 10+ sticks and get 15% off automatically.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divider mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">© 2026 HarshDandiya. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link to="/privacy-policy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/refund-policy" className="text-xs text-gray-500 hover:text-white transition-colors">Refund Policy</Link>
                        <Link to="/shipping-policy" className="text-xs text-gray-500 hover:text-white transition-colors">Shipping Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
