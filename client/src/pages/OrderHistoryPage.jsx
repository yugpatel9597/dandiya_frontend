import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPackage, FiEye } from 'react-icons/fi';

const statusColors = {
    Pending: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50',
    Processing: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    Shipped: 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50',
    Delivered: 'bg-green-900/40 text-green-300 border-green-700/50',
    Cancelled: 'bg-red-900/40 text-red-300 border-red-700/50',
};

const OrderHistoryPage = () => {
    const dispatch = useDispatch();
    const { myOrders, loading } = useSelector((state) => state.orders);

    useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

    if (loading) return <div className="pt-24"><LoadingSpinner /></div>;

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="page-container">
                <h1 className="section-heading mb-8">My Orders</h1>
                {myOrders.length === 0 ? (
                    <div className="card p-16 text-center">
                        <FiPackage className="text-5xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white">No orders yet</h3>
                        <p className="text-gray-400 mt-2 mb-6">Start shopping to see your orders here.</p>
                        <Link to="/products" className="btn-primary">Shop Now</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myOrders.map((order) => (
                            <div key={order._id} className="card p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-mono">{order._id}</p>
                                        <p className="text-sm text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                                        <span className="font-bold text-white">₹{order.totalPrice}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {order.orderItems?.slice(0, 3).map((item, i) => (
                                        <div key={i} className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : <div className="w-full h-full flex items-center justify-center text-base">🎋</div>}
                                        </div>
                                    ))}
                                    {order.orderItems?.length > 3 && (
                                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                                            +{order.orderItems.length - 3}
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-500 self-center ml-1">{order.orderItems?.length} item{order.orderItems?.length > 1 ? 's' : ''}</span>
                                </div>
                                <Link to={`/orders/${order._id}`} className="btn-ghost text-sm border border-gray-700 rounded-xl px-4 py-2">
                                    <FiEye /> View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
