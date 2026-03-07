import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiChevronDown } from 'react-icons/fi';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColors = {
    Pending: 'text-cyan-300 bg-cyan-900/30 border-cyan-700/40',
    Processing: 'text-blue-300 bg-blue-900/30 border-blue-700/40',
    Shipped: 'text-indigo-300 bg-indigo-900/30 border-indigo-700/40',
    Delivered: 'text-green-300 bg-green-900/30 border-green-700/40',
    Cancelled: 'text-red-300 bg-red-900/30 border-red-700/40',
};

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { allOrders, loading, page, pages, total } = useSelector((state) => state.orders);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        dispatch(fetchAllOrders({ page: currentPage, pageSize: 15, status: statusFilter }));
    }, [dispatch, currentPage, statusFilter]);

    const handleStatusChange = async (orderId, status) => {
        setUpdatingId(orderId);
        await dispatch(updateOrderStatus({ id: orderId, status }));
        setUpdatingId(null);
        dispatch(fetchAllOrders({ page: currentPage, pageSize: 15, status: statusFilter }));
    };

    return (
        <div className="space-y-5 animate-fade-in">
            <div>
                <h1 className="text-xl font-bold text-white">Orders</h1>
                <p className="text-sm text-gray-400">{total} total orders</p>
            </div>

            <div className="flex items-center gap-3">
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="select-field text-sm py-2.5 w-auto">
                    <option value="">All Statuses</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {loading ? <LoadingSpinner /> : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400">
                                    <th className="text-left px-4 py-3">Order ID</th>
                                    <th className="text-left px-4 py-3">Customer</th>
                                    <th className="text-left px-4 py-3 hidden md:table-cell">Date</th>
                                    <th className="text-left px-4 py-3">Total</th>
                                    <th className="text-left px-4 py-3">Status</th>
                                    <th className="text-left px-4 py-3">Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allOrders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{order._id.slice(-10)}...</td>
                                        <td className="px-4 py-3">
                                            <p className="text-white">{order.user?.name}</p>
                                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-4 py-3 text-white font-semibold">₹{order.totalPrice}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[order.orderStatus]}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.orderStatus}
                                                disabled={updatingId === order._id || order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}
                                                onChange={e => handleStatusChange(order._id, e.target.value)}
                                                className="select-field text-xs py-1.5 w-auto"
                                            >
                                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {pages > 1 && (
                        <div className="flex items-center gap-2 justify-center p-4 border-t border-gray-800">
                            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setCurrentPage(p)}
                                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${p === currentPage ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
