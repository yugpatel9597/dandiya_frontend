import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
    FiHome, FiPackage, FiShoppingBag, FiUsers, FiTag, FiBarChart2,
    FiLogOut, FiMenu, FiX, FiChevronRight
} from 'react-icons/fi';
import { FiTarget as GiDrumsticks } from 'react-icons/fi';

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: FiHome, exact: true },
    { to: '/admin/products', label: 'Products', icon: FiPackage },
    { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
    { to: '/admin/users', label: 'Users', icon: FiUsers },
    { to: '/admin/coupons', label: 'Coupons', icon: FiTag },
    { to: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
];

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => { dispatch(logout()); navigate('/'); };

    const Sidebar = ({ mobile = false }) => (
        <div className={`${mobile ? 'flex flex-col h-full' : 'flex flex-col h-full'}`}>
            {/* Brand */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-gold-500 rounded-xl flex items-center justify-center">
                    <GiDrumsticks className="text-white text-lg" />
                </div>
                <div>
                    <p className="font-display font-bold text-white text-sm">HarshDandiya</p>
                    <p className="text-[10px] text-primary-400 font-medium">Admin Panel</p>
                </div>
                {mobile && (
                    <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-400 hover:text-white">
                        <FiX className="text-xl" />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ to, label, icon: Icon, exact }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={exact}
                        onClick={() => mobile && setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${isActive
                                ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className={`text-base flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                                {label}
                                {isActive && <FiChevronRight className="ml-auto text-primary-400" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User */}
            <div className="px-4 py-4 border-t border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-gold-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-900/20 rounded-xl transition-all">
                    <FiLogOut /> Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-950 overflow-hidden">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800">
                <Sidebar />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="relative w-72 bg-gray-900 border-r border-gray-800 z-10">
                        <Sidebar mobile />
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex items-center gap-4 px-6 py-4 bg-gray-900 border-b border-gray-800">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
                        <FiMenu className="text-xl" />
                    </button>
                    <h1 className="text-sm font-medium text-gray-400">Admin Dashboard</h1>
                    <span className="ml-auto badge-gold">Admin</span>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
