import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const WishlistPage = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.wishlist);

    useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

    if (loading) return <div className="pt-24"><LoadingSpinner /></div>;

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="page-container">
                <h1 className="section-heading mb-8">My Wishlist</h1>
                {items.length === 0 ? (
                    <div className="card p-16 text-center">
                        <FiHeart className="text-5xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white">Your wishlist is empty</h3>
                        <p className="text-gray-400 mt-2 mb-6">Save your favorite dandiya sticks here!</p>
                        <Link to="/products" className="btn-primary">Browse Products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((product) => (
                            <div key={product._id} className="card-hover overflow-hidden">
                                <Link to={`/products/${product._id}`}>
                                    <div className="aspect-square bg-gray-800 product-img-zoom">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover"
                                                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=c2410c&color=fff&size=200`; }} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl">🎋</div>
                                        )}
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <Link to={`/products/${product._id}`} className="text-sm font-semibold text-white hover:text-primary-400 line-clamp-2">
                                        {product.name}
                                    </Link>
                                    <p className="text-primary-400 font-bold mt-1">₹{product.discountPrice > 0 ? product.discountPrice : product.price}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => dispatch(addToCart({ productId: product._id, quantity: 1 }))}
                                            className="btn-primary flex-1 py-2 text-xs">
                                            <FiShoppingCart /> Add to Cart
                                        </button>
                                        <button onClick={() => dispatch(removeFromWishlist(product._id))}
                                            className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-700 text-red-400 hover:bg-red-900/20 transition-all">
                                            <FiTrash2 className="text-sm" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
