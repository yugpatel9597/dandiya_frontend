import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);

    const isWishlisted = wishlistItems.some((item) => item._id === product._id);
    const discount = product.discountPrice > 0
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) { toast.error('Please login to add to cart'); return; }
        dispatch(addToCart({ productId: product._id, quantity: 1 }));
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) { toast.error('Please login to manage wishlist'); return; }
        if (isWishlisted) dispatch(removeFromWishlist(product._id));
        else dispatch(addToWishlist(product._id));
    };

    const imageUrl = product.images?.[0]
        ? (product.images[0].startsWith('/uploads') ? product.images[0] : product.images[0])
        : null;

    return (
        <Link to={`/products/${product._id}`} className="block group">
            <div className="card-hover overflow-hidden transition-all duration-300">
                {/* Image */}
                <div className="relative product-img-zoom aspect-square bg-gradient-to-br from-gray-800 to-gray-900">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=0891b2&color=fff&size=200&bold=true&format=png`;
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <FiTarget className="text-5xl text-gray-600 mx-auto mb-2" />
                                <p className="text-xs text-gray-500 px-2 text-center">{product.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {discount > 0 && (
                            <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                                -{discount}%
                            </span>
                        )}
                        {product.isFeatured && (
                            <span className="bg-gold-500 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-lg">
                                Featured
                            </span>
                        )}
                        {product.stock === 0 && (
                            <span className="bg-gray-700 text-gray-300 text-xs font-bold px-2 py-0.5 rounded-lg">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Wishlist button */}
                    <button
                        onClick={handleWishlist}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${isWishlisted
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-900/80 text-gray-400 hover:bg-red-500 hover:text-white'
                            }`}
                    >
                        <FiHeart className={`text-sm ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Info */}
                <div className="p-4">
                    <p className="text-xs text-primary-400 font-medium mb-1">{product.category}</p>
                    <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-primary-300 transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FiStar
                                    key={star}
                                    className={`text-xs ${star <= Math.round(product.ratings) ? 'star-filled fill-current' : 'star-empty'}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.numReviews})</span>
                    </div>

                    {/* Price & Cart */}
                    <div className="flex items-center justify-between mt-3 gap-2">
                        <div>
                            {product.discountPrice > 0 ? (
                                <>
                                    <span className="text-lg font-bold text-white">₹{product.discountPrice}</span>
                                    <span className="text-sm text-gray-500 line-through ml-1.5">₹{product.price}</span>
                                </>
                            ) : (
                                <span className="text-lg font-bold text-white">₹{product.price}</span>
                            )}
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="w-9 h-9 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-700 text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-primary-600/30 active:scale-95"
                        >
                            <FiShoppingCart className="text-sm" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
