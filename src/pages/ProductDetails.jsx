/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Plus, Minus, Ruler, Send } from 'lucide-react';
import { db } from '../services/firebase';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/ui/Toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed, recentlyViewed } = useCart();

  // Load product list and individual product
  const products = React.useMemo(() => db.getProducts() || [], []);
  const product = React.useMemo(() => products.find(p => p.id === id), [products, id]);

  // State
  const [activeImage, setActiveImage] = useState(product ? product.image : "");
  const [quantity, setQuantity] = useState(1);
  const [wholesaleMode, setWholesaleMode] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // description, specifications
  
  // Fabric Calculator State
  const [calcOpen, setCalcOpen] = useState(false);
  const [dressType, setDressType] = useState("kurti"); // kurti, anarkali, lehenga, blouse, salwar
  const [heightType, setHeightType] = useState("average"); // short, average, tall
  const [bodySize, setBodySize] = useState("regular"); // regular, heavy

  // Review submission state
  const [reviews, setReviews] = useState([]);
  const [ratingInput, setRatingInput] = useState(5);
  const [userInput, setUserInput] = useState("");
  const [commentInput, setCommentInput] = useState("");

  // Hook into reviews database and sync recently viewed
  useEffect(() => {
    if (product) {
      setReviews(db.getReviews(product.id));
      addRecentlyViewed(product);
      setActiveImage(product.image);
      // Reset quantity on product switch
      setQuantity(wholesaleMode ? product.wholesaleMoq : 1);
    }
  }, [id, product, addRecentlyViewed]);

  // Fallback if product not found - must be after all hook declarations!
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold uppercase text-navy-900">Fabric Not Found</h2>
        <p className="text-xs text-slate-500">The fabric you requested is not listed in our boutique catalog.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-navy-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Adjust quantity based on wholesale toggle
  const handleWholesaleToggle = () => {
    const newMode = !wholesaleMode;
    setWholesaleMode(newMode);
    if (newMode) {
      setQuantity(Math.max(quantity, product.wholesaleMoq));
      showToast(`Wholesale mode activated! Min order: ${product.wholesaleMoq} meters.`, "info");
    } else {
      setQuantity(1);
    }
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    const minVal = wholesaleMode ? product.wholesaleMoq : 1;
    if (quantity > minVal) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, wholesaleMode);
    showToast(`Added ${quantity}${product.unit === 'piece' ? 'pcs' : 'm'} of ${product.name} to cart!`, "success");
  };

  const handleBuyNow = () => {
    window.open(getWhatsAppLink(), "_blank");
  };

  // Compile pre-filled WhatsApp link
  const getWhatsAppLink = () => {
    const isPiece = product.unit === 'piece';
    const unitLabel = isPiece ? 'piece' : 'meter';
    const unitPlural = isPiece ? 'pieces' : 'meters';
    const priceStr = wholesaleMode 
      ? `Wholesale Rate: ₹${product.wholesalePrice}/${unitLabel}` 
      : `Retail Rate: ₹${product.pricePerMeter}/${unitLabel}`;
    const text = `Hello Anumeet Katpiece Bhopal! I am interested in purchasing this ${isPiece ? 'item' : 'fabric'}:
*Name:* ${product.name}
*SKU:* ${product.sku}
*Quantity:* ${quantity} ${unitPlural}
*Pricing:* ${priceStr}
Please confirm stock and availability. Thank you!`;
    return `https://wa.me/919131264893?text=${encodeURIComponent(text)}`;
  };

  // Fabric meter calculator handler
  const handleCalculateMeters = () => {
    let meters = 2.0; // default base

    if (dressType === "kurti") {
      meters = heightType === "tall" ? 2.5 : 2.0;
      if (bodySize === "heavy") meters += 0.5;
    } else if (dressType === "anarkali") {
      meters = heightType === "tall" ? 4.5 : 3.5;
      if (bodySize === "heavy") meters += 1.0;
    } else if (dressType === "lehenga") {
      meters = heightType === "tall" ? 6.0 : 5.0;
      if (bodySize === "heavy") meters += 1.0;
    } else if (dressType === "blouse") {
      meters = bodySize === "heavy" ? 1.0 : 0.8;
    } else if (dressType === "salwar") {
      meters = bodySize === "heavy" ? 3.0 : 2.5;
    }

    setQuantity(meters);
    setCalcOpen(false);
    showToast(`Calculator recommended ${meters} meters! Set as order length.`, "success");
  };

  // Submit Review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || !commentInput.trim()) {
      return alert("Please enter your name and comment.");
    }
    const newRev = db.addReview({
      productId: product.id,
      user: userInput,
      rating: ratingInput,
      comment: commentInput
    });
    setReviews(prev => [newRev, ...prev]);
    showToast("Thank you for your rating!", "success");
    setUserInput("");
    setCommentInput("");
  };

  // Similar Products Filtering
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
      {/* Back button */}
      <div>
        <Link to="/shop" className="text-xs text-slate-400 hover:text-red-600 transition-colors uppercase font-bold tracking-wider">
          ← Back to Catalog
        </Link>
      </div>

      {/* Main product card layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        
        {/* Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
            />
            {wholesaleMode && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow uppercase tracking-wider">
                B2B Wholesale Price
              </span>
            )}
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${activeImage === img ? 'border-luxury-gold scale-95' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details info */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{product.category}</span>
              <div className="flex items-center gap-0.5 text-luxury-gold font-bold text-xs">
                ★ {product.rating} <span className="text-slate-400 font-normal">({reviews.length} reviews)</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-navy-900 uppercase tracking-wide leading-tight">{product.name}</h1>
            <p className="text-xs text-slate-400 font-mono">SKU: {product.sku}</p>
          </div>

          {/* Sourcing pricing toggle */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Pricing Model</p>
              <h4 className="text-xs font-bold text-slate-600">Toggle B2B wholesale pricing</h4>
            </div>
            <button 
              onClick={handleWholesaleToggle}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all ${wholesaleMode ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-navy-900 border-slate-200 hover:border-navy-900'}`}
            >
              {wholesaleMode ? '✅ Wholesale On' : 'Activate Wholesale'}
            </button>
          </div>

          {/* Product pricing meters info */}
          <div className="flex items-baseline gap-4 py-2 border-b border-slate-50">
            {wholesaleMode ? (
              <>
                <span className="text-2xl font-extrabold text-emerald-600">₹{product.wholesalePrice}<span className="text-xs text-slate-500 font-normal">/{product.unit === 'piece' ? 'piece' : 'meter'}</span></span>
                <span className="text-xs text-slate-400 line-through">₹{product.pricePerMeter}/{product.unit === 'piece' ? 'pc' : 'm'}</span>
                <span className="text-[9px] font-bold text-red-600 uppercase bg-red-50 border border-red-100 px-2 py-0.5 rounded">MOQ: {product.wholesaleMoq} {product.unit === 'piece' ? 'pieces' : 'meters'}</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-extrabold text-navy-900">₹{product.pricePerMeter}<span className="text-xs text-slate-500 font-normal">/{product.unit === 'piece' ? 'piece' : 'meter'}</span></span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Wholesale pricing available</span>
              </>
            )}
          </div>

          {/* Fabric Calculator Trigger */}
          {product.unit !== 'piece' && (
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                  <Ruler size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-navy-900 uppercase tracking-wider">Fabric Meter Calculator</h4>
                  <p className="text-[10px] text-slate-400">Not sure how much fabric you need? Calculate instantly.</p>
                </div>
              </div>
              <button 
                onClick={() => setCalcOpen(!calcOpen)}
                className="text-[10px] text-red-600 hover:text-red-700 font-bold uppercase tracking-wider underline cursor-pointer"
              >
                Open Calculator
              </button>
            </div>
          )}

         
          {product.unit !== 'piece' && calcOpen && (
            <div className="p-5 border border-slate-100 bg-white rounded-2xl shadow-sm space-y-4">
              <h4 className="font-bold text-xs uppercase text-navy-900 tracking-wide pb-2 border-b border-slate-50">Bespoke Meter Estimator</h4>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Outfit Type */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Dress Outfit Type</label>
                  <select 
                    value={dressType} 
                    onChange={(e) => setDressType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="kurti">Regular Kurti</option>
                    <option value="anarkali">Anarkali Suit</option>
                    <option value="lehenga">Heavy Lehenga</option>
                    <option value="salwar">Salwar / Patiala</option>
                    <option value="blouse">Saree Blouse</option>
                  </select>
                </div>

                {/* User Height */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Height Parameters</label>
                  <select 
                    value={heightType} 
                    onChange={(e) => setHeightType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="short">Short (4'11" - 5'2")</option>
                    <option value="average">Average (5'3" - 5'6")</option>
                    <option value="tall">Tall (5'7"+)</option>
                  </select>
                </div>

                {/* Fitting size */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Fit & Styling</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                      <input 
                        type="radio" 
                        name="bodySize" 
                        checked={bodySize === "regular"}
                        onChange={() => setBodySize("regular")} 
                        className="accent-red-600"
                      /> Regular Fit (Size S/M/L)
                    </label>
                    <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                      <input 
                        type="radio" 
                        name="bodySize" 
                        checked={bodySize === "heavy"}
                        onChange={() => setBodySize("heavy")} 
                        className="accent-red-600"
                      /> Plus Size / Flared Fit (XL+)
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-50">
                <button onClick={() => setCalcOpen(false)} className="px-4 py-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                  Cancel
                </button>
                <button onClick={handleCalculateMeters} className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-colors">
                  Calculate & Apply
                </button>
              </div>
            </div>
          )}

          {/* Quantity selector & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white h-12">
                <button 
                  onClick={handleDecrement}
                  className="px-4 h-full hover:text-red-600 text-slate-500 font-bold transition-colors cursor-pointer"
                  aria-label="Decrease Quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-navy-900">
                  {quantity}
                </span>
                <button 
                  onClick={handleIncrement}
                  className="px-4 h-full hover:text-red-600 text-slate-500 font-bold transition-colors cursor-pointer"
                  aria-label="Increase Quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-slate-400 font-bold uppercase">{product.unit === 'piece' ? 'Pieces' : 'Meters'}</span>

              <button 
                onClick={() => toggleWishlist(product)} 
                className={`h-12 w-12 border border-slate-200 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${isInWishlist(product.id) ? 'bg-red-50 text-red-600 border-red-100' : 'hover:border-red-600 hover:text-red-600 bg-white'}`}
                aria-label="Favorite"
              >
                <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="px-6 h-12 bg-white border border-navy-900 text-navy-900 hover:bg-slate-50 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Add To Cart
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="px-6 h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-red-600/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Buy Now
              </button>
              <a 
                href={getWhatsAppLink()}
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>

          {/* Additional details tabs */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex gap-6 border-b border-slate-50 text-xs font-bold uppercase tracking-wider pb-2">
              <button 
                onClick={() => setActiveTab("description")} 
                className={`pb-2 transition-colors cursor-pointer ${activeTab === "description" ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Story & Drape
              </button>
              <button 
                onClick={() => setActiveTab("specifications")} 
                className={`pb-2 transition-colors cursor-pointer ${activeTab === "specifications" ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Boutique Specs
              </button>
            </div>
            
            <div className="pt-4 text-xs text-slate-500 leading-relaxed min-h-[80px]">
              {activeTab === "description" ? (
                <p>{product.description}</p>
              ) : (
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <p><span className="font-bold text-navy-900">Fabric base:</span> {product.fabricType}</p>
                  <p><span className="font-bold text-navy-900">Width:</span> {product.width}</p>
                  <p><span className="font-bold text-navy-900">Weight:</span> {product.weight}</p>
                  <p><span className="font-bold text-navy-900">Primary Color:</span> {product.color}</p>
                  <p><span className="font-bold text-navy-900">Color ID:</span> <span className="inline-block w-2.5 h-2.5 border border-slate-200 rounded-full align-middle mr-1" style={{ backgroundColor: product.colorHex }}></span>{product.colorHex}</p>
                  <p><span className="font-bold text-navy-900">Store stock:</span> {product.stock > 0 ? `${product.stock} meters` : 'Sold out'}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Reviews rating module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        {/* Reviews List */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="font-bold text-base uppercase text-navy-900 tracking-wide pb-3 border-b border-slate-100">
            Reviews ({reviews.length})
          </h3>
          
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-navy-900 uppercase tracking-wide">{rev.user}</span>
                    <span className="text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5 text-luxury-gold text-xs">
                    {[...Array(5)].map((_, i) => <span key={i}>{i < rev.rating ? '★' : '☆'}</span>)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              No reviews yet for this fabric. Be the first boutique owner to review!
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-fit">
          <h4 className="font-bold text-xs uppercase text-navy-900 tracking-wide pb-2 border-b border-slate-100">Write a Review</h4>
          
          <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Rating Star</label>
              <select 
                value={ratingInput} 
                onChange={(e) => setRatingInput(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value="4">⭐⭐⭐⭐☆ 4 Stars</option>
                <option value="3">⭐⭐⭐☆☆ 3 Stars</option>
                <option value="2">⭐⭐☆☆☆ 2 Stars</option>
                <option value="1">⭐☆☆☆☆ 1 Star</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Your Name / Boutique</label>
              <input 
                type="text" 
                placeholder="Priya Shrishti" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Feedback Comment</label>
              <textarea 
                rows="3" 
                placeholder="Write your drape observations here..." 
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none resize-none"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-navy-900 hover:bg-red-600 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 transition-all cursor-pointer">
              Submit Review <Send size={10} />
            </button>
          </form>
        </div>
      </div>

      {/* Related items list */}
      {related.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-bold text-base uppercase text-navy-900 tracking-wide pb-3 border-b border-slate-100">
            Similar Materials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((prod) => (
              <Link 
                to={`/product/${prod.id}`}
                key={prod.id} 
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">{prod.category}</span>
                  <h4 className="font-bold text-xs text-navy-900 line-clamp-1 group-hover:text-red-600 transition-colors leading-tight">{prod.name}</h4>
                  <p className="text-xs font-bold text-navy-900 pt-1">₹{prod.pricePerMeter}/m</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed items list */}
      {recentlyViewed.length > 1 && (
        <div className="space-y-6">
          <h3 className="font-bold text-base uppercase text-navy-900 tracking-wide pb-3 border-b border-slate-100">
            Recently Viewed
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyViewed.filter(p => p.id !== product.id).slice(0, 6).map((prod) => (
              <Link 
                to={`/product/${prod.id}`}
                key={prod.id} 
                className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center space-y-2"
              >
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img src={prod.image} alt="" className="w-full h-full object-cover" />
                </div>
                <h5 className="font-bold text-[10px] text-navy-900 line-clamp-1 leading-tight">{prod.name}</h5>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
