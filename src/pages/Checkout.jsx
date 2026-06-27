import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, User, MapPin, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { useToast } from '../components/ui/Toast';
import { RazorpaySimulation } from '../services/razorpay';

export default function Checkout() {
  const navigate = useNavigate();
  const showToast = useToast();
  
  const { cart, getCartSubtotal, getCartDiscount, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  // If cart is empty, send back to cart
  React.useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Stepper state
  const [step, setStep] = useState(1); // 1: Contact, 2: Address, 3: Shipping, 4: Payment

  // Forms data state
  const [formData, setFormData] = useState({
    // Contact
    email: currentUser?.email || "",
    fullName: currentUser?.name || "",
    mobile: "+91 ",
    // Address
    street: "",
    landmark: "",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "",
    // Shipping option
    shippingSpeed: "standard", // standard, express, pickup
    // Payment
    paymentMethod: "Razorpay" // Razorpay, COD
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    // Basic validation
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.email.trim() || formData.mobile.length < 10) {
        return alert("Please fill out your contact details correctly.");
      }
    } else if (step === 2) {
      if (!formData.street.trim() || formData.pincode.length < 6) {
        return alert("Please enter a valid shipping address and 6-digit PIN code.");
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  // Compile totals
  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  
  let shippingPrice = subtotal > 1500 ? 0 : 99;
  if (formData.shippingSpeed === "express") shippingPrice += 150;
  if (formData.shippingSpeed === "pickup") shippingPrice = 0;

  const total = subtotal - discount + shippingPrice;

  // Complete Order
  const handlePlaceOrder = () => {
    const orderItems = cart.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      wholesaleMode: item.wholesaleMode
    }));

    const orderPayload = {
      userId: currentUser?.id || "guest-" + Math.floor(Math.random() * 10000),
      userEmail: formData.email,
      userName: formData.fullName,
      items: orderItems,
      totalAmount: total,
      address: {
        fullName: formData.fullName,
        mobile: formData.mobile,
        street: formData.street + (formData.landmark ? `, ${formData.landmark}` : ""),
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      paymentMethod: formData.paymentMethod,
      shippingSpeed: formData.shippingSpeed
    };

    if (formData.paymentMethod === "Razorpay") {
      // Init simulated payment
      const razorpaySimObj = new RazorpaySimulation({
        key: "rzp_test_demokey12345",
        amount: Math.round(total * 100), // in paise
        currency: "INR",
        name: "ANUMEET KATPIECE",
        description: `Order Payment for ${formData.fullName}`,
        image: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=200",
        handler: function (response) {
          // Success Callback
          const finalizedOrder = db.addOrder({
            ...orderPayload,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            paymentStatus: "Paid"
          });
          
          triggerOrderSuccess(finalizedOrder.id, finalizedOrder);
        },
        modal: {
          ondismiss: function() {
            showToast("Payment window closed. Order was not placed.", "error");
          }
        }
      });
      razorpaySimObj.open();
    } else {
      // Cash on Delivery
      const finalizedOrder = db.addOrder(orderPayload);
      triggerOrderSuccess(finalizedOrder.id, finalizedOrder);
    }
  };

  const triggerOrderSuccess = (orderId, order) => {
    // Celebratory confetti trigger
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    
    showToast(`Order ${orderId} placed successfully!`, "success");
    
    // Compile and open WhatsApp message
    if (order) {
      const itemsText = order.items.map(item => 
        `• ${item.name} (${item.quantity}m @ ₹${item.price}/m) = ₹${(item.price * item.quantity).toFixed(0)}`
      ).join('\n');
      
      const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const whatsappMessage = `🛍️ *NEW FABRIC ORDER ON ANUMEET KATPIECE*
---------------------------------------
*Order ID:* ${order.id}
*Customer Name:* ${order.userName}
*Email:* ${order.userEmail}
*Mobile:* ${order.address.mobile}

📍 *Shipping Address:*
${order.address.fullName}
${order.address.street}
${order.address.city}, ${order.address.state} - ${order.address.pincode}

🚚 *Shipping Speed:* ${order.shippingSpeed.toUpperCase()}
💳 *Payment Method:* ${order.paymentMethod} (Payment Status: ${order.paymentStatus})

✨ *Fabrics Ordered:*
${itemsText}

💰 *Financial Details:*
- Subtotal: ₹${subtotal.toFixed(0)}
- Order Total: ₹${order.totalAmount.toFixed(0)}
---------------------------------------
Thank you for shopping with Anumeet Katpiece Bhopal!`;

      const whatsappUrl = `https://wa.me/919131264893?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
    
    clearCart();
    navigate(`/account?tab=orders&highlight=${orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold uppercase text-navy-900 tracking-wide">Checkout</h1>
        {/* Stepper indicators */}
        <div className="flex gap-4 items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span className={step === 1 ? 'text-red-600' : step > 1 ? 'text-navy-900' : ''}>1. Contact</span>
          <span>•</span>
          <span className={step === 2 ? 'text-red-600' : step > 2 ? 'text-navy-900' : ''}>2. Address</span>
          <span>•</span>
          <span className={step === 3 ? 'text-red-600' : step > 3 ? 'text-navy-900' : ''}>3. Shipping</span>
          <span>•</span>
          <span className={step === 4 ? 'text-red-600' : ''}>4. Payment</span>
        </div>
        <div className="h-0.5 w-12 bg-luxury-gold"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Step forms panel */}
        <main className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          
          {/* STEP 1: Billing contact */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase text-navy-900 tracking-wider pb-2 border-b border-slate-50 flex items-center gap-2">
                <User size={14} className="text-luxury-gold" /> Customer Sourcing Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Full Name / Boutique Manager</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Sunita Sharma" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Mobile Phone (WhatsApp Notifications)</label>
                  <input 
                    type="text" 
                    name="mobile" 
                    value={formData.mobile} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="+91 9827011223" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Email Address (Invoices & Updates)</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="sunita@example.com" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Address */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase text-navy-900 tracking-wider pb-2 border-b border-slate-50 flex items-center gap-2">
                <MapPin size={14} className="text-luxury-gold" /> Delivery Destination Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Street Address / House No.</label>
                  <input 
                    type="text" 
                    name="street" 
                    value={formData.street} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Makan No. 24, Near Arera Colony" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Landmark (Optional)</label>
                  <input 
                    type="text" 
                    name="landmark" 
                    value={formData.landmark} 
                    onChange={handleInputChange} 
                    placeholder="Near Jain Temple" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">PIN Code (6-digit)</label>
                  <input 
                    type="text" 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="462016" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    readOnly 
                    className="w-full px-3 py-2 border border-slate-100 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">State</label>
                  <input 
                    type="text" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    readOnly 
                    className="w-full px-3 py-2 border border-slate-100 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Shipping */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase text-navy-900 tracking-wider pb-2 border-b border-slate-50 flex items-center gap-2">
                <Truck size={14} className="text-luxury-gold" /> Shipping Delivery Speeds
              </h3>
              <div className="space-y-3 text-xs">
                
                {/* Standard */}
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-600 cursor-pointer bg-white transition-all">
                  <div className="flex gap-3 items-center">
                    <input 
                      type="radio" 
                      name="shippingSpeed" 
                      value="standard" 
                      checked={formData.shippingSpeed === "standard"} 
                      onChange={handleInputChange}
                      className="accent-red-600"
                    />
                    <div>
                      <h4 className="font-bold text-navy-900">Standard Delivery</h4>
                      <p className="text-[10px] text-slate-400">Delivery in 3 to 5 business days all across India.</p>
                    </div>
                  </div>
                  <span className="font-bold text-navy-900">{subtotal > 1500 ? 'FREE' : '₹99'}</span>
                </label>

                {/* Express */}
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-600 cursor-pointer bg-white transition-all">
                  <div className="flex gap-3 items-center">
                    <input 
                      type="radio" 
                      name="shippingSpeed" 
                      value="express" 
                      checked={formData.shippingSpeed === "express"} 
                      onChange={handleInputChange}
                      className="accent-red-600"
                    />
                    <div>
                      <h4 className="font-bold text-navy-900">Express Priority Sourcing</h4>
                      <p className="text-[10px] text-slate-400">Guaranteed dispatch in 24 hours. Delivery in 1-2 days.</p>
                    </div>
                  </div>
                  <span className="font-bold text-navy-900">₹{subtotal > 1500 ? '150' : '249'}</span>
                </label>

                {/* Pickup */}
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-600 cursor-pointer bg-white transition-all">
                  <div className="flex gap-3 items-center">
                    <input 
                      type="radio" 
                      name="shippingSpeed" 
                      value="pickup" 
                      checked={formData.shippingSpeed === "pickup"} 
                      onChange={handleInputChange}
                      className="accent-red-600"
                    />
                    <div>
                      <h4 className="font-bold text-navy-900">Bhopal Showroom Pickup</h4>
                      <p className="text-[10px] text-slate-400">Collect order directly from: Makan No. 13, Subhash Nagar Bhopal.</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600">FREE</span>
                </label>

              </div>
            </div>
          )}

          {/* STEP 4: Payment selection */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase text-navy-900 tracking-wider pb-2 border-b border-slate-50 flex items-center gap-2">
                <CreditCard size={14} className="text-luxury-gold" /> Payment Gateways
              </h3>
              <div className="space-y-3 text-xs">
                
                {/* Razorpay Online */}
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-600 cursor-pointer bg-white transition-all">
                  <div className="flex gap-3 items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Razorpay" 
                      checked={formData.paymentMethod === "Razorpay"} 
                      onChange={handleInputChange}
                      className="accent-red-600"
                    />
                    <div>
                      <h4 className="font-bold text-navy-900">Pay Online via Razorpay Secured</h4>
                      <p className="text-[10px] text-slate-400">Cards, Netbanking, UPI, Wallet. (Demo sandbox simulates success via OTP 123456).</p>
                    </div>
                  </div>
                  <span className="text-sm">⚡</span>
                </label>

                {/* Cash on Delivery */}
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-600 cursor-pointer bg-white transition-all">
                  <div className="flex gap-3 items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="COD" 
                      checked={formData.paymentMethod === "COD"} 
                      onChange={handleInputChange}
                      className="accent-red-600"
                    />
                    <div>
                      <h4 className="font-bold text-navy-900">Cash on Delivery (COD)</h4>
                      <p className="text-[10px] text-slate-400">Pay cash/UPI directly at the time of courier receipt.</p>
                    </div>
                  </div>
                  <span className="text-sm">💵</span>
                </label>

              </div>
            </div>
          )}

          {/* Stepper Buttons control */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-50">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                className="px-6 py-2.5 bg-white border border-slate-200 hover:border-navy-900 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft size={12} /> Previous
              </button>
            ) : (
              <Link 
                to="/cart"
                className="px-6 py-2.5 bg-white border border-slate-200 hover:border-navy-900 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft size={12} /> Back to Cart
              </Link>
            )}

            {step < 4 ? (
              <button 
                onClick={nextStep}
                className="px-6 py-2.5 bg-navy-900 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                Continue <ArrowRight size={12} />
              </button>
            ) : (
              <button 
                onClick={handlePlaceOrder}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-red-600/10 cursor-pointer flex items-center gap-2"
              >
                Complete Payment ₹{total.toFixed(2)}
              </button>
            )}
          </div>

        </main>

        {/* Right order summary review card */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-white/5 shadow-xl space-y-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-luxury-gold pb-2 border-b border-white/5">Cart Items Review</h4>
            
            {/* List */}
            <div className="divide-y divide-white/5 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.wholesaleMode}`} className="py-3 flex items-center justify-between text-xs gap-3">
                  <div className="flex gap-3 items-center min-w-0">
                    <img src={item.image} alt="" className="h-10 w-8 object-cover rounded-lg shrink-0 border border-white/10" />
                    <div className="min-w-0">
                      <h5 className="font-bold truncate text-slate-200 leading-tight">{item.name}</h5>
                      <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                        {item.quantity} {item.unit === 'piece' ? (item.quantity === 1 ? 'piece' : 'pieces') : 'meters'} @ ₹{item.price}/{item.unit === 'piece' ? 'pc' : 'm'}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-200 shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Calculations summaries */}
            <div className="space-y-2 text-xs pt-4 border-t border-white/5">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 pb-2">
                <span>Estimated Shipping</span>
                <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(0)}`}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/5 font-extrabold text-white">
                <span className="text-luxury-gold">Total Amount</span>
                <span className="text-luxury-gold text-base">₹{total.toFixed(0)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-400 leading-relaxed border-t border-white/5">
              <ShieldCheck size={16} className="text-luxury-gold shrink-0" />
              <span>We protect your boutique data with secure SSL transactions. Sourced locally inside Bhopal, India.</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
