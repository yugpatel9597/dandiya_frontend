import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

const CATEGORIES = ['Garba Dandiya', 'LED Dandiya', 'Designer Dandiya', 'Kids Dandiya', 'Combo Packs'];
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
];

const ProductsPage = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, loading, page, pages, total } = useSelector((state) => state.products);

    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        rating: searchParams.get('rating') || '',
        sort: searchParams.get('sort') || 'newest',
        page: parseInt(searchParams.get('page')) || 1,
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v));
        dispatch(fetchProducts(params));
        setSearchParams(params);
    }, [filters, dispatch]);

    const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    const clearFilters = () => setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', rating: '', sort: 'newest', page: 1 });

    const hasFilters = filters.keyword || filters.category || filters.minPrice || filters.maxPrice || filters.rating;

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="page-container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="section-heading">All Products</h1>
                    <p className="section-subheading">{total > 0 ? `${total} products found` : 'Browse our collection'}</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="card p-5 sticky top-24">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-semibold text-white text-lg">Filters</h3>
                                {hasFilters && (
                                    <button onClick={clearFilters} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                                        <FiX /> Clear All
                                    </button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="mb-5">
                                <label className="label">Search</label>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={filters.keyword}
                                        onChange={(e) => updateFilter('keyword', e.target.value)}
                                        placeholder="Search products..."
                                        className="input-field pl-9 py-2.5 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="mb-5">
                                <label className="label">Category</label>
                                <div className="space-y-2">
                                    {CATEGORIES.map((cat) => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat}
                                                checked={filters.category === cat}
                                                onChange={(e) => updateFilter('category', e.target.value)}
                                                className="accent-primary-500"
                                            />
                                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                    {filters.category && (
                                        <button onClick={() => updateFilter('category', '')} className="text-xs text-primary-400 hover:text-primary-300">Clear category</button>
                                    )}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-5">
                                <label className="label">Price Range (₹)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                                        placeholder="Min"
                                        className="input-field py-2 text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                                        placeholder="Max"
                                        className="input-field py-2 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <label className="label">Minimum Rating</label>
                                <div className="space-y-2">
                                    {[4, 3, 2].map((r) => (
                                        <label key={r} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="rating" value={r} checked={filters.rating === String(r)} onChange={(e) => updateFilter('rating', e.target.value)} className="accent-primary-500" />
                                            <span className="text-sm text-gray-400">{'⭐'.repeat(r)} & above</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products */}
                    <div className="flex-1">
                        {/* Bar */}
                        <div className="flex items-center justify-between mb-5 gap-4">
                            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-ghost gap-2 text-sm border border-gray-700 rounded-xl px-3 py-2">
                                <FiFilter /> Filters
                            </button>
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
                                <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="select-field py-2 text-sm w-auto">
                                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <LoadingSpinner />
                        ) : products.length === 0 ? (
                            <div className="card p-12 text-center">
                                <div className="text-6xl mb-4">🎋</div>
                                <h3 className="text-xl font-semibold text-white">No products found</h3>
                                <p className="text-gray-400 mt-2">Try adjusting your filters or search term</p>
                                <button onClick={clearFilters} className="btn-primary mt-4 mx-auto">Clear Filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                                {/* Pagination */}
                                {pages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                                                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${p === filters.page ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
