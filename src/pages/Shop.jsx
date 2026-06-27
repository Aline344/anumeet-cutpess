import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, Star, ShoppingBag, Heart, Check, RefreshCw } from 'lucide-react';
import { db } from '../services/firebase';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/ui/Toast';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const showToast = useToast();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  // Load products
  const products = db.getProducts();

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedFabric, setSelectedFabric] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [priceRange, setPriceRange] = useState(500); // Max price
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "popular");

  // Sync state from query parameters on mount or query updates
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "All");
    setSortBy(searchParams.get("sort") || "popular");
  }, [searchParams]);

  // Unique categories list
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const fabrics = ["All", ...new Set(products.map(p => p.fabricType))];
  const colors = ["All", ...new Set(products.map(p => p.color))];

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = searchQuery ? (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true;

    // Category filter
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

    // Fabric filter
    const matchesFabric = selectedFabric === "All" || product.fabricType === selectedFabric;

    // Color filter
    const matchesColor = selectedColor === "All" || product.color === selectedColor;

    // Price filter
    const matchesPrice = product.pricePerMeter <= priceRange;

    // Stock filter
    const matchesStock = inStockOnly ? product.stock > 0 : true;

    return matchesSearch && matchesCategory && matchesFabric && matchesColor && matchesPrice && matchesStock;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low-high") return a.pricePerMeter - b.pricePerMeter;
    if (sortBy === "price-high-low") return b.pricePerMeter - a.pricePerMeter;
    if (sortBy === "best-selling") return b.rating - a.rating; // Mock bestselling by rating
    if (sortBy === "newest") return b.isNewArrival ? 1 : -1; // Mock newest
    return b.reviewsCount - a.reviewsCount; // Popular
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedFabric("All");
    setSelectedColor("All");
    setPriceRange(500);
    setInStockOnly(false);
    setSortBy("popular");
    setSearchParams({});
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product, 1);
    const unitLabel = product.unit === 'piece' ? 'piece' : 'meter';
    showToast(`Added 1 ${unitLabel} of ${product.name} to cart!`, "success");
  };

  const handleWishlist = (e, product) => {
    e.preventDefault();
    toggleWishlist(product);
    const added = !isInWishlist(product.id);
    showToast(added ? `Added ${product.name} to wishlist!` : `Removed ${product.name} from wishlist!`, "info");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-red-600">The Catalog</span>
        <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-navy-900">Premium Fabric Store</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">Browse our luxury suite collection. Sourced directly at wholesale rates for custom boutiques across India.</p>
        <div className="h-0.5 w-12 bg-luxury-gold mx-auto"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 1. FILTER SIDEBAR */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-bold text-xs uppercase tracking-wider text-navy-900 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-luxury-gold" /> Filter Settings
              </span>
              <button 
                onClick={handleResetFilters} 
                className="text-[10px] text-red-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={10} /> Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Search Fabric</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="SKU, print name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Category</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSearchParams(prev => {
                        if (cat === "All") prev.delete("category");
                        else prev.set("category", cat);
                        return prev;
                      });
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${selectedCategory === cat ? 'bg-navy-900 text-white font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check size={10} className="text-luxury-gold" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabrics */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Fabric Type</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {fabrics.map(fab => (
                  <button
                    key={fab}
                    onClick={() => setSelectedFabric(fab)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${selectedFabric === fab ? 'bg-navy-900 text-white font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                  >
                    <span>{fab}</span>
                    {selectedFabric === fab && <Check size={10} className="text-luxury-gold" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Color</label>
              <select 
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
              >
                {colors.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Max Price/Meter</label>
                <span className="text-xs font-bold text-navy-900">₹{priceRange}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="500" 
                step="10"
                value={priceRange} 
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>₹50</span>
                <span>₹500</span>
              </div>
            </div>

            {/* Stock Toggle */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">In Stock Only</span>
              <button 
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${inStockOnly ? 'bg-red-600' : 'bg-slate-200'}`}
              >
                <div className={`h-4 w-4 bg-white rounded-full transition-transform ${inStockOnly ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

          </div>
        </aside>

        {/* 2. PRODUCT LAYOUT PANEL */}
        <main className="flex-grow space-y-6">
          {/* Top Sort Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p className="text-slate-500 font-medium">
              Showing <span className="font-bold text-navy-900">{sortedProducts.length}</span> fabrics match search filters
            </p>
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setSearchParams(prev => {
                    prev.set("sort", e.target.value);
                    return prev;
                  });
                }}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white focus:outline-none"
              >
                <option value="popular">Popularity</option>
                <option value="newest">New Arrivals</option>
                <option value="best-selling">Top Rated</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid display */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((prod) => (
                <Link 
                  to={`/product/${prod.id}`}
                  key={prod.id} 
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 group hover:border-luxury-gold/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Photo Wrapper */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Tags overlays */}
                    {prod.stock === 0 ? (
                      <span className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider rounded border border-white/10">
                        Out Of Stock
                      </span>
                    ) : prod.stock < 100 ? (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider rounded">
                        Only {prod.stock}{prod.unit === 'piece' ? ' pcs' : 'm'} Left
                      </span>
                    ) : null}

                    {/* Actions Panel */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={(e) => handleAddToCart(e, prod)}
                        disabled={prod.stock === 0}
                        className="p-3 bg-white text-navy-950 hover:bg-red-600 hover:text-white rounded-full transition-colors cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Add to Cart"
                      >
                        <ShoppingBag size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleWishlist(e, prod)}
                        className={`p-3 rounded-full transition-colors cursor-pointer shadow-lg ${isInWishlist(prod.id) ? 'bg-red-600 text-white' : 'bg-white text-navy-950 hover:bg-red-50'}`}
                        aria-label="Toggle Wishlist"
                      >
                        <Star size={18} fill={isInWishlist(prod.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">{prod.category}</span>
                        <div className="flex items-center gap-0.5 text-luxury-gold font-bold text-[10px]">
                          ⭐ {prod.rating}
                        </div>
                      </div>
                      <h3 className="font-bold text-sm text-navy-900 line-clamp-1 group-hover:text-red-600 transition-colors leading-tight">{prod.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-1">Retail Price</span>
                        <span className="text-sm font-extrabold text-navy-900 leading-none">₹{prod.pricePerMeter}<span className="text-[10px] text-slate-400 font-normal">/{prod.unit === 'piece' ? 'pc' : 'm'}</span></span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-emerald-600 font-bold uppercase leading-none mb-1 bg-emerald-50 px-1 rounded">Bulk Rates</span>
                        <span className="text-xs font-bold text-emerald-600 leading-none">₹{prod.wholesalePrice}/{prod.unit === 'piece' ? 'pc' : 'm'} <span className="text-[8px] text-slate-400 font-normal">(MOQ: {prod.wholesaleMoq}{prod.unit === 'piece' ? 'pcs' : 'm'})</span></span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4">
              <span className="text-4xl">🔎</span>
              <h3 className="font-bold text-lg text-navy-900 uppercase tracking-wide">No Fabrics Match Your Selection</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try clearing search phrases, expanding price parameters, or selecting 'All' categories to view the catalog.</p>
              <button 
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-navy-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-red-600 transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
