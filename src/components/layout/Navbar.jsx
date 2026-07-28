import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, LogOut, LayoutDashboard, Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';
import Logo from '../ui/Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mega Menu States
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  
  // Mobile Collapsible Menu States
  const [mobileCutPiecesOpen, setMobileCutPiecesOpen] = useState(false);
  const [mobileDupattasOpen, setMobileDupattasOpen] = useState(false);
  
  const { wishlist, cart } = useCart();
  const { currentUser, logout, isAdmin } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogoutClick = () => {
    logout();
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  // Nav styles depending on scroll state
  const navContainerStyles = scrolled
    ? 'relative w-full bg-white border-b border-slate-200/80 shadow-md py-3 px-4 sm:px-8 lg:px-16 transition-all duration-300 ease-in-out'
    : 'relative w-full bg-white/95 backdrop-blur-md border-b border-slate-100 py-4 px-4 sm:px-8 lg:px-16 transition-all duration-300 ease-in-out';

  const linkColorClass = 'text-slate-800 hover:text-gold transition-colors duration-300 flex items-center gap-1';
  const activeLinkColorClass = 'text-gold font-extrabold flex items-center gap-1';
  const iconColorClass = 'text-slate-800 hover:text-gold transition-colors duration-300';

  const handleMegaMenuLinkClick = (path) => {
    setActiveMegaMenu(null);
    navigate(path);
  };

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Main Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-40 font-inter" onMouseLeave={() => setActiveMegaMenu(null)}>
        
        {/* Announcement Bar matching cutpiecewala.com details */}
        <div className="bg-[#B71C1C] text-white py-2 overflow-hidden text-[9px] sm:text-[10px] font-bold tracking-[0.12em] uppercase select-none relative z-50">
          <div className="whitespace-nowrap animate-[marquee_30s_linear_infinite] flex gap-20">
            <span>🚚 FREE Shipping across India on Retail & Wholesale Orders above ₹1,500!</span>
            <span>💬 Need Fabric Sourcing Advice? Chat on WhatsApp: +91 9131264893</span>
            <span>🧵 Premium Quality Fabrics • Direct Bhopal Warehouse Sourcing • Fast Dispatch</span>
            <span>🔒 100% Secure Payments | Trusted Support Before & After Purchase</span>
            <span>🇮🇳 From Our Family Store to Your Stitching Table ❤️</span>
            
            {/* Repeat for loop effect */}
            <span>🚚 FREE Shipping across India on Retail & Wholesale Orders above ₹1,500!</span>
            <span>💬 Need Fabric Sourcing Advice? Chat on WhatsApp: +91 9131264893</span>
            <span>🧵 Premium Quality Fabrics • Direct Bhopal Warehouse Sourcing • Fast Dispatch</span>
            <span>🔒 100% Secure Payments | Trusted Support Before & After Purchase</span>
            <span>🇮🇳 From Our Family Store to Your Stitching Table ❤️</span>
          </div>
        </div>

        {/* Navbar panel */}
        <div className={navContainerStyles}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 select-none group shrink-0" onClick={() => setActiveMegaMenu(null)}>
              <Logo className="h-9 w-9 shrink-0" />
              <div className="flex flex-col">
                <span className="font-extrabold text-base md:text-lg tracking-[0.15em] font-playfair leading-none text-slate-900 group-hover:text-gold transition-colors">ANUMEET</span>
                <span className="text-[8px] font-bold tracking-[0.45em] text-gold uppercase leading-none mt-1">KATPIECE</span>
              </div>
            </Link>

            {/* Desktop Navigation Links (matching cutpiecewala.com layout) */}
            <nav className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.18em]">
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? activeLinkColorClass : linkColorClass}
                onMouseEnter={() => setActiveMegaMenu(null)}
              >
                HOME
              </NavLink>

              {/* Mega Menu Trigger: CUT PIECES */}
              <div 
                className="relative py-2 cursor-pointer"
                onMouseEnter={() => setActiveMegaMenu('cut-pieces')}
              >
                <span className={`flex items-center gap-1 ${activeMegaMenu === 'cut-pieces' ? 'text-gold' : 'text-slate-800 hover:text-gold'}`}>
                  CUT PIECES <ChevronDown size={12} className={`transition-transform duration-300 ${activeMegaMenu === 'cut-pieces' ? 'rotate-180' : ''}`} />
                </span>
              </div>

              {/* Mega Menu Trigger: DUPATTAS */}
              <div 
                className="relative py-2 cursor-pointer"
                onMouseEnter={() => setActiveMegaMenu('dupattas')}
              >
                <span className={`flex items-center gap-1 ${activeMegaMenu === 'dupattas' ? 'text-gold' : 'text-slate-800 hover:text-gold'}`}>
                  DUPATTAS <ChevronDown size={12} className={`transition-transform duration-300 ${activeMegaMenu === 'dupattas' ? 'rotate-180' : ''}`} />
                </span>
              </div>

              <NavLink 
                to="/shop?sort=best-selling" 
                className={({ isActive }) => isActive ? activeLinkColorClass : linkColorClass}
                onMouseEnter={() => setActiveMegaMenu(null)}
              >
                BEST SELLERS
              </NavLink>

              <NavLink 
                to="/shop?sort=newest" 
                className={({ isActive }) => isActive ? activeLinkColorClass : linkColorClass}
                onMouseEnter={() => setActiveMegaMenu(null)}
              >
                NEW ARRIVALS
              </NavLink>

              <NavLink 
                to="/wholesale" 
                className={({ isActive }) => isActive ? activeLinkColorClass : linkColorClass}
                onMouseEnter={() => setActiveMegaMenu(null)}
              >
                WHOLESALE
              </NavLink>

              <NavLink 
                to="/contact" 
                className={({ isActive }) => isActive ? activeLinkColorClass : linkColorClass}
                onMouseEnter={() => setActiveMegaMenu(null)}
              >
                CONTACT
              </NavLink>
            </nav>

            {/* Icons Actions Panel */}
            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
              
              {/* Search Toggle */}
              <button 
                onClick={() => setSearchOpen(true)} 
                className={`p-1.5 transition-colors cursor-pointer ${iconColorClass}`} 
                aria-label="Search Catalog"
              >
                <Search size={18} />
              </button>

              {/* Wishlist Link */}
              <Link 
                to="/account?tab=wishlist" 
                className={`hidden sm:inline-flex p-1.5 transition-colors relative ${iconColorClass}`} 
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-gold text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link 
                to="/cart" 
                className={`p-1.5 transition-colors relative group ${iconColorClass}`} 
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-gold text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                {currentUser ? (
                  <Link 
                    to="/account" 
                    className={`p-1.5 transition-colors flex items-center gap-1 ${iconColorClass}`}
                  >
                    <User size={18} className="text-gold" />
                    <span className="hidden md:inline text-[8px] font-bold uppercase tracking-wider text-slate-600">{currentUser.name.split(' ')[0]}</span>
                  </Link>
                ) : (
                  <Link 
                    to="/account" 
                    className={`p-1.5 transition-colors flex items-center gap-1 ${iconColorClass}`}
                  >
                    <User size={18} />
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="lg:hidden p-1.5 transition-colors cursor-pointer text-slate-800" 
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

            </div>
          </div>
        </div>

        {/* 1. MEGA MENU: CUT PIECES */}
        <AnimatePresence>
          {activeMegaMenu === 'cut-pieces' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 py-8 px-6 md:px-12 shadow-2xl z-40 text-slate-800"
            >
              <div className="max-w-7xl mx-auto grid grid-cols-5 gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-inter">
                
                {/* Column 1: By Fabric */}
                <div className="space-y-3.5 text-left">
                  <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Fabric</h4>
                  <ul className="space-y-2">
                    {['Cotton', 'Georgette', 'Organza', 'Rayon', 'Silk', 'Fendy', 'Lining'].map(item => (
                      <li key={item}>
                        <button 
                          onClick={() => handleMegaMenuLinkClick(`/shop?fabric=${item}`)}
                          className="hover:text-gold transition-colors py-0.5 block text-left"
                        >
                          {item === 'Lining' ? '⭐ Lining Fabric' : `${item} Cutpiece`}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: By Pattern & Price */}
                <div className="space-y-5 text-left">
                  <div className="space-y-3">
                    <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Pattern</h4>
                    <ul className="space-y-2">
                      {['Plain', 'Printed', 'Designer'].map(item => (
                        <li key={item}>
                          <button 
                            onClick={() => handleMegaMenuLinkClick(`/shop?query=${item.toLowerCase()}`)}
                            className="hover:text-gold transition-colors py-0.5 block text-left"
                          >
                            {item} Cuts
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Price</h4>
                    <ul className="space-y-2">
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?maxPrice=299')} className="hover:text-gold transition-colors py-0.5 block text-left">Under ₹299</button></li>
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?minPrice=300&maxPrice=499')} className="hover:text-gold transition-colors py-0.5 block text-left">₹300 - ₹499</button></li>
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?minPrice=500&maxPrice=999')} className="hover:text-gold transition-colors py-0.5 block text-left">₹500 - ₹999</button></li>
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?minPrice=1000')} className="hover:text-gold transition-colors py-0.5 block text-left">₹1000+</button></li>
                    </ul>
                  </div>
                </div>

                {/* Column 3: By Occasion */}
                <div className="space-y-3.5 text-left">
                  <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Occasion</h4>
                  <ul className="space-y-2">
                    {['Daily Wear', 'Casual Wear', 'Office Wear', 'Festive Wear', 'Party Wear', 'Wedding Wear', 'Bridal Collection'].map(item => (
                      <li key={item}>
                        <button 
                          onClick={() => handleMegaMenuLinkClick(`/shop?query=${item.toLowerCase().replace(' wear', '')}`)}
                          className="hover:text-gold transition-colors py-0.5 block text-left"
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 4: By Color */}
                <div className="space-y-3.5 text-left">
                  <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Color</h4>
                  <ul className="space-y-2">
                    {['Red', 'White', 'Blue', 'Black', 'Green', 'Yellow', 'Pink', 'Multicolor'].map(item => (
                      <li key={item}>
                        <button 
                          onClick={() => handleMegaMenuLinkClick(`/shop?query=${item.toLowerCase()}`)}
                          className="hover:text-gold transition-colors py-0.5 block text-left"
                        >
                          {item} Shade
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 5: Special Promo Banner */}
                <div 
                  onClick={() => handleMegaMenuLinkClick('/shop?category=Kurti Cut Pieces')}
                  className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between text-left cursor-pointer group/card shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-1">
                    <span className="text-[8px] bg-gold text-white font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                      Clearance Sale
                    </span>
                    <h5 className="font-playfair text-slate-900 text-sm font-bold pt-1 leading-tight group-hover/card:text-gold transition-colors">
                      Up to 30% Off On Cut pieces
                    </h5>
                    <p className="text-[9px] text-slate-500 font-light leading-snug">
                      Shop flat layouts, printed florals, and daily rayons at wholesale clearance rates.
                    </p>
                  </div>
                  <span className="text-[8px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1 group-hover/card:translate-x-1 transition-transform pt-4">
                    Explore Cuts <ArrowRight size={10} className="text-gold" />
                  </span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. MEGA MENU: DUPATTAS */}
        <AnimatePresence>
          {activeMegaMenu === 'dupattas' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 py-8 px-6 md:px-12 shadow-2xl z-40 text-slate-800"
            >
              <div className="max-w-7xl mx-auto grid grid-cols-5 gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-inter">
                
                {/* Column 1: By Fabric & Design */}
                <div className="space-y-4 text-left">
                  <div className="space-y-3">
                    <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Fabric</h4>
                    <ul className="space-y-2">
                      {['Cotton', 'Chiffon', 'Chinnon', 'Rayon', 'Organza', 'Silk', 'Net', 'Velvet', 'Kota Doria'].map(item => (
                        <li key={item}>
                          <button 
                            onClick={() => handleMegaMenuLinkClick(`/shop?fabric=${item}`)}
                            className="hover:text-gold transition-colors py-0.5 block text-left"
                          >
                            {item} Dupatta
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 2: By Design */}
                <div className="space-y-3.5 text-left">
                  <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Design</h4>
                  <ul className="space-y-2">
                    {['Plain', 'Printed', 'Designer', 'Bandhej', 'Leheriya', 'Digital Print', 'Mirror Work', 'Gota Patti', 'Embroidered', 'Sequins', 'Dyeable'].map(item => (
                      <li key={item}>
                        <button 
                          onClick={() => handleMegaMenuLinkClick(`/shop?query=${item.toLowerCase()}`)}
                          className="hover:text-gold transition-colors py-0.5 block text-left"
                        >
                          {item} Dupatta
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: By Occasion & Region */}
                <div className="space-y-5 text-left">
                  <div className="space-y-3">
                    <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Occasion</h4>
                    <ul className="space-y-2">
                      {['Daily Wear', 'Casual Wear', 'Festive Wear', 'Party Wear', 'Wedding Wear', 'Bridal Collection'].map(item => (
                        <li key={item}>
                          <button 
                            onClick={() => handleMegaMenuLinkClick(`/shop?query=${item.toLowerCase().replace(' wear', '')}`)}
                            className="hover:text-gold transition-colors py-0.5 block text-left"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Region</h4>
                    <ul className="space-y-2">
                      {['Rajasthani', 'Gujarati', 'Punjabi', 'Lucknowi', 'South Indian'].map(item => (
                        <li key={item}>
                          <button 
                            onClick={() => handleMegaMenuLinkClick(`/shop?query=${item.toLowerCase()}`)}
                            className="hover:text-gold transition-colors py-0.5 block text-left"
                          >
                            {item} Dupattas
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 4: By Price & Color */}
                <div className="space-y-5 text-left">
                  <div className="space-y-3">
                    <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Price</h4>
                    <ul className="space-y-2">
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?maxPrice=99')} className="hover:text-gold transition-colors py-0.5 block text-left">Under ₹99</button></li>
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?minPrice=100&maxPrice=299')} className="hover:text-gold transition-colors py-0.5 block text-left">₹100 - ₹299</button></li>
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?minPrice=300&maxPrice=499')} className="hover:text-gold transition-colors py-0.5 block text-left">₹300 - ₹499</button></li>
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?minPrice=500')} className="hover:text-gold transition-colors py-0.5 block text-left">₹500+</button></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-slate-900 border-b border-slate-100 pb-1 text-[12px] font-extrabold tracking-[0.12em] font-playfair italic text-gold">By Color</h4>
                    <ul className="space-y-2">
                      {['Red', 'White', 'Black', 'Blue'].map(item => (
                        <li key={item}>
                          <button 
                            onClick={() => handleMegaMenuLinkClick(`/shop?query=${item.toLowerCase()}`)}
                            className="hover:text-gold transition-colors py-0.5 block text-left"
                          >
                            {item} Dupatta
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 5: Trending & Combos */}
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between text-left cursor-pointer group/card shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="space-y-2">
                    <span className="text-[8px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                      Trending Now
                    </span>
                    <h5 className="font-playfair text-slate-900 text-sm font-bold pt-1 leading-tight group-hover/card:text-gold transition-colors">
                      Viral Instagram Dupattas
                    </h5>
                    
                    <ul className="space-y-1.5 text-[9px] text-slate-500 font-bold tracking-wider pt-2">
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?sort=best-selling')} className="hover:text-gold block">🔥 Best Sellers</button></li>
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?sort=newest')} className="hover:text-gold block">⭐ New Arrivals</button></li>
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?query=combo')} className="hover:text-gold block">🎁 Combo Deals</button></li>
                      <li><button onClick={() => handleMegaMenuLinkClick('/shop?query=clearance')} className="hover:text-gold block">💰 Clearance 50% Off</button></li>
                    </ul>
                  </div>
                  <span className="text-[8px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1 group-hover/card:translate-x-1 transition-transform pt-4">
                    Shop Trending <ArrowRight size={10} className="text-gold" />
                  </span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Full Screen Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-55 bg-primary/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-inter">
          <button 
            onClick={() => setSearchOpen(false)} 
            className="absolute top-8 right-8 text-white/60 hover:text-white p-2 border border-white/10 rounded-full cursor-pointer hover:border-gold transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="max-w-2xl w-full text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 tracking-wider font-playfair">Search ANUMEET's Premium Catalog</h2>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search rayon, silk, chanderi, block prints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-full text-lg md:text-xl placeholder-white/30 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-gold hover:bg-gold-dark text-white p-2.5 rounded-full cursor-pointer transition-colors">
                <ArrowRight size={20} />
              </button>
            </form>
            <div className="mt-4 text-xs text-white/40 flex justify-center gap-4">
              <span>Try:</span>
              <button onClick={() => setSearchQuery("Rayon")} className="hover:text-gold underline">Rayon</button>
              <button onClick={() => setSearchQuery("Roman Silk")} className="hover:text-gold underline">Roman Silk</button>
              <button onClick={() => setSearchQuery("Bagh Print")} className="hover:text-gold underline">Bagh Print</button>
              <button onClick={() => setSearchQuery("Chanderi")} className="hover:text-gold underline">Chanderi</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation Menu (collapsible category trees) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 left-0 lg:hidden z-30 bg-white/98 backdrop-blur-xl flex flex-col pt-32 px-6 pb-8 text-slate-900 overflow-y-auto"
          >
            <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex flex-col gap-5 text-sm font-bold uppercase tracking-[0.2em] flex-grow">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block hover:text-gold py-1.5 border-b border-slate-100 font-playfair text-lg italic tracking-wider">
                Home
              </Link>

              {/* Mobile Collapsible: CUT PIECES */}
              <div className="border-b border-slate-100 pb-1.5">
                <button 
                  onClick={() => setMobileCutPiecesOpen(!mobileCutPiecesOpen)}
                  className="w-full flex justify-between items-center text-left py-1.5 font-playfair text-lg italic tracking-wider hover:text-gold"
                >
                  <span>Cut Pieces</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${mobileCutPiecesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileCutPiecesOpen && (
                  <div className="pl-4 pt-2 pb-1 grid grid-cols-2 gap-2 text-[10px] tracking-wider text-slate-500">
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?category=Kurti Cut Pieces'); }} className="text-left py-1 hover:text-gold">All Cutpieces</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?fabric=Cotton'); }} className="text-left py-1 hover:text-gold">Cotton</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?fabric=Rayon'); }} className="text-left py-1 hover:text-gold">Rayon</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?fabric=Georgette'); }} className="text-left py-1 hover:text-gold">Georgette</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?fabric=Silk'); }} className="text-left py-1 hover:text-gold">Silk</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?query=printed'); }} className="text-left py-1 hover:text-gold">Printed</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?query=plain'); }} className="text-left py-1 hover:text-gold">Plain</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?maxPrice=299'); }} className="text-left py-1 hover:text-gold">Under ₹299</button>
                  </div>
                )}
              </div>

              {/* Mobile Collapsible: DUPATTAS */}
              <div className="border-b border-slate-100 pb-1.5">
                <button 
                  onClick={() => setMobileDupattasOpen(!mobileDupattasOpen)}
                  className="w-full flex justify-between items-center text-left py-1.5 font-playfair text-lg italic tracking-wider hover:text-gold"
                >
                  <span>Dupattas</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${mobileDupattasOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileDupattasOpen && (
                  <div className="pl-4 pt-2 pb-1 grid grid-cols-2 gap-2 text-[10px] tracking-wider text-slate-500">
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?category=Traditional Printed Fabrics'); }} className="text-left py-1 hover:text-gold">All Dupattas</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?fabric=Organza'); }} className="text-left py-1 hover:text-gold">Organza</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?fabric=Chiffon'); }} className="text-left py-1 hover:text-gold">Chiffon</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?fabric=Silk'); }} className="text-left py-1 hover:text-gold">Banarasi Silk</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?query=wedding'); }} className="text-left py-1 hover:text-gold">Wedding wear</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?query=daily'); }} className="text-left py-1 hover:text-gold">Daily wear</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?query=rajasthani'); }} className="text-left py-1 hover:text-gold">Rajasthani</button>
                    <button onClick={() => { setMobileMenuOpen(false); navigate('/shop?maxPrice=299'); }} className="text-left py-1 hover:text-gold">Under ₹299</button>
                  </div>
                )}
              </div>

              <Link to="/shop?sort=best-selling" onClick={() => setMobileMenuOpen(false)} className="block hover:text-gold py-1.5 border-b border-slate-100 font-playfair text-lg italic tracking-wider">
                Best Sellers
              </Link>

              <Link to="/shop?sort=newest" onClick={() => setMobileMenuOpen(false)} className="block hover:text-gold py-1.5 border-b border-slate-100 font-playfair text-lg italic tracking-wider">
                New Arrivals
              </Link>

              <Link to="/wholesale" onClick={() => setMobileMenuOpen(false)} className="block hover:text-gold py-1.5 border-b border-slate-100 font-playfair text-lg italic tracking-wider">
                Wholesale Portal
              </Link>

              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block hover:text-gold py-1.5 border-b border-slate-100 font-playfair text-lg italic tracking-wider">
                Contact Us
              </Link>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-slate-100">
              {currentUser ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-500">Logged in as <span className="font-bold text-gold">{currentUser.name}</span></p>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="w-full bg-gold text-white py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { setMobileMenuOpen(false); handleLogoutClick(); }} className="w-full border border-red-500/30 text-red-500 py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider hover:bg-red-500/10 transition-colors">
                    Log Out
                  </button>
                </div>
              ) : (
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="w-full block bg-gold text-white py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider hover:bg-gold-dark transition-colors">
                  Log In / Sign Up
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
