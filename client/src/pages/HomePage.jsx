import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchProducts } from '../redux/slices/productSlice';
import { fetchWishlist } from '../redux/slices/wishlistSlice';
import { fetchCart } from '../redux/slices/cartSlice';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiZap } from 'react-icons/fi';
import { FiTarget as GiDrumsticks, FiAward as GiPartyPopper } from 'react-icons/fi';
import { FiStar, FiPackage, FiGift, FiShield as FiSolidShield, FiTrendingUp } from 'react-icons/fi';



const features = [
    { icon: FiTruck, title: 'Free Shipping', desc: 'On orders above ₹999' },
    { icon: FiShield, title: 'Secure Payment', desc: 'Razorpay protected' },
    { icon: FiRefreshCw, title: 'Easy Returns', desc: '7-day return policy' },
    { icon: FiZap, title: 'Bulk Discount', desc: '15% off on 10+ items' },
];

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { featured, loading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchFeaturedProducts());
        if (user) {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [dispatch, user]);

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-hero-gradient opacity-20" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_infinite]" />
                    <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-gold-500/20 rounded-full blur-[100px] animate-[pulse_6s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-[10%] right-[20%] w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-[80px] animate-[pulse_5s_ease-in-out_infinite]" style={{ animationDelay: '2s' }} />
                    <div className="absolute bottom-[20%] left-[20%] w-[450px] h-[450px] bg-indigo-500/15 rounded-full blur-[120px] animate-[pulse_7s_ease-in-out_infinite]" style={{ animationDelay: '3s' }} />
                </div>

                <div className="page-container relative z-10 py-20">
                    <div className="max-w-3xl animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900/60 border border-primary-700/50 rounded-full text-sm text-primary-300 font-medium mb-6">
                            <GiPartyPopper className="text-gold-400" />
                            Navratri 2024 Collection is Here!
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-6">
                            Dance to the{' '}
                            <span className="text-gradient">Rhythm of</span>{' '}
                            Navratri
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                            Discover India's most vibrant collection of Dandiya sticks. From traditional wooden to
                            dazzling LED, find the perfect pair for your Garba dance this Navratri.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/products" className="btn-gold text-base px-8 py-4 rounded-xl font-bold shadow-2xl shadow-gold-500/20">
                                Shop Now <FiArrowRight />
                            </Link>
                            <Link to="/products?isFeatured=true" className="btn-secondary text-base px-8 py-4 rounded-xl">
                                View Featured
                            </Link>
                        </div>
                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-gray-800/50">
                            {[
                                { num: '5000+', label: 'Happy Customers' },
                                { num: '50+', label: 'Product Variants' },
                                { num: '4.8★', label: 'Average Rating' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-2xl font-bold text-gradient-gold">{stat.num}</p>
                                    <p className="text-sm text-gray-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12 bg-gray-900/40 border-y border-gray-800">
                <div className="page-container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-all group">
                                <div className="w-10 h-10 bg-primary-900/50 border border-primary-800/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-800/60 transition-all">
                                    <Icon className="text-primary-400 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{title}</p>
                                    <p className="text-xs text-gray-500">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Featured Products */}
            <section className="py-16 bg-gray-950/50">
                <div className="page-container">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="section-heading">⭐ Featured Products</h2>
                            <p className="section-subheading">Our most-loved Dandiya collection</p>
                        </div>
                        <Link to="/products" className="btn-ghost text-sm hidden sm:flex items-center gap-1">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {featured.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-8 sm:hidden">
                        <Link to="/products" className="btn-secondary">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* Bulk Discount Banner */}
            <section className="py-12">
                <div className="page-container">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900 via-maroon-800 to-primary-900 p-8 md:p-12 border border-primary-800/50">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                        </div>
                        <div className="relative flex flex-col md:flex-row items-center gap-8">
                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                                    🎊 Bulk Order Discount!
                                </h2>
                                <p className="text-gray-300 text-lg mb-2">
                                    Purchase <span className="text-gold-400 font-bold">10 or more</span> dandiya sticks and get{' '}
                                    <span className="text-gold-400 font-bold">15% OFF</span> automatically!
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Discount code <span className="badge-gold">DANDIYA10</span> applied at checkout. No minimum purchase required!
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-7xl md:text-8xl font-display font-bold text-gradient-gold">15%</div>
                                <p className="text-gray-400">Bulk Discount</p>
                                <Link to="/products" className="btn-gold mt-4 text-sm">Shop Now →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marquee */}
            <div className="bg-primary-600 py-3 overflow-hidden">
                <div className="flex gap-8 animate-[marquee_20s_linear_infinite]" style={{ width: 'max-content' }}>
                    {Array(4).fill([
                        { text: 'Premium Dandiya', icon: FiStar },
                        { text: 'Secure Checkout', icon: FiSolidShield },
                        { text: 'Custom Designs', icon: FiTrendingUp },
                        { text: 'Great Quality', icon: FiPackage },
                        { text: '15% Bulk Discount', icon: FiGift }
                    ]).flat().map((item, i) => (
                        <span key={i} className="text-white font-semibold text-sm whitespace-nowrap flex items-center gap-2">
                            <item.icon className="text-lg text-gold-400" /> {item.text} <span className="text-primary-300 mx-2">●</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
