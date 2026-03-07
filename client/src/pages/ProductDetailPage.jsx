import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchRelatedProducts, submitReview } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiHeart, FiShoppingCart, FiStar, FiPlus, FiMinus, FiChevronLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedProduct: product, relatedProducts, loading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);

    const [qty, setQty] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const isWishlisted = wishlistItems.some(item => item._id === id);

    useEffect(() => {
        dispatch(fetchProductById(id));
        dispatch(fetchRelatedProducts(id));
        window.scrollTo(0, 0);
    }, [id, dispatch]);

    if (loading) return <div className="pt-24"><LoadingSpinner fullScreen /></div>;
    if (!product) return <div className="pt-24 text-center text-gray-400 py-20">Product not found</div>;

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    const discount = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

    const handleAddToCart = () => {
        if (!user) { toast.error('Please login to add to cart'); navigate('/login'); return; }
        dispatch(addToCart({ productId: product._id, quantity: qty }));
    };

    const handleWishlist = () => {
        if (!user) { toast.error('Please login'); return; }
        if (isWishlisted) dispatch(removeFromWishlist(product._id));
        else dispatch(addToWishlist(product._id));
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) { toast.error('Please login to review'); return; }
        const result = await dispatch(submitReview({ id: product._id, reviewData: { rating, comment } }));
        if (!result.error) {
            toast.success('Review submitted!');
            setComment('');
            dispatch(fetchProductById(id));
        } else {
            toast.error(result.payload || 'Failed to submit review');
        }
    };

    const imageUrl = product.images?.[selectedImage]
        ? product.images[selectedImage]
        : null;

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="page-container">
                {/* Back */}
                <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2">
                    <FiChevronLeft /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                    {/* Images */}
                    <div className="space-y-3">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 product-img-zoom">
                            {imageUrl ? (
                                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=c2410c&color=fff&size=400&bold=true&format=png`; }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center flex-col">
                                    <div className="text-8xl mb-4">🎋</div>
                                    <p className="text-gray-500 text-sm text-center px-4">{product.name}</p>
                                </div>
                            )}
                        </div>
                        {product.images?.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {product.images.map((img, i) => (
                                    <button key={i} onClick={() => setSelectedImage(i)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary-500' : 'border-gray-700 hover:border-gray-500'}`}>
                                        <img src={img} alt="" className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=c2410c&color=fff&size=64`; }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-5">
                        <div>
                            <span className="badge-primary">{product.category}</span>
                            <h1 className="text-3xl font-display font-bold text-white mt-2">{product.name}</h1>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <FiStar key={s} className={`text-lg ${s <= Math.round(product.ratings) ? 'star-filled fill-current' : 'star-empty'}`} />
                                ))}
                            </div>
                            <span className="text-gray-400 text-sm">{product.ratings?.toFixed(1)} ({product.numReviews} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold text-white">₹{price}</span>
                            {discount > 0 && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                                    <span className="badge-primary text-base px-3 py-1">-{discount}%</span>
                                </>
                            )}
                        </div>

                        {product.stock > 0 ? (
                            <span className="badge-green">✓ In Stock ({product.stock} available)</span>
                        ) : (
                            <span className="badge-red">Out of Stock</span>
                        )}

                        <p className="text-gray-400 leading-relaxed">{product.description}</p>

                        {product.stock >= 10 && (
                            <div className="p-3 bg-gold-900/20 border border-gold-700/40 rounded-xl">
                                <p className="text-gold-300 text-sm font-medium">🎉 Add 10+ to cart for 15% automatic discount!</p>
                            </div>
                        )}

                        {/* Qty + Actions */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-800 rounded-xl border border-gray-700 p-1">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                                    <FiMinus />
                                </button>
                                <span className="font-semibold text-white w-10 text-center">{qty}</span>
                                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                                    <FiPlus />
                                </button>
                            </div>
                            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex-1 py-3">
                                <FiShoppingCart /> Add to Cart
                            </button>
                            <button onClick={handleWishlist}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${isWishlisted ? 'border-red-500 bg-red-500/20 text-red-400' : 'border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-400'}`}>
                                <FiHeart className={isWishlisted ? 'fill-current' : ''} />
                            </button>
                        </div>

                        <div className="divider" />
                        <div className="text-sm text-gray-500 space-y-1">
                            <p>Brand: <span className="text-gray-300">{product.brand}</span></p>
                            {product.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {product.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-lg">#{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* Review form */}
                    {user && (
                        <div className="card p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div>
                                    <label className="label">Your Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button key={s} type="button" onClick={() => setRating(s)}>
                                                <FiStar className={`text-2xl cursor-pointer transition-colors ${s <= rating ? 'star-filled fill-current' : 'star-empty hover:text-gold-400'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Comment</label>
                                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} className="input-field resize-none" placeholder="Share your experience..." required />
                                </div>
                                <button type="submit" className="btn-primary w-full">Submit Review</button>
                            </form>
                        </div>
                    )}

                    {/* Reviews list */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews ({product.numReviews})</h3>
                        {product.reviews?.length === 0 ? (
                            <div className="card p-8 text-center text-gray-500">No reviews yet. Be the first!</div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                                {product.reviews?.map((review) => (
                                    <div key={review._id} className="card p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-white">{review.name}</span>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <FiStar key={s} className={`text-xs ${s <= review.rating ? 'star-filled fill-current' : 'star-empty'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm">{review.comment}</p>
                                        <p className="text-xs text-gray-600 mt-2">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related products */}
                {relatedProducts?.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-6">Related Products</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
