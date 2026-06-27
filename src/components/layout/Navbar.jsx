import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, LogOut, LayoutDashboard, Menu, X, ArrowRight } from 'lucide-react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
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

  // Dynamic navy blue navbar container styles with smooth scroll transitions
  // Glass‑morphism navigation container with sticky‑shrink effect
  const navContainerStyles = scrolled
    ? 'fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-primary to-gold/30 backdrop-blur-xl border-b border-white/20 shadow-md py-3 px-4 sm:px-8 md:px-16 transition-all duration-300 ease-in-out'
    : 'fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-primary/30 to-gold/10 backdrop-blur-2xl border-b border-white/25 py-5 px-4 sm:px-8 md:px-16 transition-all duration-300 ease-in-out';

  const linkColorClass = 'text-white/80 hover:text-gold transition-colors duration-300';

  const activeLinkColorClass = 'text-gold font-semibold';

  const iconColorClass = 'text-white hover:text-gold transition-colors duration-300';

  const logoColorClass = 'text-white';

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Main Sticky Header containing both Ticker and Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40">
        {/* Announcement Marquee Ticker */}
        <div className="bg-primary text-secondary py-2 overflow-hidden border-b border-white/5 text-[10px] font-semibold tracking-[0.15em] uppercase select-none relative">
          <div className="flex animate-[gold-shine_6s_ease-in-out_infinite] bg-[linear-gradient(90deg,#D4AF37,#FFFFFF,#D4AF37)] bg-size-200 bg-clip-text text-transparent w-full">
            <div className="whitespace-nowrap animate-[marquee_25s_linear_infinite] flex gap-20">
              <span>🇮🇳 BHOPAL'S DIGITAL FABRIC FLAGSHIP STORE</span>
              <span>✨ WHOLESALE RATES AVAILABLE ON EVERY FABRIC</span>
              <span>🚚 FREE NATIONWIDE SHIPPING ON ORDERS ABOVE ₹1,500</span>
              <span>📱 ORDER DIRECTLY VIA WHATSAPP AVAILABLE AT +91 9131264893</span>
              <span>💎 1000+ DESIGNS: RAYON, ROMAN SILK, CHANDERI, VELVET</span>
            </div>
          </div>
        </div>

        <div className={navContainerStyles}>
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 select-none group">
              <Logo className="h-9 w-9 shrink-0" />
              <div className="flex flex-col">
                <span className={`font-extrabold text-base md:text-lg tracking-[0.15em] font-playfair leading-none group-hover:text-gold transition-colors ${logoColorClass}`}>ANUMEET</span>
                <span className="text-[8px] font-bold tracking-[0.45em] text-gold uppercase leading-none mt-1">KATPIECE</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.18em]">
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link-simple relative pb-1 pt-1 px-1 flex flex-col items-center justify-center font-bold ${isActive ? `${activeLinkColorClass} active` : linkColorClass}`}
              >
                <span>HOME</span>
              </NavLink>
              <NavLink 
                to="/shop" 
                className={({ isActive }) => `nav-link-simple relative pb-1 pt-1 px-1 flex flex-col items-center justify-center font-bold ${isActive ? `${activeLinkColorClass} active` : linkColorClass}`}
              >
                <span>SHOP COLLECTION</span>
              </NavLink>
              <NavLink 
                to="/wholesale" 
                className={({ isActive }) => `nav-link-simple relative pb-1 pt-1 px-1 flex flex-col items-center justify-center font-bold ${isActive ? `${activeLinkColorClass} active` : linkColorClass}`}
              >
                <span>WHOLESALE</span>
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => `nav-link-simple relative pb-1 pt-1 px-1 flex flex-col items-center justify-center font-bold ${isActive ? `${activeLinkColorClass} active` : linkColorClass}`}
              >
                <span>ABOUT HERITAGE</span>
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => `nav-link-simple relative pb-1 pt-1 px-1 flex flex-col items-center justify-center font-bold ${isActive ? `${activeLinkColorClass} active` : linkColorClass}`}
              >
                <span>CONTACT</span>
              </NavLink>
            </nav>

            {/* Icons Actions Panel */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              
              {/* Search Toggle */}
              <button 
                onClick={() => setSearchOpen(true)} 
                className={`p-1.5 transition-colors cursor-pointer ${iconColorClass}`} 
                aria-label="Search Catalog"
              >
                <Search size={18} />
              </button>

              {/* Wishlist Icon */}
              <Link 
                to="/account?tab=wishlist" 
                className={`hidden sm:inline-flex p-1.5 transition-colors relative ${iconColorClass}`} 
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-gold text-primary rounded-full flex items-center justify-center text-[8px] font-bold">
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
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-gold text-primary rounded-full flex items-center justify-center text-[8px] font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>

              {/* User Dropdown Trigger */}
              <div className="hidden sm:block relative">
                {currentUser ? (
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)} 
                    className={`p-1.5 transition-colors flex items-center gap-1 cursor-pointer ${iconColorClass}`}
                  >
                    <User size={18} className="text-gold" />
                    <span className="hidden md:inline text-[9px] font-bold uppercase tracking-wider">{currentUser.name.split(' ')[0]}</span>
                  </button>
                ) : (
                  <Link 
                    to="/account" 
                    className={`p-1.5 transition-colors flex items-center gap-1 ${iconColorClass}`}
                  >
                    <User size={18} />
                  </Link>
                )}

                {/* Dropdown Card */}
                {dropdownOpen && currentUser && (
                  <div className="absolute right-0 mt-3 w-48 bg-primary border border-gold/10 rounded-xl shadow-xl py-2 z-50 text-xs font-semibold text-secondary">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-[8px] text-gold font-bold uppercase tracking-wider">Welcome</p>
                      <p className="font-bold text-white truncate">{currentUser.name}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-slate-300 hover:text-white">
                        <LayoutDashboard size={14} className="text-gold" /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/account?tab=orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-slate-300 hover:text-white">
                      📦 Order Tracking
                    </Link>
                    <Link to="/account?tab=profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-slate-300 hover:text-white">
                      ⚙️ Profile Details
                    </Link>
                    <button onClick={handleLogoutClick} className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-950/30 text-red-400 hover:text-red-300 border-t border-white/5 mt-1">
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className={`lg:hidden p-1.5 transition-colors cursor-pointer z-40 ${mobileMenuOpen ? 'text-white' : iconColorClass}`} 
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
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
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-gold hover:bg-gold-dark text-primary p-2.5 rounded-full cursor-pointer transition-colors">
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

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 left-0 lg:hidden z-30 bg-primary/98 backdrop-blur-xl flex flex-col pt-36 px-8 pb-12 text-white"
          >
            {/* Ambient Background decoration to make it feel luxury */}
            <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
            
            <motion.nav 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.1
                  }
                }
              }}
              className="flex flex-col gap-6 text-sm font-bold uppercase tracking-[0.22em] flex-grow"
            >
              {[
                { label: "Home", path: "/" },
                { label: "Shop Collection", path: "/shop" },
                { label: "Wholesale Portal", path: "/wholesale" },
                { label: `Wishlist ${wishlist.length > 0 ? `(${wishlist.length})` : ''}`, path: "/account?tab=wishlist" },
                { label: "About Heritage", path: "/about" },
                { label: "Contact Us", path: "/contact" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } }
                  }}
                >
                  <Link 
                    to={item.path} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="block hover:text-gold py-2 border-b border-white/5 transition-colors font-playfair text-lg italic tracking-wider"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 pt-6 border-t border-white/5"
            >
              {currentUser ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-white/60">Logged in as <span className="font-bold text-gold">{currentUser.name}</span></p>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="w-full bg-gold text-primary py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { setMobileMenuOpen(false); handleLogoutClick(); }} className="w-full border border-red-500/30 text-red-400 py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider hover:bg-red-500/10 transition-colors">
                    Log Out
                  </button>
                </div>
              ) : (
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="w-full block bg-gold text-primary py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider hover:bg-gold-dark transition-colors">
                  Log In / Sign Up
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
