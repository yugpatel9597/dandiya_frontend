import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FiTarget as GiDrumsticks } from 'react-icons/fi';

const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const [formError, setFormError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (form.password !== form.confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setFormError('Password must be at least 6 characters');
            return;
        }
        const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
        if (!result.error) navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-24">
            <div className="w-full max-w-md animate-fade-in">
                <div className="card p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-900/50">
                            <GiDrumsticks className="text-white text-3xl" />
                        </div>
                        <h1 className="text-2xl font-display font-bold text-white">Create Account</h1>
                        <p className="text-gray-400 text-sm mt-1">Join DandiyaKart for the best Navratri deals</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="input-field pl-10" placeholder="Your full name" required />
                            </div>
                        </div>
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
                                    className="input-field pl-10 pr-10" placeholder="Min. 6 characters" required />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                    {showPass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="label">Confirm Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="password" value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    className="input-field pl-10" placeholder="Repeat password" required />
                            </div>
                        </div>

                        {(formError || error) && (
                            <p className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-lg">{formError || error}</p>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
