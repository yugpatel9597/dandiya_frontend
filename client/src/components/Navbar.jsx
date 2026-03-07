import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
    FiShoppingCart, FiHeart, FiUser, FiMenu, FiX,
    FiLogOut, FiPackage, FiSettings, FiSearch
} from 'react-icons/fi';
import { FiTarget as GiDrumsticks } from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const { items: cartItems } = useSelector((state) => state.cart);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setIsOpen(false); setShowUserMenu(false); }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/products?keyword=${searchQuery}`);
    };

    const handleLogout = () => { dispatch(logout()); navigate('/'); };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact Us' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-gray-800'
                : 'bg-transparent'
                }`}
        >
            <div className="page-container">
                <div className="flex items-center justify-between h-16 lg:h-18">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 z-50 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all shadow-lg shadow-primary-500/30">
                            <GiDrumsticks className="text-white text-xl" />
                        </div>
                        <span className="text-2xl font-display font-bold text-gradient hidden sm:block">
                            HarshDandiya
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Search bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 w-56">
                        <FiSearch className="text-gray-500 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search dandiya..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
                        />
                    </form>

                    {/* Right icons */}
                    <div className="flex items-center gap-1">
                        {user ? (
                            <>
                                <Link to="/wishlist" className="btn-ghost relative p-2">
                                    <FiHeart className="text-xl" />
                                </Link>
                                <Link to="/cart" className="btn-ghost relative p-2">
                                    <FiShoppingCart className="text-xl" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* User dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-gold-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="hidden sm:block text-sm text-gray-300 max-w-[80px] truncate">{user.name}</span>
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 top-12 w-48 card border border-gray-700 py-2 shadow-xl animate-slide-up">
                                            {user.role === 'admin' && (
                                                <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gold-400 hover:bg-white/5 transition-colors">
                                                    <FiSettings /> Admin Panel
                                                </Link>
                                            )}
                                            <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                                <FiUser /> Profile
                                            </Link>
                                            <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                                <FiPackage /> My Orders
                                            </Link>
                                            <div className="divider my-1" />
                                            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors">
                                                <FiLogOut /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn-ghost text-sm px-3 py-2">Login</Link>
                                <Link to="/register" className="btn-primary text-sm px-4 py-2">Register</Link>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden btn-ghost p-2 ml-1"
                        >
                            {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden py-4 border-t border-gray-800 animate-slide-up">
                        {/* Mobile search */}
                        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 mb-4">
                            <FiSearch className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search dandiya..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
                            />
                        </form>
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
