import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { applied: coupon } = useSelector((state) => state.coupon);
    const { loading } = useSelector((state) => state.orders);

    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [shipping, setShipping] = useState({
        name: user?.name || '', phone: user?.phone || '',
        street: user?.address?.street || '', city: user?.address?.city || '',
        state: user?.address?.state || '', pincode: user?.address?.pincode || '',
        country: 'India',
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon ? parseFloat(coupon.discountAmount) : 0;
    const shippingCost = subtotal > 999 ? 0 : 99;
    const total = subtotal - discount + shippingCost;

    const handlePlaceOrder = async () => {
        const orderItems = items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            image: item.product.images?.[0] || '',
            price: item.price,
            quantity: item.quantity,
        }));

        if (paymentMethod === 'Razorpay') {
            try {
                const { data } = await api.post('/payment/create-order', { amount: total });
                const options = {
                    key: data.data.key,
                    amount: data.data.amount,
                    currency: data.data.currency,
                    name: 'DandiyaKart',
                    description: 'Order Payment',
                    order_id: data.data.id,
                    handler: async (response) => {
                        const orderData = {
                            orderItems, shippingAddress: shipping,
                            paymentMethod: 'Razorpay',
                            itemsPrice: subtotal, shippingPrice: shippingCost,
                            totalPrice: total, discountApplied: discount,
                            couponUsed: coupon?.code || '',
                        };
                        const result = await dispatch(createOrder(orderData));
                        if (!result.error) {
                            await api.post('/payment/verify', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: result.payload._id,
                            });
                            dispatch(clearCartLocal());
                            navigate('/payment-success', { state: { orderId: result.payload._id } });
                        }
                    },
                    prefill: { name: user?.name, email: user?.email, contact: shipping.phone },
                    theme: { color: '#f97316' },
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            } catch (err) {
                toast.error('Payment initialization failed. Please try again.');
            }
        } else {
            // COD
            const orderData = {
                orderItems, shippingAddress: shipping,
                paymentMethod: 'COD',
                itemsPrice: subtotal, shippingPrice: shippingCost,
                totalPrice: total, discountApplied: discount,
                couponUsed: coupon?.code || '',
            };
            const result = await dispatch(createOrder(orderData));
            if (!result.error) {
                dispatch(clearCartLocal());
                navigate('/payment-success', { state: { orderId: result.payload._id } });
            }
        }
    };

    return (
        <div className="pt-24 pb-16 min-h-screen">
            {/* Load Razorpay script */}
            {typeof window !== 'undefined' && !window.Razorpay && (
                <script src="https://checkout.razorpay.com/v1/checkout.js" async />
            )}

            <div className="page-container max-w-5xl">
                <h1 className="section-heading mb-8">Checkout</h1>

                {/* Steps */}
                <div className="flex items-center gap-2 mb-8">
                    {[{ n: 1, label: 'Shipping', icon: FiMapPin }, { n: 2, label: 'Payment', icon: FiCreditCard }, { n: 3, label: 'Review', icon: FiPackage }].map(({ n, label, icon: Icon }) => (
                        <div key={n} className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${step >= n ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                                <Icon className="text-base" /> {label}
                            </div>
                            {n < 3 && <div className={`h-0.5 w-8 rounded ${step > n ? 'bg-primary-500' : 'bg-gray-700'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <div className="card p-6 animate-fade-in">
                                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2"><FiMapPin className="text-primary-400" /> Shipping Address</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { key: 'name', label: 'Full Name', placeholder: 'Recipient name', col: 'sm:col-span-1' },
                                        { key: 'phone', label: 'Phone Number', placeholder: '+91 XXXXX XXXXX', col: 'sm:col-span-1' },
                                        { key: 'street', label: 'Street Address', placeholder: 'House no, street name', col: 'sm:col-span-2' },
                                        { key: 'city', label: 'City', placeholder: 'City', col: '' },
                                        { key: 'state', label: 'State', placeholder: 'State', col: '' },
                                        { key: 'pincode', label: 'PIN Code', placeholder: '6-digit PIN', col: '' },
                                    ].map(({ key, label, placeholder, col }) => (
                                        <div key={key} className={col}>
                                            <label className="label">{label}</label>
                                            <input type="text" value={shipping[key]} onChange={e => setShipping({ ...shipping, [key]: e.target.value })}
                                                className="input-field" placeholder={placeholder} required />
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => {
                                    if (!shipping.name || !shipping.phone || !shipping.street || !shipping.city || !shipping.pincode) {
                                        toast.error('Please fill all required fields');
                                        return;
                                    }
                                    setStep(2);
                                }} className="btn-primary mt-6 px-8">Continue to Payment →</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="card p-6 animate-fade-in">
                                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2"><FiCreditCard className="text-primary-400" /> Payment Method</h2>
                                <div className="space-y-3">
                                    {[
                                        { value: 'Razorpay', label: 'Razorpay (Cards, UPI, Net Banking)', desc: 'Secure online payment via Razorpay', icon: '💳' },
                                        { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                                    ].map(opt => (
                                        <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === opt.value ? 'border-primary-500 bg-primary-900/20' : 'border-gray-700 hover:border-gray-600'}`}>
                                            <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value}
                                                onChange={() => setPaymentMethod(opt.value)} className="accent-primary-500" />
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{opt.icon}</span>
                                                <div>
                                                    <p className="text-white font-medium text-sm">{opt.label}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button onClick={() => setStep(1)} className="btn-ghost border border-gray-700 rounded-xl px-6">← Back</button>
                                    <button onClick={() => setStep(3)} className="btn-primary px-8">Review Order →</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="card p-6 animate-fade-in space-y-4">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2"><FiPackage className="text-primary-400" /> Review Order</h2>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {items.map(item => (
                                        <div key={item.product?._id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                                            <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                                                {item.product?.images?.[0] ? (
                                                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                                                ) : <div className="w-full h-full flex items-center justify-center text-base">🎋</div>}
                                            </div>
                                            <span className="text-gray-300 text-sm flex-1 line-clamp-1">{item.product?.name}</span>
                                            <span className="text-gray-500 text-xs">×{item.quantity}</span>
                                            <span className="text-white text-sm font-semibold">₹{(item.price * item.quantity).toFixed(0)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 bg-gray-800/60 rounded-xl text-sm text-gray-400 space-y-1">
                                    <p className="font-medium text-white">Delivering to: {shipping.name}</p>
                                    <p>{shipping.street}, {shipping.city}, {shipping.state} - {shipping.pincode}</p>
                                    <p>Phone: {shipping.phone}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setStep(2)} className="btn-ghost border border-gray-700 rounded-xl px-6">← Back</button>
                                    <button onClick={handlePlaceOrder} disabled={loading} className="btn-gold flex-1 py-3.5 font-bold text-base">
                                        {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(0)}`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary sidebar */}
                    <div className="card p-5 h-fit">
                        <h3 className="font-semibold text-white mb-3">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{subtotal}</span></div>
                            {discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-₹{discount.toFixed(0)}</span></div>}
                            <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{shippingCost === 0 ? <span className="text-green-400">FREE</span> : `₹${shippingCost}`}</span></div>
                            <div className="divider" />
                            <div className="flex justify-between font-bold text-white text-base"><span>Total</span><span>₹{total.toFixed(0)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
