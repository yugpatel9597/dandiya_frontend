import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart } from '../redux/slices/cartSlice';
import { validateCoupon, autoCheckCoupon, removeCoupon } from '../redux/slices/couponSlice';
import { FiTrash2, FiPlus, FiMinus, FiTag, FiArrowRight, FiShoppingCart } from 'react-icons/fi';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, loading } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { applied: coupon, loading: couponLoading, error: couponError } = useSelector((state) => state.coupon);
    const [couponCode, setCouponCode] = useState('');

    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon ? parseFloat(coupon.discountAmount) : 0;
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal - discount + shipping;

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (totalQty >= 10 && !coupon) {
            dispatch(autoCheckCoupon({ totalQuantity: totalQty, cartTotal: subtotal }));
        }
    }, [totalQty, subtotal]);

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;
        dispatch(validateCoupon({ code: couponCode, cartTotal: subtotal, totalQuantity: totalQty, userId: user?._id }));
    };

    if (items.length === 0) {
        return (
            <div className="pt-24 pb-16 min-h-screen">
                <div className="page-container text-center py-20">
                    <div className="text-8xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                    <p className="text-gray-400 mb-6">Add some amazing Dandiya sticks to get started!</p>
                    <Link to="/products" className="btn-primary">Shop Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="page-container">
                <h1 className="section-heading mb-8">Shopping Cart ({totalQty} items)</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.product?._id} className="card p-4 flex gap-4">
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                                    {item.product?.images?.[0] ? (
                                        <img src={item.product.images[0]} alt={item.product?.name} className="w-full h-full object-cover"
                                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product?.name || 'P')}&background=c2410c&color=fff&size=80`; }} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">🎋</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/products/${item.product?._id}`} className="font-semibold text-white hover:text-primary-400 transition-colors line-clamp-1">
                                        {item.product?.name}
                                    </Link>
                                    <p className="text-xs text-gray-500 mt-0.5">{item.product?.category}</p>
                                    <p className="text-primary-400 font-bold mt-1">₹{item.price}</p>
                                </div>
                                <div className="flex flex-col items-end justify-between">
                                    <button onClick={() => dispatch(removeFromCart(item.product?._id))} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                                        <FiTrash2 />
                                    </button>
                                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg border border-gray-700 p-1">
                                        <button onClick={() => dispatch(updateCartItem({ productId: item.product?._id, quantity: item.quantity - 1 }))}
                                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-all">
                                            <FiMinus className="text-xs" />
                                        </button>
                                        <span className="text-white font-semibold w-6 text-center text-sm">{item.quantity}</span>
                                        <button onClick={() => dispatch(updateCartItem({ productId: item.product?._id, quantity: item.quantity + 1 }))}
                                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-all">
                                            <FiPlus className="text-xs" />
                                        </button>
                                    </div>
                                    <p className="text-sm font-semibold text-white">₹{(item.price * item.quantity).toFixed(0)}</p>
                                </div>
                            </div>
                        ))}

                        {/* Bulk hint */}
                        {totalQty >= 8 && totalQty < 10 && (
                            <div className="p-3 bg-gold-900/20 border border-gold-700/40 rounded-xl text-sm text-gold-300">
                                🎉 Add {10 - totalQty} more stick{10 - totalQty > 1 ? 's' : ''} to get 15% bulk discount!
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                        {/* Coupon */}
                        <div className="card p-5">
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><FiTag /> Apply Coupon</h3>
                            {coupon ? (
                                <div className="p-3 bg-green-900/20 border border-green-700/40 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-300 font-semibold text-sm">{coupon.code}</p>
                                            <p className="text-xs text-gray-400">{coupon.discountPercentage}% off</p>
                                        </div>
                                        <button onClick={() => dispatch(removeCoupon())} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Enter code" className="input-field py-2.5 text-sm flex-1" />
                                    <button onClick={handleApplyCoupon} disabled={couponLoading} className="btn-primary py-2.5 px-4 text-sm whitespace-nowrap">
                                        Apply
                                    </button>
                                </div>
                            )}
                            {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                        </div>

                        {/* Summary */}
                        <div className="card p-5">
                            <h3 className="font-semibold text-white mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal ({totalQty} items)</span>
                                    <span>₹{subtotal.toFixed(0)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount ({coupon?.code})</span>
                                        <span>-₹{discount.toFixed(0)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? <span className="text-green-400">FREE</span> : `₹${shipping}`}</span>
                                </div>
                                <div className="divider" />
                                <div className="flex justify-between text-white font-bold text-base">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(0)}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate('/checkout')} className="btn-gold w-full mt-5 py-3.5 font-bold text-base">
                                Proceed to Checkout <FiArrowRight />
                            </button>
                            <Link to="/products" className="btn-ghost w-full mt-2 text-sm justify-center">
                                <FiShoppingCart /> Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
