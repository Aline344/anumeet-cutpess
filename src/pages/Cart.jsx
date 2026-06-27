import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Sparkles, Percent, Gift } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/ui/Toast';

export default function Cart() {
  const navigate = useNavigate();
  const showToast = useToast();
  
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    toggleWholesaleMode, 
    activeCoupon, 
    applyCoupon, 
    removeCoupon,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal
  } = useCart();

  const [couponCode, setCouponCode] = useState("");

  const handleQtyChange = (productId, qty, wholesaleMode) => {
    updateQuantity(productId, qty, wholesaleMode);
  };

  const handleRemove = (productId, wholesaleMode) => {
    removeFromCart(productId, wholesaleMode);
    showToast("Item removed from cart.", "info");
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      applyCoupon(couponCode);
      showToast("Coupon applied successfully!", "success");
      setCouponCode("");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99;
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">🛒</div>
        <h2 className="text-2xl font-bold uppercase text-navy-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">Explore our premium fabrics catalogue to load your cart. Wholesale discounts available on every design!</p>
        <Link to="/shop" className="px-6 py-2.5 bg-navy-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl inline-block transition-all hover:bg-red-600">
          Browse Fabrics
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold uppercase text-navy-900 tracking-wide">Shopping Cart</h1>
        <p className="text-xs text-slate-400">Review your chosen items, adjust quantities, or toggle wholesale packages.</p>
        <div className="h-0.5 w-12 bg-luxury-gold"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Item Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header labels */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <div className="col-span-6">Item / Material</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.wholesaleMode}`} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
                  
                  {/* Fabric Info */}
                  <div className="col-span-6 flex gap-4">
                    <div className="h-20 w-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-navy-900 line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Model: {item.wholesaleMode ? 'B2B Wholesale' : 'B2C Retail'}</p>
                      
                      {/* Controls for small screens */}
                      <div className="flex items-center gap-3 pt-1">
                        <button 
                          onClick={() => toggleWholesaleMode(item.productId, item.wholesaleMode)}
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${item.wholesaleMode ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                        >
                          {item.wholesaleMode ? 'Wholesale Price' : 'Switch Wholesale'}
                        </button>
                        <button 
                          onClick={() => handleRemove(item.productId, item.wholesaleMode)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold text-[9px]"
                        >
                          <Trash2 size={10} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className="col-span-2 text-left md:text-center">
                    <p className="md:hidden text-[9px] font-bold uppercase text-slate-400 leading-none mb-1">Unit Price</p>
                    <span className="font-bold text-navy-900">₹{item.price}</span>
                  </div>

                  {/* Quantity selector */}
                  <div className="col-span-2 flex justify-start md:justify-center">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white h-8">
                      <button 
                        onClick={() => handleQtyChange(item.productId, item.quantity - 1, item.wholesaleMode)}
                        className="px-2 h-full hover:text-red-600 font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-navy-900">{item.quantity}</span>
                      <button 
                        onClick={() => handleQtyChange(item.productId, item.quantity + 1, item.wholesaleMode)}
                        className="px-2 h-full hover:text-red-600 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-2 text-right">
                    <p className="md:hidden text-[9px] font-bold uppercase text-slate-400 leading-none mb-1">Subtotal</p>
                    <span className="font-extrabold text-navy-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Sourcing warning alerts */}
          {cart.some(item => item.wholesaleMode) && (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 text-xs flex gap-3 items-start">
              <Sparkles size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-wider text-[9px] text-emerald-700 leading-none mb-1">Wholesale Discount Applied</p>
                <p className="text-emerald-600">Some fabrics in your cart are set to wholesale volumes. We have applied custom bulk discounts. Please note that B2B batches are packaged as continuous single logs.</p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Summary Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Promo code form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-bold text-xs uppercase text-navy-900 tracking-wide pb-2 border-b border-slate-100">Discount Coupon</h4>
            {activeCoupon ? (
              <div className="flex justify-between items-center bg-slate-900 text-white p-3 rounded-xl">
                <div className="flex items-center gap-2 text-xs">
                  <Gift size={14} className="text-luxury-gold" />
                  <div>
                    <p className="font-bold tracking-widest text-[10px] text-luxury-gold">{activeCoupon.code}</p>
                    <p className="text-[9px] text-slate-400">{activeCoupon.discountPercent}% Discount Applied</p>
                  </div>
                </div>
                <button onClick={removeCoupon} className="text-xs text-red-500 hover:text-red-400 font-bold">Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="WELCOME10, FESTIVE20" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs flex-grow placeholder-slate-400 focus:outline-none"
                />
                <button type="submit" className="px-4 py-2 bg-navy-900 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                  Apply
                </button>
              </form>
            )}
            <div className="text-[10px] text-slate-400 flex flex-col gap-1">
              <p>💡 Tip: Use <span className="font-bold text-slate-600">WELCOME10</span> to save 10% on checkout.</p>
              <p>💡 Wholesale code: <span className="font-bold text-slate-600">BHOPALWHOLESALE</span> (min ₹5,000).</p>
            </div>
          </div>

          {/* Pricing calculations details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-bold text-xs uppercase text-navy-900 tracking-wide pb-2 border-b border-slate-100">Order Summary</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-navy-900">₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1"><Percent size={12} /> Coupon Discount</span>
                  <span className="font-bold">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 pb-2 border-b border-slate-50">
                <span>Estimated Shipping</span>
                <span className="font-bold text-navy-900">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 uppercase font-bold text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Free Shipping</span>
                  ) : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              
              {shipping > 0 && (
                <div className="bg-slate-50 p-2.5 rounded-xl text-[10px] text-slate-400 flex items-center gap-2">
                  <span>🚀 Add <span className="font-bold text-slate-600">₹{(1500 - subtotal).toFixed(2)}</span> more to unlock <span className="font-bold text-emerald-600">Free Shipping</span>!</span>
                </div>
              )}

              <div className="flex justify-between text-sm pt-2">
                <span className="font-bold text-navy-900">Grand Total</span>
                <span className="font-extrabold text-navy-900 text-base">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate("/checkout")}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-red-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Proceed To Checkout <ArrowRight size={12} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
