import React, { useState } from 'react';
import { Phone, MapPin, Mail, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export default function Contact() {
  const showToast = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return alert("Please enter all required fields.");
    }
    showToast("Thank you! Your message has been sent to our Bhopal desk.", "success");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactCards = [
    { icon: <Phone size={20} className="text-red-600" />, label: "Call Store Desk", value: "+91 9131264893", sub: "11:00 AM - 8:30 PM (Mon-Sat)" },
    { icon: <MessageCircle size={20} className="text-emerald-500" />, label: "WhatsApp Support", value: "+91 9131264893", sub: "Fastest B2B Catalog inquiries" },
    { icon: <Mail size={20} className="text-red-600" />, label: "Email Queries", value: "info@anumeetkatpiece.com", sub: "Business quotes and orders invoices" },
    { icon: <Clock size={20} className="text-amber-500" />, label: "Store Hours", value: "11:00 AM - 8:30 PM", sub: "Sundays: Closed for stocking" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-red-600">Get In Touch</span>
        <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-navy-900">Contact Bhopal Studio</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">We are ready to assist you. Sourcing queries, custom orders, or showroom directions.</p>
        <div className="h-0.5 w-12 bg-luxury-gold mx-auto"></div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {contactCards.map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
              {card.icon}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">{card.label}</span>
            <h4 className="font-extrabold text-xs text-navy-900 uppercase tracking-wide">{card.value}</h4>
            <p className="text-[10px] text-slate-500">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Grid: Message Form vs Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-base uppercase text-navy-900 tracking-wide">Leave a Message</h3>
            <p className="text-xs text-slate-400">Our customer desk will review and reply within 12 hours.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-slate-700">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Your Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                placeholder="Priya Shrishti" 
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                placeholder="priya@example.com" 
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Subject</label>
              <input 
                type="text" 
                name="subject" 
                value={formData.subject} 
                onChange={handleInputChange} 
                placeholder="Order tracking details, custom Rayon prints..." 
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Inquiry Message *</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleInputChange} 
                required 
                rows="4" 
                placeholder="Type your fabric specifications here..." 
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
              Send Message <Send size={12} />
            </button>
          </form>
        </div>

        {/* Bhopal Showroom Location Card / Map visual */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="bg-luxury-gold/20 text-luxury-gold text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-luxury-gold/20 inline-block">
              Physical Boutique Location
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold uppercase tracking-wide">ANUMEET KATPIECE Showroom</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Makan No. 13, Subhash Nagar Phase-1, Near Subhash Nagar Station Road, Bhopal, Madhya Pradesh, 462023.
            </p>
          </div>

          {/* Map mockup visual with Google Map feel */}
          <div className="aspect-video bg-slate-950 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center p-4">
            {/* Grid background representing streets */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-20"></div>
            
            {/* Custom styled map lines and nodes */}
            <div className="absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-slate-800"></div>
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-950/20"></div>
            <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-slate-800"></div>
            <div className="absolute top-0 bottom-0 right-1/4 w-0.5 bg-slate-800"></div>

            <div className="relative z-10 text-center space-y-3 flex flex-col items-center">
              <div className="h-10 w-10 bg-red-600 text-white border-2 border-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                📍
              </div>
              <div className="bg-slate-900/90 border border-white/10 p-3 rounded-xl max-w-xs shadow-xl backdrop-blur-sm">
                <h4 className="font-extrabold text-[10px] text-white uppercase tracking-wider leading-none">ANUMEET KATPIECE</h4>
                <p className="text-[8px] text-slate-400 mt-1">Makan No. 13, Subhash Nagar, Bhopal</p>
                <a 
                  href="https://maps.google.com/?q=Subhash+Nagar+Bhopal" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[8px] text-luxury-gold font-bold uppercase hover:underline block mt-2"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 text-xs border-t border-white/5">
            <span className="text-slate-400">💡 Free customer parking is available directly in front of the showroom lobby.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
