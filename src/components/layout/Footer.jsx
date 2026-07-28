import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Clock, Send, ArrowUp } from 'lucide-react';
import { useToast } from '../ui/Toast';
import Logo from '../ui/Logo';

export default function Footer() {
  const [email, setEmail] = useState("");
  const showToast = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast("Thank you for subscribing to ANUMEET trends!", "success");
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-secondary pt-16 pb-8 border-t border-white/5 relative">
      {/* Top Section: Branding & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12 border-b border-white/5">
        {/* Branding & Story */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 select-none group">
            <Logo className="h-9 w-9 shrink-0" />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg md:text-xl tracking-[0.15em] text-white leading-none font-playfair group-hover:text-gold transition-colors">ANUMEET</span>
              <span className="text-[9px] font-bold tracking-[0.45em] text-gold uppercase leading-none mt-1">Katpiece</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-inter">
            Established in Bhopal, Madhya Pradesh, ANUMEET KATPIECE is Central India's premier wholesale and retail boutique fabric house. We source fine premium designer fabrics, Roman Silks, Bagh Handblock Prints, Rayon, and Chanderi straight from master craftsmen to dress boutiques nationwide.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-white/5 hover:bg-gold hover:text-white transition-all rounded-lg text-slate-300 flex items-center justify-center border border-white/5 hover:border-gold" 
              aria-label="Instagram"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-white/5 hover:bg-gold hover:text-white transition-all rounded-lg text-slate-300 flex items-center justify-center border border-white/5 hover:border-gold" 
              aria-label="Facebook"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-4 lg:col-span-2">
          <h4 className="font-bold text-sm uppercase tracking-[0.15em] text-gold font-playfair">Subscribe to VIP Catalog Alerts</h4>
          <p className="text-xs text-slate-400 max-w-xl font-inter">
            Receive exclusive updates when new handblock print shipments arrive in Bhopal. Get early VIP B2B discount coupon codes and boutique styling guides.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md pt-2">
            <input
              type="email"
              placeholder="Enter your boutique or personal email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs flex-grow placeholder-white/30 text-white focus:border-gold focus:outline-none transition-colors"
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-gold hover:bg-gold-dark text-white font-bold uppercase tracking-wider text-[10px] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Subscribe <Send size={12} />
            </button>
          </form>
        </div>
      </div>

      {/* Middle Section: Links Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs font-inter">
        {/* Collection Categories */}
        <div className="space-y-3">
          <h5 className="font-bold uppercase tracking-wider text-slate-300 font-playfair text-sm">Shop Collections</h5>
          <ul className="space-y-2.5 text-slate-400">
            <li><Link to="/shop?category=Rayon Collection" className="hover:text-gold transition-colors">Premium Rayon</Link></li>
            <li><Link to="/shop?category=Roman Silk Collection" className="hover:text-gold transition-colors">Roman Silk</Link></li>
            <li><Link to="/shop?category=Bagh Print Collection" className="hover:text-gold transition-colors">Authentic Bagh Prints</Link></li>
            <li><Link to="/shop?category=Chanderi Collection" className="hover:text-gold transition-colors">Chanderi Silk Cotton</Link></li>
            <li><Link to="/shop?category=Velvet Collection" className="hover:text-gold transition-colors">Winter Velvet 9000</Link></li>
            <li><Link to="/shop?category=Laces Collection" className="hover:text-gold transition-colors">Zari Border Laces</Link></li>
          </ul>
        </div>

        {/* B2B Services */}
        <div className="space-y-3">
          <h5 className="font-bold uppercase tracking-wider text-slate-300 font-playfair text-sm">B2B Wholesale</h5>
          <ul className="space-y-2.5 text-slate-400">
            <li><Link to="/wholesale" className="hover:text-gold transition-colors">Bulk Pricing Inquiry</Link></li>
            <li><Link to="/wholesale" className="hover:text-gold transition-colors">Minimum Order Quantities (MOQ)</Link></li>
            <li><Link to="/wholesale" className="hover:text-gold transition-colors">Boutique Sample Swatches</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Direct Store Sourcing</Link></li>
            <li><a href="https://wa.me/919131264893" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors font-bold text-emerald-400">WhatsApp Sales Desk</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-3">
          <h5 className="font-bold uppercase tracking-wider text-slate-300 font-playfair text-sm">Information</h5>
          <ul className="space-y-2.5 text-slate-400">
            <li><Link to="/about" className="hover:text-gold transition-colors">Bhopal Boutique Story</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Boutique Location</Link></li>
            <li><Link to="/shop" className="hover:text-gold transition-colors">Latest Catalog Arrivals</Link></li>
            <li><Link to="/account" className="hover:text-gold transition-colors">Customer Portals</Link></li>
          </ul>
        </div>

        {/* Contact Info Details */}
        <div className="space-y-3">
          <h5 className="font-bold uppercase tracking-wider text-slate-300 font-playfair text-sm">Contact Bhopal Store</h5>
          <ul className="space-y-3.5 text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
              <span className="leading-relaxed">Makan No. 13, Subhash Nagar Phase-1, Near Subhash Nagar, Bhopal, MP, 462023</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-gold shrink-0" />
              <a href="tel:+919131264893" className="hover:text-gold transition-colors">+91 9131264893</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-gold shrink-0" />
              <a href="mailto:info@anumeetkatpiece.com" className="hover:text-gold transition-colors">info@anumeetkatpiece.com</a>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={14} className="text-gold shrink-0 mt-0.5" />
              <div className="leading-tight space-y-1">
                <p>Mon - Sat: 11:00 AM - 08:30 PM</p>
                <p className="text-red-400 font-semibold text-[10px] uppercase tracking-wider">Sunday Closed</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-inter uppercase tracking-wider">
        <div>
          <p>© {new Date().getFullYear()} ANUMEET KATPIECE Bhopal. All Rights Reserved.</p>
          <p className="mt-1 text-slate-600 font-normal">Crafted with Luxury Fashion Quality & Premium Standards.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link to="/about" className="hover:underline hover:text-gold transition-colors">Privacy Policy</Link>
          <Link to="/about" className="hover:underline hover:text-gold transition-colors">Terms & Conditions</Link>
          <Link to="/wholesale" className="hover:underline hover:text-gold transition-colors">B2B Policies</Link>
        </div>
        <button
          onClick={scrollToTop}
          className="p-2.5 border border-white/10 rounded-full hover:bg-gold hover:text-white transition-all cursor-pointer group hover:border-gold"
          aria-label="Scroll to top"
        >
          <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
}
