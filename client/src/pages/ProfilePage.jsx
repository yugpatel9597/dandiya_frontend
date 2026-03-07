import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
    });

    const handleSave = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateProfile({
            name: form.name, email: form.email, phone: form.phone,
            address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        }));
        if (!result.error) setEditing(false);
    };

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="page-container max-w-3xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="section-heading">My Profile</h1>
                    <button onClick={() => setEditing(!editing)} className="btn-ghost border border-gray-700 rounded-xl px-4 py-2 text-sm">
                        {editing ? 'Cancel' : <><FiEdit2 /> Edit Profile</>}
                    </button>
                </div>

                {/* Avatar */}
                <div className="card p-6 mb-6 flex items-center gap-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-gold-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        <span className={`mt-1 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${user?.role === 'admin' ? 'badge-gold' : 'badge-primary'}`}>
                            {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSave}>
                    <div className="card p-6 mb-4">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><FiUser /> Personal Info</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { key: 'name', label: 'Full Name', icon: FiUser, type: 'text' },
                                { key: 'email', label: 'Email', icon: FiMail, type: 'email' },
                                { key: 'phone', label: 'Phone', icon: FiPhone, type: 'tel' },
                            ].map(({ key, label, icon: Icon, type }) => (
                                <div key={key}>
                                    <label className="label">{label}</label>
                                    <div className="relative">
                                        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                                        <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                                            className="input-field pl-9 py-2.5 text-sm" disabled={!editing} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><FiMapPin /> Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { key: 'street', label: 'Street', col: 'sm:col-span-2' },
                                { key: 'city', label: 'City', col: '' },
                                { key: 'state', label: 'State', col: '' },
                                { key: 'pincode', label: 'PIN Code', col: '' },
                            ].map(({ key, label, col }) => (
                                <div key={key} className={col}>
                                    <label className="label">{label}</label>
                                    <input type="text" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        className="input-field py-2.5 text-sm" disabled={!editing} />
                                </div>
                            ))}
                        </div>
                        {editing && (
                            <button type="submit" disabled={loading} className="btn-primary mt-5">
                                <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
