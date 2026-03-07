import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';

const PaymentSuccessPage = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="pt-24 pb-16 min-h-screen flex items-center">
            <div className="page-container max-w-lg text-center animate-fade-in">
                <div className="card p-10">
                    <div className="w-20 h-20 bg-green-900/30 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle className="text-green-400 text-4xl" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-3">Order Placed! 🎉</h1>
                    <p className="text-gray-400 mb-6">
                        Your Dandiya sticks are on their way! You'll receive a confirmation email shortly.
                    </p>
                    {orderId && (
                        <div className="p-3 bg-gray-800 rounded-xl mb-6">
                            <p className="text-xs text-gray-500">Order ID</p>
                            <p className="text-sm text-primary-400 font-mono font-semibold mt-0.5">{orderId}</p>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {orderId && (
                            <Link to={`/orders/${orderId}`} className="btn-primary">
                                <FiPackage /> Track Order
                            </Link>
                        )}
                        <Link to="/orders" className="btn-secondary">
                            My Orders
                        </Link>
                        <Link to="/products" className="btn-ghost">
                            Continue Shopping <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
