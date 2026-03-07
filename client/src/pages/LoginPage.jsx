import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FiTarget as GiDrumsticks } from 'react-icons/fi';

const LoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(form));
        if (!result.error) {
            const role = result.payload.role;
            navigate(role === 'admin' ? '/admin' : '/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-16">
            <div className="w-full max-w-md animate-fade-in">
                {/* Card */}
                <div className="card p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-900/50">
                            <GiDrumsticks className="text-white text-3xl" />
                        </div>
                        <h1 className="text-2xl font-display font-bold text-white">Welcome Back!</h1>
                        <p className="text-gray-400 text-sm mt-1">Sign in to your DandiyaKart account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="input-field pl-10" placeholder="you@example.com" required />
                            </div>
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type={showPass ? 'text' : 'password'} value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="input-field pl-10 pr-10" placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                    {showPass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}

                        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Register here</Link>
                    </p>

                    {/* Demo credentials */}
                    <div className="mt-4 p-3 bg-gray-800/60 rounded-xl">
                        <p className="text-xs text-gray-500 text-center mb-2 font-medium">Demo Credentials</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-gray-700/50 rounded-lg p-2">
                                <p className="text-gold-400 font-medium">Admin</p>
                                <p className="text-gray-400">admin@dandiyakart.com</p>
                                <p className="text-gray-400">admin123456</p>
                            </div>
                            <div className="bg-gray-700/50 rounded-lg p-2">
                                <p className="text-primary-400 font-medium">User</p>
                                <p className="text-gray-400">user@dandiyakart.com</p>
                                <p className="text-gray-400">user123456</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
