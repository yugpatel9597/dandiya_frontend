import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../redux/slices/adminSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, color, sub }) => (
    <div className="card p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
                {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="text-lg text-white" />
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, loading } = useSelector((state) => state.admin);

    useEffect(() => { dispatch(fetchDashboardStats()); }, [dispatch]);

    if (loading && !stats) return <LoadingSpinner />;

    const statusColors = {
        Pending: 'bg-cyan-500',
        Processing: 'bg-blue-500',
        Shipped: 'bg-indigo-500',
        Delivered: 'bg-green-500',
        Cancelled: 'bg-red-500',
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-0.5">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={FiUsers} color="bg-primary-700" />
                <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={FiPackage} color="bg-indigo-700" />
                <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={FiShoppingBag} color="bg-purple-700" />
                <StatCard title="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} icon={FiDollarSign} color="bg-gold-600" sub="Excluding cancelled orders" />
            </div>

            {/* Sales Chart */}
            <div className="card p-6">
                <h3 className="font-semibold text-white mb-5">Monthly Revenue (2024)</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={stats?.salesData || []}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem' }}
                            itemStyle={{ color: '#e5e7eb' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent orders */}
                <div className="card p-5">
                    <h3 className="font-semibold text-white mb-4">Recent Orders</h3>
                    {stats?.recentOrders?.length === 0 ? (
                        <p className="text-gray-500 text-sm">No orders yet</p>
                    ) : (
                        <div className="space-y-3">
                            {stats?.recentOrders?.map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                                    <div>
                                        <p className="text-xs text-gray-400 font-mono">{order._id.slice(-8)}...</p>
                                        <p className="text-sm text-white">{order.user?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-white">₹{order.totalPrice}</p>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${statusColors[order.orderStatus]}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order breakdown */}
                <div className="card p-5">
                    <h3 className="font-semibold text-white mb-4">Order Status Breakdown</h3>
                    <div className="space-y-3">
                        {stats?.orderStatusBreakdown?.map(({ _id, count }) => (
                            <div key={_id} className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${statusColors[_id] || 'bg-gray-500'}`} />
                                <span className="text-sm text-gray-400 flex-1">{_id}</span>
                                <span className="text-sm font-semibold text-white">{count}</span>
                                <div className="w-20 bg-gray-800 rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full ${statusColors[_id] || 'bg-gray-500'}`}
                                        style={{ width: `${Math.min(100, (count / (stats?.totalOrders || 1)) * 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
