/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { db } from '../services/firebase';
import { useToast } from '../components/ui/Toast';

export default function Account() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const showToast = useToast();
  
  const { currentUser, login, signup, logout, updateProfile, isAdmin } = useAuth();
  const { wishlist, toggleWishlist, addToCart } = useCart();

  // Tab routing control
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "orders");
  const [authTab, setAuthTab] = useState("login"); // login, register

  // Auth Inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regRole, setRegRole] = useState("customer"); // customer, seller

  // Profile Inputs
  const [profName, setProfName] = useState(currentUser?.name || "");
  const [profEmail, setProfEmail] = useState(currentUser?.email || "");

  // Seller Desk Inputs
  const [newProdName, setNewProdName] = useState("");
  const [newProdSku, setNewProdSku] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Kurti Cut Pieces");
  const [newProdSub, setNewProdSub] = useState("");
  const [newProdFabric, setNewProdFabric] = useState("Rayon");
  const [newProdWidth, setNewProdWidth] = useState("44 inches");
  const [newProdWeight, setNewProdWeight] = useState("120 GSM");
  const [newProdColor, setNewProdColor] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdWholesale, setNewProdWholesale] = useState("");
  const [newProdMoq, setNewProdMoq] = useState("");
  const [newProdStock, setNewProdStock] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("https://images.unsplash.com/photo-1584184924103-e310d9d85cfc?auto=format&fit=crop&q=80&w=600");
  const [customImage, setCustomImage] = useState("");
  const [newProdUnit, setNewProdUnit] = useState("meter");

  // Seller Products List
  const [sellerProducts, setSellerProducts] = useState([]);

  const reloadSellerProducts = () => {
    if (currentUser) {
      const allProds = db.getProducts() || [];
      const filtered = allProds.filter(p => p.sellerId === currentUser.id);
      setSellerProducts(filtered);
    }
  };

  // Sync state if query changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
    if (currentUser) {
      setProfName(currentUser.name);
      setProfEmail(currentUser.email);
      reloadSellerProducts();
    }
  }, [searchParams, currentUser]);

  // Load user orders
  const orders = currentUser ? db.getOrders().filter(o => o.userId === currentUser.id) : [];

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      login(loginEmail, loginPass);
      showToast("Signed in successfully!", "success");
      setLoginEmail("");
      setLoginPass("");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    try {
      signup(regName, regEmail, regPass, regRole);
      showToast("Registration completed!", "success");
      setRegName("");
      setRegEmail("");
      setRegPass("");
      setRegRole("customer");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (updateProfile(profName, profEmail)) {
      showToast("Profile details saved.", "success");
    } else {
      showToast("Error updating profile.", "error");
    }
  };

  const handleAddToCartFromWish = (e, prod) => {
    e.preventDefault();
    addToCart(prod, 1);
    showToast(`Added ${prod.name} to cart!`, "success");
  };

  const handleLogout = () => {
    logout();
    showToast("Signed out.", "info");
    navigate("/");
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice || !newProdStock) {
      return showToast("Please fill all required fields.", "error");
    }

    const finalImage = customImage.trim() || newProdImage;

    const newProductPayload = {
      name: newProdName,
      sku: newProdSku || `ETH-CAT-${Math.floor(100 + Math.random() * 900)}`,
      category: newProdCategory,
      subCategory: newProdSub || newProdFabric,
      fabricType: newProdFabric,
      width: newProdWidth,
      weight: newProdWeight,
      color: newProdColor || "Multi-color",
      description: newProdDesc || "Premium quality custom listed fabric materials. Direct boutique sourcing.",
      pricePerMeter: Number(newProdPrice),
      wholesalePrice: Number(newProdWholesale) || Math.round(Number(newProdPrice) * 0.7),
      wholesaleMoq: Number(newProdMoq) || 15,
      stock: Number(newProdStock),
      image: finalImage,
      sellerId: currentUser?.id,
      isBestSeller: false,
      isNewArrival: true,
      unit: newProdUnit
    };

    try {
      db.addProduct(newProductPayload);
      showToast(`${newProdName} added successfully!`, "success");
      // Reset form
      setNewProdName("");
      setNewProdSku("");
      setNewProdSub("");
      setNewProdColor("");
      setNewProdPrice("");
      setNewProdWholesale("");
      setNewProdMoq("");
      setNewProdStock("");
      setNewProdDesc("");
      setCustomImage("");
      setNewProdUnit("meter");
      // Reload lists
      reloadSellerProducts();
    } catch (err) {
      console.error("Failed to add product:", err);
      showToast("Could not list product.", "error");
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this listing from the catalog?")) {
      db.deleteProduct(productId);
      showToast("Product listing deleted.", "info");
      reloadSellerProducts();
    }
  };

  // IF GUEST - Show Auth screen
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-red-600">Member Access</span>
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-navy-900">ANUMEET Catalog</h1>
          <div className="flex justify-center gap-6 border-b border-slate-100 text-xs font-bold uppercase tracking-wider mt-4">
            <button 
              onClick={() => setAuthTab("login")} 
              className={`pb-2 transition-all cursor-pointer ${authTab === "login" ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthTab("register")} 
              className={`pb-2 transition-all cursor-pointer ${authTab === "register" ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Tab Cards */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-xs">
          
          {authTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                  placeholder="customer@example.com" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Password</label>
                  <span className="text-[9px] text-slate-400 hover:underline cursor-pointer">Forgot Password?</span>
                </div>
                <input 
                  type="password" 
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  required 
                  placeholder="••••••••" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-navy-900 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer">
                Sign In
              </button>
              <div className="bg-slate-50 p-3 rounded-xl text-[10px] text-slate-400 space-y-1 leading-relaxed">
                <p>💡 Demo Customer: <span className="font-bold text-slate-600">customer@example.com</span> / password: <span className="font-bold text-slate-600">customer123</span></p>
                <p>💡 Demo Admin: <span className="font-bold text-slate-600">admin@anumeet.com</span> / password: <span className="font-bold text-slate-600">admin123</span></p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required 
                  placeholder="Sunita Sharma" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required 
                  placeholder="new@example.com" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Password</label>
                <input 
                  type="password" 
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  required 
                  placeholder="••••••••" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="space-y-1 py-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Account Type</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="regRole" 
                      value="customer" 
                      checked={regRole === "customer"} 
                      onChange={() => setRegRole("customer")}
                      className="accent-navy-900"
                    />
                    <span className="text-[11px] text-slate-600 font-medium">Boutique Buyer</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="regRole" 
                      value="seller" 
                      checked={regRole === "seller"} 
                      onChange={() => setRegRole("seller")}
                      className="accent-navy-900"
                    />
                    <span className="text-[11px] text-slate-600 font-medium text-gold font-bold">Boutique Seller (List Fabrics)</span>
                  </label>
                </div>
              </div>
              <button type="submit" className="w-full bg-navy-900 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer">
                Create Account
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // IF LOGGED IN - Show Customer Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-4 items-center">
          <div className="h-16 w-16 bg-navy-900 border-2 border-luxury-gold text-white rounded-full flex items-center justify-center font-bold text-xl uppercase">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Member Dashboard</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-navy-900 leading-tight">{currentUser.name}</h1>
            <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          {isAdmin && (
            <Link to="/admin" className="px-5 py-2.5 bg-luxury-gold text-navy-950 font-bold text-xs uppercase tracking-wider rounded-xl text-center flex-grow md:flex-grow-0">
              Admin Area
            </Link>
          )}
          <button onClick={handleLogout} className="px-5 py-2.5 border border-red-600 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider rounded-xl text-center flex-grow md:flex-grow-0 cursor-pointer flex items-center justify-center gap-2">
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Tab Navigation */}
        <aside className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <nav className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider">
            <button 
              onClick={() => { setActiveTab("orders"); setSearchParams({ tab: "orders" }); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${activeTab === "orders" ? 'bg-navy-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <span>📦 Sourcing Orders</span>
              <span className="bg-slate-100 text-navy-950 font-bold text-[9px] px-2 py-0.5 rounded-full">{orders.length}</span>
            </button>
            <button 
              onClick={() => { setActiveTab("wishlist"); setSearchParams({ tab: "wishlist" }); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${activeTab === "wishlist" ? 'bg-navy-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <span>⭐ Fabric Wishlist</span>
              <span className="bg-slate-100 text-navy-950 font-bold text-[9px] px-2 py-0.5 rounded-full">{wishlist.length}</span>
            </button>
            <button 
              onClick={() => { setActiveTab("profile"); setSearchParams({ tab: "profile" }); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${activeTab === "profile" ? 'bg-navy-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              ⚙️ Account Details
            </button>
            {(currentUser.role === "seller" || currentUser.role === "admin") && (
              <button 
                onClick={() => { setActiveTab("sellerDesk"); setSearchParams({ tab: "sellerDesk" }); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${activeTab === "sellerDesk" ? 'bg-navy-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <span>🏢 Seller Desk</span>
                <span className="bg-luxury-gold text-navy-950 font-bold text-[9px] px-2 py-0.5 rounded-full">{sellerProducts.length}</span>
              </button>
            )}
          </nav>
        </aside>

        {/* Right Tab Content Panel */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: Order Timeline logs */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h3 className="font-bold text-sm uppercase text-navy-900 tracking-wide pb-2 border-b border-slate-100">Your Orders</h3>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-xs">
                      
                      {/* Top Bar */}
                      <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <div>
                          <span>Order Date: </span>
                          <span className="text-navy-900">{new Date(ord.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span>ID: </span>
                          <span className="text-navy-900 font-mono text-xs">{ord.id}</span>
                        </div>
                        <div>
                          <span>Status: </span>
                          <span className={`px-2.5 py-0.5 rounded text-[9px] border ${ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ord.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <span>Total: </span>
                          <span className="text-navy-900 text-sm font-extrabold font-mono">₹{ord.totalAmount.toFixed(0)}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-4 divide-y divide-slate-50">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="py-3 flex items-center justify-between gap-4">
                            <div className="flex gap-3 items-center min-w-0">
                              <img src={item.image} alt="" className="h-10 w-8 object-cover rounded-lg border border-slate-100 shrink-0" />
                              <div className="min-w-0">
                                <h4 className="font-bold text-navy-900 truncate leading-tight">{item.name}</h4>
                                <p className="text-[10px] text-slate-400 leading-none mt-1">
                                  {item.quantity} {item.unit === 'piece' ? (item.quantity === 1 ? 'piece' : 'pieces') : 'meters'} @ ₹{item.price}/{item.unit === 'piece' ? 'pc' : 'm'}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-navy-900 shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Timeline steps representation */}
                      {ord.status !== "Cancelled" && (
                        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-4">Courier Tracking Timeline</p>
                          <div className="grid grid-cols-5 gap-2 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400 relative">
                            {/* Connector line */}
                            <div className="absolute top-[7px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0"></div>
                            
                            {ord.trackingTimeline.map((step, sIdx) => (
                              <div key={sIdx} className="space-y-1 relative z-10 flex flex-col items-center">
                                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center font-bold text-[8px] ${step.active ? 'bg-navy-900 border-luxury-gold text-luxury-gold shadow-md' : 'bg-slate-200 border-slate-200 text-slate-400'}`}>
                                  {step.active ? '✓' : ''}
                                </div>
                                <span className={step.active ? 'text-navy-900 font-extrabold' : ''}>{step.status}</span>
                                {step.date && <span className="text-[8px] text-slate-400 font-normal normal-case block leading-none">{new Date(step.date).toLocaleDateString()}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400">
                  No orders placed yet. Visit the catalog store to place your first fabric request!
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Wishlist fabrics */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <h3 className="font-bold text-sm uppercase text-navy-900 tracking-wide pb-2 border-b border-slate-100">Wishlist Material</h3>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {wishlist.map((prod) => (
                    <div key={prod.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between group">
                      <div className="aspect-square overflow-hidden bg-slate-50 relative">
                        <img src={prod.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button 
                          onClick={() => toggleWishlist(prod)}
                          className="absolute top-2 right-2 bg-white text-red-600 border border-slate-100 h-8 w-8 rounded-full flex items-center justify-center shadow"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-xs text-navy-900 line-clamp-1 leading-tight">{prod.name}</h4>
                          <span className="text-[10px] text-slate-400 font-medium font-mono block mt-1">₹{prod.pricePerMeter}/{prod.unit === 'piece' ? 'pc' : 'meter'}</span>
                        </div>
                        <button 
                          onClick={(e) => handleAddToCartFromWish(e, prod)}
                          className="w-full bg-navy-900 hover:bg-red-600 text-white font-bold text-[10px] py-2 rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400">
                  Your wishlist is empty. Tap the star icon on products to save them here.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Profile management settings */}
          {activeTab === "profile" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 text-xs text-slate-700">
              <h3 className="font-bold text-sm uppercase text-navy-900 tracking-wide pb-2 border-b border-slate-50">Profile Specifications</h3>
              
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Registered Name</label>
                    <input 
                      type="text" 
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Contact Email</label>
                    <input 
                      type="email" 
                      value={profEmail}
                      onChange={(e) => setProfEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
                
                <button type="submit" className="px-5 py-2.5 bg-navy-900 hover:bg-red-600 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer">
                  Save Changes
                </button>
              </form>

              {currentUser.role !== "seller" && currentUser.role !== "admin" && (
                <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider">Become a Boutique Fabric Seller!</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed max-w-md">Upgrade your account for free to start listing your own custom sarees, fabrics, and traditional prints directly onto our digital catalog.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (updateProfile(profName, profEmail, "seller")) {
                        showToast("Account upgraded to Seller! Welcome aboard.", "success");
                        setActiveTab("sellerDesk");
                        setSearchParams({ tab: "sellerDesk" });
                      } else {
                        showToast("Could not upgrade account.", "error");
                      }
                    }}
                    className="px-4 py-2.5 bg-luxury-gold hover:bg-gold text-navy-950 font-bold uppercase tracking-wider text-[9px] rounded-xl cursor-pointer shrink-0 transition-colors"
                  >
                    🚀 Switch to Seller Role
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Seller Desk panel */}
          {activeTab === "sellerDesk" && (currentUser.role === "seller" || currentUser.role === "admin") && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm uppercase text-navy-900 tracking-wide">Seller Fabric Desk</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">List and manage your fabrics in the public catalog.</p>
                </div>
                <div className="flex gap-4 text-center text-xs">
                  <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Listings</span>
                    <span className="font-extrabold text-navy-900 font-mono text-base">{sellerProducts.length}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Active Stock</span>
                    <span className="font-extrabold text-emerald-600 font-mono text-base">
                      {sellerProducts.reduce((sum, p) => sum + p.stock, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form to Add New Product */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h4 className="font-bold text-xs uppercase text-navy-900 tracking-wider pb-1 border-b border-slate-50">List New Fabric Material</h4>
                
                <form onSubmit={handleAddProduct} className="space-y-4 text-xs text-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Fabric Name *</label>
                      <input 
                        type="text" 
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        required
                        placeholder="e.g., Pure Katan Silk - Ruby Red"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    {/* Sku */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">SKU / Code (Optional)</label>
                      <input 
                        type="text" 
                        value={newProdSku}
                        onChange={(e) => setNewProdSku(e.target.value)}
                        placeholder="e.g., KTN-SLK-RBY-01"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Catalog Category *</label>
                      <select 
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                      >
                        <option value="Kurti Cut Pieces">Kurti Cut Pieces</option>
                        <option value="Traditional Printed Fabrics">Traditional Printed Fabrics</option>
                        <option value="Premium Dress Materials">Premium Dress Materials</option>
                        <option value="Unstitched Suit Sets">Unstitched Suit Sets</option>
                      </select>
                    </div>

                    {/* Fabric Type */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Fabric Type *</label>
                      <select 
                        value={newProdFabric}
                        onChange={(e) => setNewProdFabric(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                      >
                        <option value="Rayon">Rayon</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Roman Silk">Roman Silk</option>
                        <option value="Velvet">Velvet</option>
                        <option value="Georgette">Georgette</option>
                        <option value="Chanderi">Chanderi</option>
                        <option value="Maslin">Maslin</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Sub Category */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Sub Category / Style</label>
                      <input 
                        type="text" 
                        value={newProdSub}
                        onChange={(e) => setNewProdSub(e.target.value)}
                        placeholder="e.g., Handblock Print / Embroidered"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    {/* Color */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Color Name *</label>
                      <input 
                        type="text" 
                        value={newProdColor}
                        onChange={(e) => setNewProdColor(e.target.value)}
                        required
                        placeholder="e.g., Ruby Red"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    {/* Width */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Width *</label>
                      <input 
                        type="text" 
                        value={newProdWidth}
                        onChange={(e) => setNewProdWidth(e.target.value)}
                        required
                        placeholder="e.g., 44 inches"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    {/* Weight */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Weight / GSM</label>
                      <input 
                        type="text" 
                        value={newProdWeight}
                        onChange={(e) => setNewProdWeight(e.target.value)}
                        placeholder="e.g., 120 GSM"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    {/* Available Stock */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Available Stock ({newProdUnit === 'piece' ? 'Pieces' : 'Meters'}) *</label>
                      <input 
                        type="number" 
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        required
                        min="1"
                        placeholder="e.g., 150"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-mono"
                      />
                    </div>

                    {/* Retail Price */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Retail Price Per {newProdUnit === 'piece' ? 'Piece' : 'Meter'} (₹) *</label>
                      <input 
                        type="number" 
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        required
                        min="1"
                        placeholder="e.g., 180"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-mono"
                      />
                    </div>

                    {/* Wholesale Price */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Wholesale Price ({newProdUnit === 'piece' ? 'per pc' : 'per m'} - ₹)</label>
                      <input 
                        type="number" 
                        value={newProdWholesale}
                        onChange={(e) => setNewProdWholesale(e.target.value)}
                        min="1"
                        placeholder="e.g., 130"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-mono"
                      />
                    </div>

                    {/* Wholesale MOQ */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Wholesale MOQ ({newProdUnit === 'piece' ? 'Pieces' : 'Meters'})</label>
                      <input 
                        type="number" 
                        value={newProdMoq}
                        onChange={(e) => setNewProdMoq(e.target.value)}
                        min="1"
                        placeholder="e.g., 15"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-mono"
                      />
                    </div>

                    {/* Pricing Unit */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Pricing Unit *</label>
                      <select 
                        value={newProdUnit}
                        onChange={(e) => setNewProdUnit(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                      >
                        <option value="meter">Per Meter</option>
                        <option value="piece">Per Piece</option>
                      </select>
                    </div>

                  </div>

                  {/* Preset Fabric Images Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Select Catalog Image Preset *</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {[
                        { name: "Printed Rayon", url: "https://images.unsplash.com/photo-1584184924103-e310d9d85cfc?auto=format&fit=crop&q=80&w=600" },
                        { name: "Roman Silk", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600" },
                        { name: "Cotton Prints", url: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=600" },
                        { name: "Gold Chanderi", url: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ce?auto=format&fit=crop&q=80&w=600" },
                        { name: "Embroidery Suit", url: "https://images.unsplash.com/photo-1597109229048-b4b60098df49?auto=format&fit=crop&q=80&w=600" },
                        { name: "Brocade Velvet", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600" }
                      ].map((img, iIdx) => (
                        <button 
                          key={iIdx} 
                          type="button"
                          onClick={() => { setNewProdImage(img.url); setCustomImage(""); }}
                          className={`relative aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${(!customImage && newProdImage === img.url) ? 'border-gold ring-1 ring-gold shadow-md scale-95' : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-slate-900/70 py-1 text-[8px] text-white font-bold text-center uppercase tracking-wider">{img.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom image url */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Or Paste Custom Image URL</label>
                    <input 
                      type="url" 
                      value={customImage}
                      onChange={(e) => setCustomImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-mono"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Fabric Sourcing Description</label>
                    <textarea 
                      rows="3"
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      placeholder="Provide weave, texture, embroidery, colors, suitable clothing, and boutique recommendations..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none leading-relaxed"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-navy-900 hover:bg-gold text-white hover:text-navy-950 font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer shadow-md shadow-slate-900/10"
                  >
                    🚀 List Fabric Material to Catalog
                  </button>

                </form>
              </div>

              {/* Listed Fabrics Inventory List */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-bold text-xs uppercase text-navy-900 tracking-wider pb-1 border-b border-slate-50">My Catalog Listings</h4>
                
                {sellerProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="pb-3 font-bold">Fabric</th>
                          <th className="pb-3 font-bold">Type</th>
                          <th className="pb-3 font-bold">Stock</th>
                          <th className="pb-3 font-bold">Price (Retail/Wholesale)</th>
                          <th className="pb-3 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                        {sellerProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 flex items-center gap-3 min-w-[200px]">
                              <img src={p.image} alt="" className="h-10 w-8 object-cover rounded-lg border border-slate-100 shrink-0" />
                              <div>
                                <h5 className="font-bold text-navy-900 leading-tight">{p.name}</h5>
                                <span className="text-[8px] font-bold text-slate-400 font-mono tracking-wider uppercase block mt-1">{p.sku}</span>
                              </div>
                            </td>
                            <td className="py-3 capitalize text-slate-500">{p.fabricType}</td>
                            <td className="py-3 font-mono">
                              <span className={p.stock < 10 ? "text-red-500 font-bold" : ""}>{p.stock} {p.unit === 'piece' ? 'pcs' : 'meters'}</span>
                            </td>
                            <td className="py-3 font-mono text-slate-600">
                              ₹{p.pricePerMeter}/{p.unit === 'piece' ? 'pc' : 'm'} <span className="text-slate-400">/</span> ₹{p.wholesalePrice}/{p.unit === 'piece' ? 'pc' : 'm'} (MOQ {p.wholesaleMoq}{p.unit === 'piece' ? 'pcs' : 'm'})
                            </td>
                            <td className="py-3 text-right">
                              <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    You haven't listed any fabrics yet. Use the form above to add your first item to the catalog!
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
