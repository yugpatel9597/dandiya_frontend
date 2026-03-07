import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const emptyForm = {
    code: '', discountPercentage: '', minPurchaseAmount: '0',
    expiryDate: '', usageLimit: '100', autoApplyOnQuantity: '',
    description: '', isActive: true,
};

const AdminCoupons = () => {
    const dispatch = useDispatch();
    const { coupons, loading } = useSelector((state) => state.admin);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => { dispatch(fetchCoupons()); }, [dispatch]);

    const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (c) => {
        setEditing(c);
        setForm({
            code: c.code, discountPercentage: c.discountPercentage, minPurchaseAmount: c.minPurchaseAmount,
            expiryDate: new Date(c.expiryDate).toISOString().split('T')[0],
            usageLimit: c.usageLimit, autoApplyOnQuantity: c.autoApplyOnQuantity || '',
            description: c.description || '', isActive: c.isActive,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, discountPercentage: Number(form.discountPercentage), minPurchaseAmount: Number(form.minPurchaseAmount), usageLimit: Number(form.usageLimit), autoApplyOnQuantity: form.autoApplyOnQuantity ? Number(form.autoApplyOnQuantity) : null };
        const action = editing ? updateCoupon({ id: editing._id, data: payload }) : createCoupon(payload);
        const result = await dispatch(action);
        if (!result.error) setShowModal(false);
    };

    const handleDelete = (id, code) => {
        if (!window.confirm(`Delete coupon "${code}"?`)) return;
        dispatch(deleteCoupon(id));
    };

    return (
        <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-white">Coupons</h1>
                    <p className="text-sm text-gray-400">{coupons.length} coupons</p>
                </div>
                <button onClick={openAdd} className="btn-primary text-sm"><FiPlus /> Add Coupon</button>
            </div>

            {loading ? <LoadingSpinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {coupons.map((coupon) => {
                        const isExpired = new Date() > new Date(coupon.expiryDate);
                        return (
                            <div key={coupon._id} className={`card p-5 border ${isExpired || !coupon.isActive ? 'border-gray-700/30 opacity-60' : 'border-primary-800/30'}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <span className="text-lg font-bold text-white font-mono">{coupon.code}</span>
                                        <p className="text-xs text-gray-500 mt-0.5">{coupon.description || 'No description'}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(coupon)} className="w-7 h-7 rounded-lg bg-blue-900/30 text-blue-400 hover:bg-blue-800/50 flex items-center justify-center transition-all">
                                            <FiEdit2 className="text-xs" />
                                        </button>
                                        <button onClick={() => handleDelete(coupon._id, coupon.code)} className="w-7 h-7 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-800/50 flex items-center justify-center transition-all">
                                            <FiTrash2 className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-xs text-gray-400">
                                    <div className="flex justify-between">
                                        <span>Discount</span>
                                        <span className="text-primary-400 font-semibold">{coupon.discountPercentage}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Min Purchase</span>
                                        <span className="text-white">₹{coupon.minPurchaseAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Used / Limit</span>
                                        <span className="text-white">{coupon.usedCount} / {coupon.usageLimit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Expires</span>
                                        <span className={isExpired ? 'text-red-400' : 'text-green-400'}>
                                            {new Date(coupon.expiryDate).toLocaleDateString('en-IN')}
                                        </span>
                                    </div>
                                    {coupon.autoApplyOnQuantity && (
                                        <div className="mt-2 p-2 bg-gold-900/20 border border-gold-700/30 rounded-lg">
                                            <p className="text-gold-300 text-[10px] font-medium">⚡ Auto-applies on {coupon.autoApplyOnQuantity}+ items</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 flex gap-1.5">
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${coupon.isActive && !isExpired ? 'badge-green' : 'badge-red'}`}>
                                        {isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-white">{editing ? 'Edit Coupon' : 'Create Coupon'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="label">Coupon Code</label>
                                    <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field text-sm font-mono uppercase" placeholder="e.g. SAVE20" required disabled={!!editing} />
                                </div>
                                <div>
                                    <label className="label">Discount (%)</label>
                                    <input type="number" value={form.discountPercentage} onChange={e => setForm({ ...form, discountPercentage: e.target.value })} className="input-field text-sm" min="1" max="100" required />
                                </div>
                                <div>
                                    <label className="label">Min Purchase (₹)</label>
                                    <input type="number" value={form.minPurchaseAmount} onChange={e => setForm({ ...form, minPurchaseAmount: e.target.value })} className="input-field text-sm" min="0" />
                                </div>
                                <div>
                                    <label className="label">Expiry Date</label>
                                    <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="input-field text-sm" required />
                                </div>
                                <div>
                                    <label className="label">Usage Limit</label>
                                    <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} className="input-field text-sm" min="1" />
                                </div>
                                <div className="col-span-2">
                                    <label className="label">Auto-Apply on Quantity ≥</label>
                                    <input type="number" value={form.autoApplyOnQuantity} onChange={e => setForm({ ...form, autoApplyOnQuantity: e.target.value })} className="input-field text-sm" placeholder="e.g. 10 (leave empty to disable)" min="1" />
                                </div>
                                <div className="col-span-2">
                                    <label className="label">Description</label>
                                    <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field text-sm" placeholder="Internal description" />
                                </div>
                                <div className="col-span-2 flex items-center gap-3">
                                    <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-primary-500 w-4 h-4" />
                                    <label htmlFor="isActive" className="text-sm text-gray-300 cursor-pointer">Coupon is active</label>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 border border-gray-700 rounded-xl">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">{editing ? 'Update Coupon' : 'Create Coupon'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;
