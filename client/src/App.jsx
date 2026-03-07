import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReports from './pages/admin/AdminReports';

// Main layout wrapper
const MainLayout = ({ children }) => (
    <div className="flex flex-col min-h-screen z-[1] relative">
        <Navbar />
        <main className="flex-1 flex flex-col z-0 relative">{children}</main>
        <Footer />
    </div>
);

function App() {
    return (
        <Routes>
            {/* Admin routes (no main Navbar/Footer) */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="reports" element={<AdminReports />} />
            </Route>

            {/* Public & user routes (with Navbar/Footer) */}
            <Route
                path="/"
                element={
                    <MainLayout>
                        <HomePage />
                    </MainLayout>
                }
            />
            <Route
                path="/products"
                element={
                    <MainLayout>
                        <ProductsPage />
                    </MainLayout>
                }
            />
            <Route
                path="/products/:id"
                element={
                    <MainLayout>
                        <ProductDetailPage />
                    </MainLayout>
                }
            />
            <Route
                path="/about"
                element={
                    <MainLayout>
                        <AboutUsPage />
                    </MainLayout>
                }
            />
            <Route
                path="/contact"
                element={
                    <MainLayout>
                        <ContactUsPage />
                    </MainLayout>
                }
            />
            <Route
                path="/login"
                element={
                    <MainLayout>
                        <LoginPage />
                    </MainLayout>
                }
            />
            <Route
                path="/register"
                element={
                    <MainLayout>
                        <RegisterPage />
                    </MainLayout>
                }
            />
            <Route
                path="/privacy-policy"
                element={
                    <MainLayout>
                        <PrivacyPolicyPage />
                    </MainLayout>
                }
            />
            <Route
                path="/terms-of-service"
                element={
                    <MainLayout>
                        <TermsOfServicePage />
                    </MainLayout>
                }
            />
            <Route
                path="/refund-policy"
                element={
                    <MainLayout>
                        <RefundPolicyPage />
                    </MainLayout>
                }
            />
            <Route
                path="/shipping-policy"
                element={
                    <MainLayout>
                        <ShippingPolicyPage />
                    </MainLayout>
                }
            />

            {/* Protected routes */}
            <Route
                path="/cart"
                element={
                    <MainLayout>
                        <ProtectedRoute><CartPage /></ProtectedRoute>
                    </MainLayout>
                }
            />
            <Route
                path="/wishlist"
                element={
                    <MainLayout>
                        <ProtectedRoute><WishlistPage /></ProtectedRoute>
                    </MainLayout>
                }
            />
            <Route
                path="/checkout"
                element={
                    <MainLayout>
                        <ProtectedRoute><CheckoutPage /></ProtectedRoute>
                    </MainLayout>
                }
            />
            <Route
                path="/payment-success"
                element={
                    <MainLayout>
                        <ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>
                    </MainLayout>
                }
            />
            <Route
                path="/orders"
                element={
                    <MainLayout>
                        <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
                    </MainLayout>
                }
            />
            <Route
                path="/orders/:id"
                element={
                    <MainLayout>
                        <ProtectedRoute><OrderDetailPage /></ProtectedRoute>
                    </MainLayout>
                }
            />
            <Route
                path="/profile"
                element={
                    <MainLayout>
                        <ProtectedRoute><ProfilePage /></ProtectedRoute>
                    </MainLayout>
                }
            />
        </Routes>
    );
}

export default App;
