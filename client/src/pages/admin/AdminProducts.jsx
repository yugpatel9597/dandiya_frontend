import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { createProduct, updateProduct, deleteProduct } from '../../redux/slices/adminSlice';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['Garba Dandiya', 'LED Dandiya', 'Designer Dandiya', 'Kids Dandiya', 'Combo Packs'];

const emptyForm = { name: '', description: '', price: '', discountPrice: '', category: CATEGORIES[0], brand: 'DandiyaKart', stock: '', isFeatured: false, tags: '' };

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { products, loading, page, pages, total } = useSelector((state) => state.products);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [images, setImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        dispatch(fetchProducts({ page: currentPage, pageSize: 10, keyword }));
    }, [dispatch, currentPage, keyword]);

    const openAdd = () => { setEditing(null); setForm(emptyForm); setImages([]); setShowModal(true); };
    const openEdit = (p) => {
        setEditing(p);
        setForm({ name: p.name, description: p.description, price: p.price, discountPrice: p.discountPrice, category: p.category, brand: p.brand, stock: p.stock, isFeatured: p.isFeatured, tags: p.tags?.join(', ') || '' });
        setImages([]);
        setShowModal(true);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"?`)) return;
        dispatch(deleteProduct(id)).then(() => dispatch(fetchProducts({ page: currentPage, pageSize: 10 })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        images.forEach(img => fd.append('images', img));
        const action = editing ? updateProduct({ id: editing._id, formData: fd }) : createProduct(fd);
        const result = await dispatch(action);
        if (!result.error) {
            setShowModal(false);
            dispatch(fetchProducts({ page: currentPage, pageSize: 10 }));
        }
    };

    return (
        <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-white">Products</h1>
                    <p className="text-sm text-gray-400">{total} total products</p>
                </div>
                <button onClick={openAdd} className="btn-primary text-sm">
                    <FiPlus /> Add Product
                </button>
            </div>

            {/* Search */}
            <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Search products..." className="input-field py-2.5 text-sm max-w-xs" />

            {/* Table */}
            {loading ? <LoadingSpinner /> : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400">
                                    <th className="text-left px-4 py-3">Product</th>
                                    <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                                    <th className="text-left px-4 py-3">Price</th>
                                    <th className="text-left px-4 py-3 hidden sm:table-cell">Stock</th>
                                    <th className="text-left px-4 py-3 hidden lg:table-cell">Rating</th>
                                    <th className="text-left px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p, i) => (
                                    <tr key={p._id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-900/30'}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                                                    {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">🎋</div>}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium line-clamp-1 max-w-[140px]">{p.name}</p>
                                                    {p.isFeatured && <span className="text-[10px] text-gold-400 font-semibold">★ Featured</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-gray-400">{p.category}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-white font-semibold">₹{p.discountPrice > 0 ? p.discountPrice : p.price}</p>
                                            {p.discountPrice > 0 && <p className="text-xs text-gray-500 line-through">₹{p.price}</p>}
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className={`text-xs font-semibold ${p.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>{p.stock}</span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell text-gray-400">
                                            <span className="flex items-center gap-1"><FiStar className="text-gold-400 text-xs" />{p.ratings?.toFixed(1)}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-blue-900/30 text-blue-400 hover:bg-blue-800/50 flex items-center justify-center transition-all">
                                                    <FiEdit2 className="text-xs" />
                                                </button>
                                                <button onClick={() => handleDelete(p._id, p.name)} className="w-8 h-8 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-800/50 flex items-center justify-center transition-all">
                                                    <FiTrash2 className="text-xs" />
                                                </button>
                                            </div>
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-white">{editing ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="label">Product Name</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field text-sm" placeholder="Product name" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="label">Description</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="input-field text-sm resize-none" required />
                                </div>
                                <div>
                                    <label className="label">Price (₹)</label>
                                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-field text-sm" required min="0" />
                                </div>
                                <div>
                                    <label className="label">Discount Price (₹)</label>
                                    <input type="number" value={form.discountPrice} onChange={e => setForm({ ...form, discountPrice: e.target.value })} className="input-field text-sm" min="0" />
                                </div>
                                <div>
                                    <label className="label">Category</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="select-field text-sm">
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Stock</label>
                                    <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="input-field text-sm" required min="0" />
                                </div>
                                <div>
                                    <label className="label">Brand</label>
                                    <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="input-field text-sm" />
                                </div>
                                <div>
                                    <label className="label">Tags (comma-separated)</label>
                                    <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-field text-sm" placeholder="led, premium, navratri" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="label">Product Images</label>
                                    <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))}
                                        className="input-field text-sm py-2.5 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary-700 file:text-white file:text-xs cursor-pointer" />
                                </div>
                                <div className="sm:col-span-2 flex items-center gap-3">
                                    <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="accent-primary-500 w-4 h-4" />
                                    <label htmlFor="featured" className="text-sm text-gray-300 cursor-pointer">Mark as Featured Product</label>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 border border-gray-700 rounded-xl">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">{editing ? 'Update Product' : 'Create Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
