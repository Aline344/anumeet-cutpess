import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Truck, Percent, FileText, Plus, Trash2, Edit2, CheckCircle, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { useToast } from '../components/ui/Toast';

export default function AdminDashboard() {
  const { currentUser, isAdmin } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  // Redirect or block if not admin
  if (!currentUser || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="h-16 w-16 bg-red-50 text-red-600 border border-red-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-xl font-bold uppercase text-navy-900 tracking-wide">Unauthorized Admin Access</h2>
        <p className="text-xs text-slate-500">You must log in with an administrator account to view the analytics panel.</p>
        <button 
          onClick={() => navigate("/account?tab=orders")}
          className="px-6 py-2.5 bg-navy-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:bg-red-600 cursor-pointer"
        >
          Go to Member Login
        </button>
      </div>
    );
  }

  // Admin active view state: overview, products, orders, coupons, inquiries
  const [activeView, setActiveView] = useState("overview");

  // Load database lists
  const products = db.getProducts();
  const orders = db.getOrders();
  const inquiries = db.getInquiries();
  const coupons = db.getCoupons();

  // CRUD Product Form States
  const [prodFormOpen, setProdFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding new
  const [pName, setPName] = useState("");
  const [pSku, setPSku] = useState("");
  const [pCategory, setPCategory] = useState("Rayon Collection");
  const [pFabricType, setPFabricType] = useState("Rayon");
  const [pWidth, setPWidth] = useState("44 inches");
  const [pWeight, setPWeight] = useState("140 GSM");
  const [pColor, setPColor] = useState("");
  const [pColorHex, setPColorHex] = useState("#000000");
  const [pDesc, setPDesc] = useState("");
  const [pPrice, setPPrice] = useState(120);
  const [pWholesalePrice, setPWholesalePrice] = useState(85);
  const [pWholesaleMoq, setPWholesaleMoq] = useState(20);
  const [pStock, setPStock] = useState(200);
  const [pImage, setPImage] = useState("");

  // Coupon Form States
  const [cCode, setCCode] = useState("");
  const [cPercent, setCPercent] = useState(10);
  const [cMinVal, setCMinVal] = useState(500);
  const [cDesc, setCDesc] = useState("");

  // Calc Totals
  const totalRevenue = orders.reduce((sum, o) => o.status !== "Cancelled" ? sum + o.totalAmount : sum, 0);
  const totalInquiriesCount = inquiries.length;
  
  // Submit Product Add/Edit
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!pName || !pSku || !pColor || !pDesc || !pImage) {
      return alert("Please enter all required product specifications.");
    }

    const payload = {
      name: pName,
      sku: pSku,
      category: pCategory,
      subCategory: pCategory.split(" ")[0] + " Fabrics",
      fabricType: pFabricType,
      width: pWidth,
      weight: pWeight,
      color: pColor,
      colorHex: pColorHex,
      description: pDesc,
      pricePerMeter: parseFloat(pPrice),
      wholesalePrice: parseFloat(pWholesalePrice),
      wholesaleMoq: parseInt(pWholesaleMoq),
      stock: parseInt(pStock),
      image: pImage
    };

    if (editingProduct) {
      // Update
      const success = db.updateProduct({
        ...editingProduct,
        ...payload
      });
      if (success) {
        showToast("Product updated successfully!", "success");
      }
    } else {
      // Create
      db.addProduct(payload);
      showToast("New fabric product added to catalog!", "success");
    }

    resetProductForm();
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPSku(prod.sku);
    setPCategory(prod.category);
    setPFabricType(prod.fabricType);
    setPWidth(prod.width);
    setPWeight(prod.weight);
    setPColor(prod.color);
    setPColorHex(prod.colorHex);
    setPDesc(prod.description);
    setPPrice(prod.pricePerMeter);
    setWholesalePrice(prod.wholesalePrice);
    setPWholesaleMoq(prod.wholesaleMoq);
    setPStock(prod.stock);
    setPImage(prod.image);
    setProdFormOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      db.deleteProduct(id);
      showToast("Product deleted from database.", "info");
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setPName("");
    setPSku("");
    setPColor("");
    setPDesc("");
    setPImage("");
    setPPrice(120);
    setPWholesalePrice(85);
    setPWholesaleMoq(20);
    setPStock(200);
    setProdFormOpen(false);
  };

  // Submit Coupon Create
  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!cCode) return;
    db.addCoupon({
      code: cCode.toUpperCase(),
      discountPercent: parseFloat(cPercent),
      minCartValue: parseFloat(cMinVal),
      description: cDesc
    });
    showToast(`Coupon ${cCode} added successfully!`, "success");
    setCCode("");
    setCCode("");
    setCDesc("");
  };

  const handleDeleteCoupon = (code) => {
    db.deleteCoupon(code);
    showToast("Coupon removed from catalog.", "info");
  };

  // Order status modification
  const handleOrderStatusChange = (orderId, newStatus) => {
    db.updateOrderStatus(orderId, newStatus);
    showToast(`Order status updated to: ${newStatus}`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Overview stats top bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Control Hub</span>
          <h1 className="text-xl md:text-2xl font-extrabold text-navy-900 tracking-wide uppercase">Admin Dashboard</h1>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
          <button 
            onClick={() => setActiveView("overview")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeView === "overview" ? 'bg-navy-900 text-white' : 'hover:bg-slate-50 text-slate-500'}`}
          >
            📊 Analytics
          </button>
          <button 
            onClick={() => setActiveView("products")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeView === "products" ? 'bg-navy-900 text-white' : 'hover:bg-slate-50 text-slate-500'}`}
          >
            ✂️ Catalog
          </button>
          <button 
            onClick={() => setActiveView("orders")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeView === "orders" ? 'bg-navy-900 text-white' : 'hover:bg-slate-50 text-slate-500'}`}
          >
            📦 Orders
          </button>
          <button 
            onClick={() => setActiveView("coupons")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeView === "coupons" ? 'bg-navy-900 text-white' : 'hover:bg-slate-50 text-slate-500'}`}
          >
            🎟️ Coupons
          </button>
          <button 
            onClick={() => setActiveView("inquiries")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeView === "inquiries" ? 'bg-navy-900 text-white' : 'hover:bg-slate-50 text-slate-500'}`}
          >
            🤝 Inquiries ({totalInquiriesCount})
          </button>
        </div>
      </div>

      {/* VIEW 1: OVERVIEW ANALYTICS */}
      {activeView === "overview" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Card stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</span>
              <h4 className="text-xl md:text-2xl font-extrabold text-navy-900">₹{totalRevenue.toFixed(0)}</h4>
              <p className="text-[9px] text-emerald-600 font-semibold leading-none">⚡ UPI & Razorpay Secured</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Order Logs</span>
              <h4 className="text-xl md:text-2xl font-extrabold text-navy-900">{orders.length}</h4>
              <p className="text-[9px] text-slate-400 leading-none">Wholesale & retail batches</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">B2B Inquiries</span>
              <h4 className="text-xl md:text-2xl font-extrabold text-navy-900">{totalInquiriesCount}</h4>
              <p className="text-[9px] text-red-600 font-semibold leading-none">⚠️ High priority followups</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Catalog Fabrics</span>
              <h4 className="text-xl md:text-2xl font-extrabold text-navy-900">{products.length}</h4>
              <p className="text-[9px] text-slate-400 leading-none">Rayons, Silks, Bagh prints</p>
            </div>
          </div>

          {/* Graph visual representation */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase text-navy-900 tracking-wider">Weekly Sourcing Performance</h3>
            <div className="h-64 flex items-end gap-3 pt-6 border-b border-l border-slate-100 pr-4">
              {/* Mock bar columns */}
              {[45, 60, 30, 80, 95, 55, 75].map((val, idx) => (
                <div key={idx} className="flex-grow flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-900 hover:bg-red-600 rounded-t-lg transition-colors" style={{ height: `${val * 2}px` }}></div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Day {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PRODUCT CATALOG CRUD */}
      {activeView === "products" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase text-navy-900 tracking-wider">Boutique Catalog List ({products.length})</h3>
            <button 
              onClick={() => { resetProductForm(); setProdFormOpen(true); }}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus size={14} /> Add New Fabric
            </button>
          </div>

          {/* CRUD Input modal overlay */}
          {prodFormOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8 border border-slate-100 shadow-2xl space-y-6">
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm uppercase text-navy-900 tracking-wider">
                    {editingProduct ? 'Edit Fabric Specifications' : 'Add New Fabric Material'}
                  </h3>
                  <button onClick={resetProductForm} className="text-slate-400 hover:text-navy-900 font-bold text-xs">✕</button>
                </div>

                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Product Name *</label>
                    <input type="text" value={pName} onChange={(e) => setPName(e.target.value)} required placeholder="Premium Printed Rayon" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  {/* SKU */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Fabric SKU Code *</label>
                    <input type="text" value={pSku} onChange={(e) => setPSku(e.target.value)} required placeholder="RYN-PRT-02" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Catalog Category</label>
                    <select value={pCategory} onChange={(e) => setPCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                      <option value="Rayon Collection">Rayon Collection</option>
                      <option value="Roman Silk Collection">Roman Silk Collection</option>
                      <option value="Bagh Print Collection">Bagh Print Collection</option>
                      <option value="Georgette Collection">Georgette Collection</option>
                      <option value="Velvet Collection">Velvet Collection</option>
                      <option value="Chanderi Collection">Chanderi Collection</option>
                      <option value="Laces Collection">Laces Collection</option>
                    </select>
                  </div>
                  {/* Fabric Type */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Fabric Base Base *</label>
                    <input type="text" value={pFabricType} onChange={(e) => setPFabricType(e.target.value)} required placeholder="Rayon, Silk, Cotton..." className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>

                  {/* Width & Weight */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Fabric Width</label>
                    <input type="text" value={pWidth} onChange={(e) => setPWidth(e.target.value)} placeholder="44 inches" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Fabric Weight (GSM)</label>
                    <input type="text" value={pWeight} onChange={(e) => setPWeight(e.target.value)} placeholder="140 GSM" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>

                  {/* Color Name & Hex */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Color Shade Name *</label>
                    <input type="text" value={pColor} onChange={(e) => setPColor(e.target.value)} required placeholder="Crimson Red" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Color Hex Code</label>
                    <div className="flex gap-2">
                      <input type="color" value={pColorHex} onChange={(e) => setPColorHex(e.target.value)} className="h-9 w-12 border border-slate-200 rounded-xl cursor-pointer" />
                      <input type="text" value={pColorHex} onChange={(e) => setPColorHex(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Fabric High-Res Image URL *</label>
                    <input type="text" value={pImage} onChange={(e) => setPImage(e.target.value)} required placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>

                  {/* Pricing and Stock */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Retail Price/Meter (₹) *</label>
                    <input type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Wholesale Price/Meter (₹) *</label>
                    <input type="number" value={pWholesalePrice} onChange={(e) => setPWholesalePrice(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Wholesale Min Order Quantity (Meters) *</label>
                    <input type="number" value={pWholesaleMoq} onChange={(e) => setPWholesaleMoq(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Total Showroom Stock (Meters)</label>
                    <input type="number" value={pStock} onChange={(e) => setPStock(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                  </div>

                  {/* Description */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Fabric Story & Curation Notes *</label>
                    <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} required rows="4" placeholder="Beautiful flow and weight..." className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none" />
                  </div>

                  {/* Form Actions */}
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button type="button" onClick={resetProductForm} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold uppercase tracking-wider">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-2.5 bg-navy-900 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-600 transition-colors">
                      {editingProduct ? 'Save Specifications' : 'Publish Product'}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* Grid of Catalog List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-xs text-slate-600">
            <div className="grid grid-cols-12 p-4 bg-slate-50 font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-[9px]">
              <div className="col-span-6">Fabric Material</div>
              <div className="col-span-2 text-center">Retail/Wholesale</div>
              <div className="col-span-2 text-center">Stock</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {products.map((prod) => (
                <div key={prod.id} className="p-4 grid grid-cols-12 items-center gap-4">
                  <div className="col-span-6 flex gap-3 items-center min-w-0">
                    <img src={prod.image} alt="" className="h-10 w-8 object-cover rounded-lg border shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-navy-900 truncate leading-none">{prod.name}</h4>
                      <span className="text-[9px] text-slate-400 font-mono mt-1 block leading-none">{prod.sku} • {prod.category}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center font-bold text-navy-900 leading-none">
                    <p>₹{prod.pricePerMeter}</p>
                    <p className="text-[9px] text-emerald-600 font-semibold mt-1">₹{prod.wholesalePrice} (Min {prod.wholesaleMoq}m)</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${prod.stock === 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-navy-900 border'}`}>
                      {prod.stock} meters
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditProductClick(prod)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200"
                      aria-label="Edit"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer border border-red-100"
                      aria-label="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: ORDER MANAGER */}
      {activeView === "orders" && (
        <div className="space-y-6 animate-fade-in text-xs">
          <h3 className="font-bold text-sm uppercase text-navy-900 tracking-wider">Boutique Sourcing Logs ({orders.length})</h3>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-slate-600">
            <div className="grid grid-cols-12 p-4 bg-slate-50 font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-[9px]">
              <div className="col-span-3">Order Code</div>
              <div className="col-span-3">Buyer Boutique</div>
              <div className="col-span-2 text-center">Amount</div>
              <div className="col-span-2 text-center">Timeline Stage</div>
              <div className="col-span-2 text-right">Alter Stage</div>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 grid grid-cols-12 items-center gap-4">
                  <div className="col-span-3 space-y-0.5 min-w-0">
                    <h4 className="font-bold text-navy-900 font-mono text-sm leading-none">{ord.id}</h4>
                    <span className="text-[9px] text-slate-400 mt-1 block leading-none">{new Date(ord.date).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-3 min-w-0">
                    <h4 className="font-bold text-navy-900 truncate leading-none">{ord.userName}</h4>
                    <span className="text-[9px] text-slate-400 mt-1 block leading-none">{ord.userEmail}</span>
                  </div>
                  <div className="col-span-2 text-center font-bold text-navy-900">
                    ₹{ord.totalAmount.toFixed(0)}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold border ${ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ord.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {ord.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                      className="px-2.5 py-1 border border-slate-200 rounded-lg text-[10px] font-bold uppercase bg-white focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: COUPON MANAGER */}
      {activeView === "coupons" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in text-xs">
          {/* List */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-bold text-sm uppercase text-navy-900 tracking-wider">Active Promotional Coupons</h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-12 p-4 bg-slate-50 font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-[9px]">
                <div className="col-span-3">Coupon Code</div>
                <div className="col-span-2 text-center">Discount %</div>
                <div className="col-span-2 text-center">Min Cart</div>
                <div className="col-span-3">Description</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
              
              <div className="divide-y divide-slate-100">
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 grid grid-cols-12 items-center gap-4 text-slate-600">
                    <div className="col-span-3 font-bold text-navy-900 font-mono uppercase tracking-widest">{c.code}</div>
                    <div className="col-span-2 text-center font-bold text-slate-800">{c.discountPercent}%</div>
                    <div className="col-span-2 text-center font-bold text-slate-800">₹{c.minCartValue}</div>
                    <div className="col-span-3 text-[10px] leading-tight text-slate-400">{c.description}</div>
                    <div className="col-span-2 text-right">
                      <button 
                        onClick={() => handleDeleteCoupon(c.code)}
                        className="p-1.5 hover:text-red-600 bg-slate-50 border border-slate-150 rounded-lg transition-colors cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-fit">
            <h4 className="font-bold text-xs uppercase text-navy-900 tracking-wider pb-2 border-b border-slate-100">Add New Coupon</h4>
            <form onSubmit={handleCouponSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Promo Code *</label>
                <input type="text" value={cCode} onChange={(e) => setCCode(e.target.value)} required placeholder="FESTIVE30" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Discount Percent (%) *</label>
                <input type="number" min="1" max="90" value={cPercent} onChange={(e) => setCPercent(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Min Cart Amount (₹) *</label>
                <input type="number" min="0" value={cMinVal} onChange={(e) => setCMinVal(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Description / Constraints</label>
                <input type="text" value={cDesc} onChange={(e) => setCDesc(e.target.value)} placeholder="Get 30% off above ₹1,000" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-red-600 text-white font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer">
                Publish Code
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 5: INQUIRIES LOGS */}
      {activeView === "inquiries" && (
        <div className="space-y-6 animate-fade-in text-xs">
          <h3 className="font-bold text-sm uppercase text-navy-900 tracking-wider">B2B Wholesale Inquiries ({inquiries.length})</h3>
          
          {inquiries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Inquiry Code</span>
                      <h4 className="font-extrabold text-sm text-navy-900 font-mono">{inq.id}</h4>
                    </div>
                    <span className="text-[9px] text-slate-400">{new Date(inq.date).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-slate-600">
                    <p><span className="font-bold text-navy-900">Contact:</span> {inq.name}</p>
                    <p><span className="font-bold text-navy-900">Mobile:</span> {inq.mobile}</p>
                    <p><span className="font-bold text-navy-900">Email:</span> {inq.email}</p>
                    <p><span className="font-bold text-navy-900">City:</span> {inq.city}</p>
                    <p><span className="font-bold text-navy-900">Sourcing Model:</span> {inq.businessType}</p>
                    <p><span className="font-bold text-navy-900">Fabric Required:</span> {inq.fabricType}</p>
                    <p className="col-span-2"><span className="font-bold text-navy-900">Target Volume:</span> <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{inq.quantity} meters</span></p>
                  </div>

                  {inq.notes && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10px] text-slate-500">
                      <p className="font-bold uppercase tracking-wider text-[8px] text-slate-400 mb-1">Specifications Notes:</p>
                      <p className="italic">"{inq.notes}"</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                    <a 
                      href={`https://wa.me/${inq.mobile.replace(/[^0-9]/g, "")}?text=Hello%20${inq.name},%20this%20is%20Anumeet%20Cutpiece%20Bhopal%20responding%20to%20your%20B2B%20inquiry...`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors"
                    >
                      Followup via WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400">
              No wholesale inquiries logged yet. B2B submissions on the wholesale portal will appear here.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
