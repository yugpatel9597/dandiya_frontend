import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../redux/slices/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const statusIcons = {
    Pending: FiClock, Processing: FiPackage, Shipped: FiTruck, Delivered: FiCheckCircle, Cancelled: FiXCircle
};

const OrderDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedOrder: order, loading } = useSelector((state) => state.orders);

    useEffect(() => { dispatch(fetchOrderById(id)); }, [id, dispatch]);

    if (loading) return <div className="pt-24"><LoadingSpinner /></div>;
    if (!order) return <div className="pt-24 py-20 text-center text-gray-400">Order not found</div>;

    const currentStep = statusSteps.indexOf(order.orderStatus);

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="page-container max-w-4xl">
                <Link to="/orders" className="btn-ghost mb-6 -ml-2">← Back to Orders</Link>
                <h1 className="text-2xl font-bold text-white mb-2">Order Details</h1>
                <p className="text-gray-500 text-sm font-mono mb-8">{order._id}</p>

                {/* Status tracker */}
                {order.orderStatus !== 'Cancelled' ? (
                    <div className="card p-6 mb-6">
                        <div className="flex items-start justify-between">
                            {statusSteps.map((step, i) => {
                                const Icon = statusIcons[step];
                                const isDone = currentStep >= i;
                                const isCurrent = currentStep === i;
                                return (
                                    <div key={step} className="flex flex-col items-center gap-2 flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-primary-600 border-primary-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-600'} ${isCurrent ? 'ring-4 ring-primary-500/30' : ''}`}>
                                            <Icon className="text-sm" />
                                        </div>
                                        <span className={`text-xs font-medium text-center ${isDone ? 'text-primary-400' : 'text-gray-600'}`}>{step}</span>
                                        {i < statusSteps.length - 1 && (
                                            <div className="absolute hidden sm:block" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="card p-4 mb-6 border-red-900/50 bg-red-900/10">
                        <p className="text-red-400 flex items-center gap-2"><FiXCircle /> This order was cancelled.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div className="card p-5 md:col-span-2">
                        <h3 className="font-semibold text-white mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {order.orderItems?.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                                    <div className="w-12 h-12 rounded-xl bg-gray-700 overflow-hidden flex-shrink-0">
                                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🎋</div>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-medium">{item.name}</p>
                                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-white font-semibold">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping address */}
                    <div className="card p-5">
                        <h3 className="font-semibold text-white mb-3">Shipping Address</h3>
                        <div className="text-sm text-gray-400 space-y-1">
                            <p className="text-white font-medium">{order.shippingAddress?.name}</p>
                            <p>{order.shippingAddress?.street}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                            <p>Phone: {order.shippingAddress?.phone}</p>
                        </div>
                    </div>

                    {/* Payment & Price */}
                    <div className="card p-5">
                        <h3 className="font-semibold text-white mb-3">Payment Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-400"><span>Method</span><span className="text-white">{order.paymentMethod}</span></div>
                            <div className="flex justify-between text-gray-400"><span>Status</span><span className={order.isPaid ? 'text-green-400' : 'text-cyan-400'}>{order.isPaid ? '✓ Paid' : 'Pending'}</span></div>
                            {order.discountApplied > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-₹{order.discountApplied.toFixed(0)}</span></div>}
                            {order.couponUsed && <div className="flex justify-between text-gray-400"><span>Coupon</span><span className="badge-primary">{order.couponUsed}</span></div>}
                            <div className="divider" />
                            <div className="flex justify-between font-bold text-white text-base"><span>Total</span><span>₹{order.totalPrice}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
