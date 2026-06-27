import React, { useState } from 'react';
import { Mail, MessageCircle, Ruler, FileText, CheckCircle, Percent, Info } from 'lucide-react';
import { db } from '../services/firebase';
import { useToast } from '../components/ui/Toast';

export default function Wholesale() {
  const showToast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    fabricType: "Rayon",
    quantity: 50,
    city: "",
    businessType: "Boutique Owner", // Boutique Owner, Garment Manufacturer, Reseller, Retailer
    notes: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email || !formData.city) {
      return alert("Please enter all required fields.");
    }

    // Save in Database
    db.addInquiry(formData);
    showToast("Wholesale inquiry submitted successfully! Our Bhopal manager will call you shortly.", "success");

    // Compose WhatsApp prefilled link for B2B Sourcing
    const text = `Hello Anumeet Katpiece! I'm submitting a wholesale B2B Sourcing inquiry:
*Name:* ${formData.name}
*Business Type:* ${formData.businessType}
*Location:* ${formData.city}
*Fabric Needed:* ${formData.fabricType}
*Estimated Volume:* ${formData.quantity} meters
*WhatsApp:* ${formData.mobile}
*Notes:* ${formData.notes || "None"}
Please share catalog sheets and wholesale discount rates.`;

    const waLink = `https://wa.me/919131264893?text=${encodeURIComponent(text)}`;
    
    // Redirect after brief delay
    setTimeout(() => {
      window.open(waLink, "_blank");
      // Reset form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        fabricType: "Rayon",
        quantity: 50,
        city: "",
        businessType: "Boutique Owner",
        notes: ""
      });
    }, 1200);
  };

  const wholesaleTiers = [
    { cat: "Rayon Fabrics", moq: "20 Meters", pricing: "₹85/m (Save ~30%)", specs: "140 GSM Premium soft finish" },
    { cat: "Roman Silk Collection", moq: "10 Meters", pricing: "₹280/m (Save ~25%)", specs: "High metallic sheen width 45''" },
    { cat: "Authentic Bagh Block Prints", moq: "15 Meters", pricing: "₹160/m (Save ~27%)", specs: "Natural vegetable dyes" },
    { cat: "Pure Viscose Georgette", moq: "20 Meters", pricing: "₹140/m (Save ~28%)", specs: "Dyeable base 80 GSM" },
    { cat: "Winter Velvet (Micro 9000)", moq: "10 Meters", pricing: "₹240/m (Save ~25%)", specs: "Extra rich pile pile density" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
      {/* Header Banner */}
      <div className="bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_100%)] text-white p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="absolute top-0 right-0 h-64 w-64 bg-red-600/10 blur-[100px] rounded-full"></div>
        <div className="space-y-3 max-w-xl">
          <span className="bg-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-red-500/20 inline-block">
            B2B Commercial Sourcing Portal
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight leading-none text-white">ANUMEET Sourcing</h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Partner with Central India's premier fabric house. Sourcing directly to over 250+ fashion design boutiques and reselling channels across Madhya Pradesh, Chhattisgarh, and Maharashtra.
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-center bg-slate-950/50 backdrop-blur border border-white/10 p-5 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest leading-none mb-1">Direct Sales Helpline</span>
          <a href="tel:+919131264893" className="font-extrabold text-lg text-white leading-none hover:text-red-500 transition-colors">+91 9131264893</a>
          <span className="text-[9px] text-slate-500 font-medium mt-2">11:00 AM - 08:30 PM (Sun Closed)</span>
        </div>
      </div>

      {/* Grid: MOQs vs Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* MOQs Tiers Table */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-extrabold uppercase text-navy-900 tracking-wide">Wholesale Tiers & MOQs</h2>
            <p className="text-xs text-slate-400">Our commercial terms represent low MOQ criteria for boutique houses to test and scale designs.</p>
            <div className="h-0.5 w-12 bg-luxury-gold"></div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-xs">
            <div className="grid grid-cols-12 p-4 bg-slate-50 font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-[9px]">
              <div className="col-span-5">Fabric Category</div>
              <div className="col-span-3 text-center">B2B MOQ</div>
              <div className="col-span-4 text-right">Wholesale Price</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {wholesaleTiers.map((tier, idx) => (
                <div key={idx} className="p-4 grid grid-cols-12 items-center gap-4 text-slate-600">
                  <div className="col-span-5 space-y-0.5">
                    <h4 className="font-bold text-navy-900 leading-tight">{tier.cat}</h4>
                    <p className="text-[9px] text-slate-400">{tier.specs}</p>
                  </div>
                  <div className="col-span-3 text-center font-bold text-navy-900 bg-slate-50 py-1 rounded border border-slate-100">{tier.moq}</div>
                  <div className="col-span-4 text-right font-extrabold text-emerald-600">{tier.pricing}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Wholesale perks cards list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-lg">📦</span>
              <h4 className="font-bold text-xs uppercase text-navy-900 tracking-wide">Custom Color runs</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Request custom color dye processing on orders above 100 meters per color run (Viscose, Georgette, Maslin bases).</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-lg">📖</span>
              <h4 className="font-bold text-xs uppercase text-navy-900 tracking-wide">Swatch Pack Shipments</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Free catalog swatches shipped to registered boutiques. Review the hand-feel, color saturation, and drape dynamically.</p>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-navy-900 uppercase tracking-wide">Bulk Sourcing Inquiry</h3>
            <p className="text-xs text-slate-400">Fill out your wholesale requirements. Submitting redirects to our priority WhatsApp sales desk.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Contact Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  placeholder="Sunita Sharma" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Mobile Number (WhatsApp) *</label>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Boutique / Company Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  placeholder="boutique@example.com" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Sourcing Location City *</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required 
                  placeholder="Bhopal, MP" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Target Fabric Base</label>
                <select 
                  name="fabricType"
                  value={formData.fabricType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="Rayon">Rayon / Printed Rayon</option>
                  <option value="Roman Silk">Roman Silk</option>
                  <option value="Bagh Print">Bagh Handblock Prints</option>
                  <option value="Georgette">Viscose Georgette</option>
                  <option value="Velvet">Micro Velvet 9000</option>
                  <option value="Chanderi">Chanderi Silk Cotton</option>
                  <option value="Laces">Laces & Borders</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Estimated Quantity Needed (Meters)</label>
                <input 
                  type="number" 
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="10" 
                  placeholder="50" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Your Business Model</label>
              <select 
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
              >
                <option value="Boutique Owner">Boutique Owner / Designer Studio</option>
                <option value="Garment Manufacturer">Garment Manufacturer</option>
                <option value="Reseller">Fabric Reseller</option>
                <option value="Retailer">Independent Retailer</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Custom Specifications / Target Price</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4" 
                placeholder="List colors needed, custom prints details, or delivery deadlines..." 
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
              <MessageCircle size={16} /> Submit & Open WhatsApp Desk
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
