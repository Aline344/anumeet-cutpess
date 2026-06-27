import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Truck, Percent, Sparkles, MessageCircle, Award, Database, Play, Heart, X, Check } from 'lucide-react';
import { db } from '../services/firebase';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/ui/Toast';

// Storefront image imports
import storeShelves from '../assets/store_shelves.jpg';
import storeRolls from '../assets/store_rolls.jpg';
import storeDrapes from '../assets/store_drapes.jpg';
import storeStack from '../assets/store_stack.jpg';
import storeEmbroidery from '../assets/store_embroidery.jpg';
import storeVelvets from '../assets/store_velvets.jpg';
import storeCottonPrints from '../assets/store_cotton_prints.jpg';
import storePolkaPrints from '../assets/store_polka_prints.jpg';
import storeDiagonalRolls from '../assets/store_diagonal_rolls.jpg';
import storeStandingRolls from '../assets/store_standing_rolls.jpg';
import sareeBanarasi from '../assets/saree_banarasi.png';
import userSaree1 from '../assets/user_saree_1.jpg';
import userSaree2 from '../assets/user_saree_2.png';
import userSaree3 from '../assets/user_saree_3.png';
import userSaree4 from '../assets/user_saree_4.png';
import userSaree5 from '../assets/user_saree_5.jpg';

// Collection of 28 premium images for Hero slideshow rotation
const HERO_IMAGES = [
  // User Uploaded Premium Saree & Suit Sets (Local)
  userSaree1,
  userSaree2,
  userSaree3,
  userSaree4,
  userSaree5,
  // Flagship Boutique Fabric and Drape Images (Local)
  sareeBanarasi,
  storeDrapes,
  storeEmbroidery,
  storeRolls,
  storeVelvets,
  storeStack,
  storeCottonPrints,
  storePolkaPrints,
  storeDiagonalRolls,
  storeStandingRolls,
  storeShelves,
  // Curated & Verified Traditional Saree & Suit Model Images (Unsplash)
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1605722243979-fe0be8158232?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&q=80&w=800"
];

// Reusing the verified high-quality HERO_IMAGES for the Lookbook Saree slideshow
const SAREE_IMAGES = HERO_IMAGES;

// Helper component for count-up animations
function AnimatedCounter({ end, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [activeImage, setActiveImage] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [sareeIndex, setSareeIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-advance saree slideshow every 2.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSareeIndex((prev) => (prev + 1) % SAREE_IMAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance hero slideshow every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  
  // Ref hooks for GSAP animations
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroCtasRef = useRef(null);
  const statsSectionRef = useRef(null);

  useEffect(() => {
    // GSAP Hero Entrance Animations
    const tl = gsap.timeline();
    
    if (heroTitleRef.current) {
      tl.fromTo(heroTitleRef.current.children, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, stagger: 0.15, ease: 'power3.out' }
      );
    }
    
    if (heroSubtitleRef.current) {
      tl.fromTo(heroSubtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        "-=0.6"
      );
    }

    if (heroCtasRef.current) {
      tl.fromTo(heroCtasRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        "-=0.4"
      );
    }
  }, []);

  const products = db.getProducts();
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  const categories = [
    {
      id: "cat-suits",
      name: "Unstitched Suit Sets",
      tag: "Festive & Heavy",
      gridSpan: "col-span-12 md:col-span-8",
      image: storeEmbroidery,
      desc: "Premium unstitched suit sets featuring heavy threadwork, designer necklines, and matching dupattas."
    },
    {
      id: "cat-materials",
      name: "Premium Dress Materials",
      tag: "Boutique Sourcing",
      gridSpan: "col-span-12 md:col-span-4",
      image: storeDrapes,
      desc: "Lustrous Roman Silks, Chanderi wovens, and pure Viscose Georgettes for bespoke tailoring."
    },
    {
      id: "cat-cutpieces",
      name: "Kurti Cut Pieces",
      tag: "Everyday Chic",
      gridSpan: "col-span-12 sm:col-span-6 md:col-span-4",
      image: storeShelves,
      desc: "Flowy solid and printed Rayon and Cotton lengths, cut to your precise requirements."
    },
    {
      id: "cat-prints",
      name: "Traditional Printed Fabrics",
      tag: "Heritage Handloom",
      gridSpan: "col-span-12 sm:col-span-6 md:col-span-8",
      image: storeCottonPrints,
      desc: "Authentic block prints, Bagh vegetable dye prints, and traditional polka prints."
    }
  ];

  const handleAddToCartClick = (e, product) => {
    e.preventDefault();
    addToCart(product, 1);
    const unitLabel = product.unit === 'piece' ? 'piece' : 'meter';
    showToast(`Added 1 ${unitLabel} of ${product.name} to cart!`, "success");
  };

  const handleWishlistClick = (e, product) => {
    e.preventDefault();
    toggleWishlist(product);
    const added = !isInWishlist(product.id);
    showToast(added ? `Added ${product.name} to wishlist!` : `Removed ${product.name} from wishlist!`, "info");
  };

  return (
    <div className="space-y-12 md:space-y-24 pb-12 md:pb-20 font-inter bg-secondary/30">
      
      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF0F5] via-[#FAF5EE] to-[#FFFBEB] text-primary min-h-[95vh] flex items-center pt-28 md:pt-32 pb-16 px-4 sm:px-8 lg:px-16 border-b border-gold/15">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-10 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Subtle Grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text details */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div ref={heroTitleRef} className="space-y-4">
              <span className="inline-block font-playfair italic text-lg md:text-xl text-gold tracking-widest font-semibold uppercase">
                ESTABLISHED 1998
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] font-playfair text-primary">
                Luxury Fabrics <br />
                <span className="text-gold italic font-medium">Crafted</span> for <br />
                Timeless Elegance
              </h1>
            </div>
            
            <p ref={heroSubtitleRef} className="text-sm md:text-base text-slate-700 max-w-lg leading-relaxed font-light font-inter">
              Discover premium cut pieces, designer collections, and wholesale fabrics sourced straight from Bhopal's premier heritage textile destination. Unstitched suit sets and handloom masterpieces, tailored for modern designers.
            </p>

            <div ref={heroCtasRef} className="flex flex-wrap items-center gap-6 pt-2">
              <Link 
                to="/shop" 
                className="px-8 py-4 bg-gold hover:bg-gold-dark text-primary font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-gold/20 transform hover:-translate-y-0.5 active:translate-y-0 rounded-xl font-inter flex items-center gap-2 group"
              >
                Shop Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => setVideoModalOpen(true)}
                className="flex items-center gap-3 text-primary hover:text-gold font-bold text-xs uppercase tracking-widest transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-primary group-hover:border-gold transition-all duration-300">
                  <Play size={16} className="fill-current ml-0.5" />
                </div>
                <span>Watch Brand Film</span>
              </button>
            </div>
          </div>

          {/* Right Visual Image Layout (Made larger with auto-changing 28-image slideshow) */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[500px] sm:min-h-[580px] w-full max-w-[560px] mx-auto mt-8 lg:mt-0">
            {/* Main Luxury Image Card */}
            <div className="w-[88%] aspect-[3/4.2] rounded-[40px] overflow-hidden border border-gold/20 shadow-2xl relative group bg-[#FAF5EE]">
              <AnimatePresence initial={false}>
                <motion.img 
                  key={heroIndex}
                  src={HERO_IMAGES[heroIndex]} 
                  alt="Traditional Premium Suit Design" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF5EE]/40 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Floating Glass Card 1 - Left Bottom */}
            <div className="hidden sm:flex absolute left-[-10px] bottom-[30px] glass-panel p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-3 max-w-[200px] animate-[float_4s_ease-in-out_infinite] z-20 text-primary">
              <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-gold/30">
                <img 
                  src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=150" 
                  alt="Swatches preview"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gold uppercase tracking-wider">Premium Silks</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-gold text-gold" />)}
                </div>
              </div>
            </div>

            {/* Floating Glass Card 2 - Right Top */}
            <div className="hidden sm:flex absolute right-[-5px] top-[30px] glass-panel p-4 rounded-2xl shadow-2xl border border-white/40 flex flex-col gap-1 max-w-[170px] animate-[float_4s_ease-in-out_infinite_1.5s] z-20 text-primary">
              <span className="text-[8px] font-extrabold text-gold tracking-widest uppercase">Bhopal Sourcing</span>
              <p className="text-[11px] font-extrabold text-primary leading-tight">100% Quality Swatch Assurance</p>
              <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 mt-1">
                <Check size={10} strokeWidth={3} /> Certified Loom
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND TRUST STATISTICS PANEL */}
      <section ref={statsSectionRef} className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-r from-[#FAF5EE] via-[#FFF0F5] to-[#FAF5EE] border border-gold/20 rounded-3xl p-8 md:p-12 text-primary shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 bg-gold/5 blur-[90px] rounded-full pointer-events-none"></div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10 divide-y-0 divide-x-0 lg:divide-x divide-gold/20">
            <div className="text-center lg:px-4 space-y-2">
              <h3 className="text-3xl md:text-5xl font-bold font-playfair text-gold">
                <AnimatedCounter end={25} suffix="+" />
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600 font-bold uppercase tracking-widest">Years Sourcing Heritage</p>
            </div>
            
            <div className="text-center lg:px-4 space-y-2 pt-4 lg:pt-0">
              <h3 className="text-3xl md:text-5xl font-bold font-playfair text-gold">
                <AnimatedCounter end={10000} suffix="+" />
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600 font-bold uppercase tracking-widest">Fabric Designs Cataloged</p>
            </div>

            <div className="text-center lg:px-4 space-y-2 pt-4 lg:pt-0">
              <h3 className="text-3xl md:text-5xl font-bold font-playfair text-gold">
                <AnimatedCounter end={5000} suffix="+" />
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600 font-bold uppercase tracking-widest">Boutique & Retail Partners</p>
            </div>

            <div className="text-center lg:px-4 space-y-2 pt-4 lg:pt-0">
              <h3 className="text-3xl md:text-5xl font-bold font-playfair text-gold">
                <AnimatedCounter end={100} suffix="+" />
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600 font-bold uppercase tracking-widest">Daily Flagship Visitors</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 md:space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">Curated Sourcing Vaults</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary font-playfair">Featured Collections</h2>
          <p className="text-xs md:text-sm text-muted max-w-md mx-auto font-light">Explore handpicked premium designer fabrics and unstitched sets</p>
          <div className="h-[2px] w-16 bg-gold mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className={`${cat.gridSpan} group relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[360px] border border-slate-100 cursor-pointer shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10 hover:shadow-2xl`}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent flex flex-col justify-end p-8 space-y-2">
                <span className="text-[9px] font-bold tracking-widest text-gold uppercase">{cat.tag}</span>
                <h3 className="text-white font-bold text-xl md:text-2xl font-playfair tracking-wide">{cat.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light max-w-md opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all duration-500 ease-in-out">
                  {cat.desc}
                </p>
                <div className="flex items-center gap-1.5 text-white font-bold text-[10px] uppercase tracking-widest pt-2 group-hover:translate-x-1.5 transition-transform duration-300">
                  Explore Collection <ArrowRight size={12} className="text-gold" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 md:space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">The Heritage Guarantee</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary font-playfair">Why Boutique Owners Choose Us</h2>
          <div className="h-[2px] w-16 bg-gold mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pt-4">
          {[
            { icon: <ShieldCheck size={28} className="text-gold" />, title: "Premium Textile Quality", desc: "Rigorous standards for color fastness, soft hand feel, weave density, and GSM strength in every cut piece." },
            { icon: <Percent size={28} className="text-gold" />, title: "Direct Wholesale Rates", desc: "Flexible bulk discounts and wholesale toggles designed specifically to protect margins for retail and boutique designers." },
            { icon: <Sparkles size={28} className="text-gold" />, title: "Latest Trend Inventory", desc: "Weekly drops of fresh fabrics including lustrous Roman Silks, premium Chanderis, organzas, and block prints." },
            { icon: <Database size={28} className="text-gold" />, title: "Huge Physical Stock", desc: "Over 10,000 meters of ready stock available at our flagship Bhopal warehouse for immediate dispatch." },
            { icon: <Truck size={28} className="text-gold" />, title: "Express Dispatch", desc: "Carefully wrapped shipments sent via premium express logistics to deliver fabrics safely across India within 3-5 days." },
            { icon: <Award size={28} className="text-gold" />, title: "Trusted Since 1998", desc: "25+ years of sourcing experience offering personalized support, catalog swatches, and direct order tracking." }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col space-y-3 md:space-y-4 hover:-translate-y-1"
            >
              <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center border border-gold/10">
                {item.icon}
              </div>
              <h3 className="font-bold text-primary font-playfair text-lg md:text-xl">{item.title}</h3>
              <p className="text-xs text-muted leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VIDEO SHOWCASE SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative aspect-[4/3] sm:aspect-[16/10] md:h-[480px] md:aspect-auto rounded-[40px] overflow-hidden border border-gold/20 shadow-xl group cursor-pointer bg-[#FAF5EE]" onClick={() => setVideoModalOpen(true)}>
          {/* HTML5 background video loop */}
          <video 
            src="https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-stitching-a-fabric-close-up-34149-large.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-50 group-hover:scale-102 transition-transform duration-[1500ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF5EE]/95 via-[#FAF5EE]/40 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-16 space-y-3 md:space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">The Art of Fine Textiles</span>
              <h3 className="text-2xl md:text-5xl font-bold font-playfair text-primary max-w-xl">Inside the Loom: Crafting Anumeet’s Luxury Fabrics</h3>
              <p className="text-xs md:text-sm text-slate-700 font-light max-w-lg leading-relaxed">
                Take a brief cinematic tour of our craftsmanship processes, where master weavers and handblock printers collaborate to produce fabric of unmatched texture.
              </p>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gold text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-lg border border-gold">
                <Play size={18} className="fill-current ml-0.5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Click to play brand video</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS SECTION */}
      <section className="bg-[#FFF0F5]/60 text-primary py-20 px-4 md:px-8 relative overflow-hidden border-t border-b border-gold/10">
        <div className="absolute -top-40 -left-40 h-96 w-96 bg-gold/5 blur-[120px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">Most Appreciated</span>
              <h2 className="text-3xl md:text-5xl font-bold font-playfair text-primary">Best Selling Fabrics</h2>
            </div>
            <Link to="/shop?sort=best-selling" className="text-xs font-bold uppercase tracking-wider text-gold hover:text-primary flex items-center gap-2 border-b border-gold pb-1 transition-colors">
              View All Best Sellers <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((prod) => (
              <Link 
                to={`/product/${prod.id}`}
                key={prod.id} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 group hover:border-gold/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 shrink-0">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-4 left-4 bg-gold text-primary text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-lg shadow-md border border-gold/10">
                    Best Seller
                  </span>
                  {/* Action overlays */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={(e) => handleAddToCartClick(e, prod)}
                      className="p-3 bg-white text-primary hover:bg-gold hover:text-primary rounded-full transition-colors cursor-pointer shadow-lg hover:scale-105 duration-200"
                      aria-label="Add to Cart"
                    >
                      <ShoppingBag size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleWishlistClick(e, prod)}
                      className={`p-3 rounded-full transition-colors cursor-pointer shadow-lg hover:scale-105 duration-200 ${isInWishlist(prod.id) ? 'bg-gold text-primary font-bold' : 'bg-white text-primary hover:bg-slate-50'}`}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart size={18} fill={isInWishlist(prod.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{prod.category}</span>
                    <h3 className="font-bold text-sm text-primary line-clamp-1 group-hover:text-gold transition-colors font-playfair">{prod.name}</h3>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="text-sm font-bold text-primary font-mono">₹{prod.pricePerMeter}<span className="text-[10px] text-slate-400 font-normal">/{prod.unit === 'piece' ? 'pc' : 'm'}</span></span>
                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-wider">Wholesale: ₹{prod.wholesalePrice}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200/60 pb-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">Fresh off the loom</span>
            <h2 className="text-3xl md:text-5xl font-bold font-playfair text-primary">New Arrivals</h2>
          </div>
          <Link to="/shop?sort=newest" className="text-xs font-bold uppercase tracking-wider text-primary hover:text-gold flex items-center gap-2 border-b border-primary pb-1 transition-colors">
            View All New Arrivals <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((prod) => (
            <Link 
              to={`/product/${prod.id}`}
              key={prod.id} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 group hover:border-gold/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 shrink-0">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-lg shadow-md border border-gold/20">
                  New Arrival
                </span>
                <div className="absolute inset-0 bg-primary/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={(e) => handleAddToCartClick(e, prod)}
                    className="p-3 bg-white text-primary hover:bg-gold hover:text-primary rounded-full transition-colors cursor-pointer shadow-lg hover:scale-105 duration-200"
                    aria-label="Add to Cart"
                  >
                    <ShoppingBag size={18} />
                  </button>
                  <button 
                    onClick={(e) => handleWishlistClick(e, prod)}
                    className={`p-3 rounded-full transition-colors cursor-pointer shadow-lg hover:scale-105 duration-200 ${isInWishlist(prod.id) ? 'bg-gold text-primary font-bold' : 'bg-white text-primary hover:bg-slate-50'}`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart size={18} fill={isInWishlist(prod.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{prod.category}</span>
                  <h3 className="font-bold text-sm text-primary line-clamp-1 group-hover:text-gold transition-colors font-playfair">{prod.name}</h3>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-sm font-bold text-primary font-mono">₹{prod.pricePerMeter}<span className="text-[10px] text-slate-400 font-normal">/{prod.unit === 'piece' ? 'pc' : 'm'}</span></span>
                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-wider">Wholesale: ₹{prod.wholesalePrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. LOOKBOOK / physical store bento gallery */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 md:space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">Physical Store Sourcing Desk</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary font-playfair">Inside Our Bhopal Flagship</h2>
          <p className="text-xs md:text-sm text-muted max-w-lg mx-auto font-light">
            Take a visual tour of our physical boutique showroom, housing over 10,000 meters of premium custom cut pieces and designer rolls.
          </p>
          <div className="h-[2px] w-16 bg-gold mx-auto mt-2"></div>
        </div>

        {/* Bento Grid Gallery Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
          {/* 1. Main Large Image: Store shelves */}
          <div 
            onClick={() => setActiveImage(storeShelves)}
            className="sm:col-span-2 lg:col-span-8 group relative rounded-[32px] overflow-hidden aspect-[16/10] lg:aspect-[16/10] border border-slate-100 cursor-zoom-in shadow-md hover:shadow-2xl transition-all duration-500"
          >
            <img 
              src={storeShelves} 
              alt="Plain Rayon & Cotton Shelves" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-8">
              <span className="text-[9px] font-bold tracking-widest text-gold uppercase">Rayon & Cotton Shelves</span>
              <h3 className="text-white font-bold text-xl md:text-2xl font-playfair tracking-wide">Pure Solid Colors Stack</h3>
              <p className="text-xs text-slate-300 max-w-md mt-1 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                100% pure organic cotton and rayon fabrics stacked in every shade imaginable, ready for custom cutting.
              </p>
            </div>
          </div>

          {/* 2. Mannequin embroidery suit sets */}
          <div 
            onClick={() => setActiveImage(storeEmbroidery)}
            className="sm:col-span-1 lg:col-span-4 group relative rounded-[32px] overflow-hidden aspect-[4/3] lg:aspect-[4/5] border border-slate-100 cursor-zoom-in shadow-md hover:shadow-2xl transition-all duration-500"
          >
            <img 
              src={storeEmbroidery} 
              alt="Embroidered Suit Sets Wall" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-[9px] font-bold tracking-widest text-gold uppercase">Embroidery Wall</span>
              <h3 className="text-white font-bold text-lg font-playfair tracking-wide">Designer Kurta Sets</h3>
              <p className="text-xs text-slate-300 mt-1 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                Detailed threadwork and heavy zari embroidery suit materials on display.
              </p>
            </div>
          </div>

          {/* 3. Rolled fabrics */}
          <div 
            onClick={() => setActiveImage(storeRolls)}
            className="sm:col-span-1 lg:col-span-4 group relative rounded-[32px] overflow-hidden aspect-[4/3] border border-slate-100 cursor-zoom-in shadow-md hover:shadow-2xl transition-all duration-500"
          >
            <img 
              src={storeRolls} 
              alt="Premium Rolled Fabrics" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-[9px] font-bold tracking-widest text-gold uppercase">Fabric Rolls</span>
              <h3 className="text-white font-bold text-base font-playfair tracking-wide">Designer Print Rolls</h3>
              <p className="text-xs text-slate-300 mt-1 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                Lustrous Roman Silks and printed drapes stored in clean, protective rolls.
              </p>
            </div>
          </div>

          {/* 4. Draped silks */}
          <div 
            onClick={() => setActiveImage(SAREE_IMAGES[sareeIndex])}
            className="sm:col-span-1 lg:col-span-4 group relative rounded-[32px] overflow-hidden aspect-[4/3] border border-slate-100 cursor-zoom-in shadow-md hover:shadow-2xl transition-all duration-500"
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900">
              <AnimatePresence initial={false}>
                <motion.img 
                  key={sareeIndex}
                  src={SAREE_IMAGES[sareeIndex]} 
                  alt="Traditional Saree Drape" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover animate-kenburns"
                />
              </AnimatePresence>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent flex flex-col justify-end p-6 z-10">
              <span className="text-[9px] font-bold tracking-widest text-gold uppercase">Banarasi & Silk</span>
              <h3 className="text-white font-bold text-base font-playfair tracking-wide">Traditional Drapes</h3>
              <p className="text-xs text-slate-300 mt-1 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                Classic Zari silk sarees and heavy fabrics displaying rich texture.
              </p>
            </div>
          </div>

          {/* 5. Folded swatches */}
          <div 
            onClick={() => setActiveImage(storeStack)}
            className="sm:col-span-1 lg:col-span-4 group relative rounded-[32px] overflow-hidden aspect-[4/3] border border-slate-100 cursor-zoom-in shadow-md hover:shadow-2xl transition-all duration-500"
          >
            <img 
              src={storeStack} 
              alt="Vibrant Folded Swatches" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-[9px] font-bold tracking-widest text-gold uppercase">Cotton Swatches</span>
              <h3 className="text-white font-bold text-base font-playfair tracking-wide">Vibrant Cut Pieces</h3>
              <p className="text-xs text-slate-300 mt-1 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                Premium multi-colored cotton cut pieces sorted by tone and thickness.
              </p>
            </div>
          </div>
        </div>

        {/* Lightbox Pop-up Viewer */}
        <AnimatePresence>
          {activeImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveImage(null)}
              className="fixed inset-0 bg-primary/95 z-55 flex items-center justify-center p-4 cursor-zoom-out"
            >
              <button className="absolute top-6 right-6 text-white/60 hover:text-white p-2 border border-white/10 rounded-full hover:border-gold transition-colors">
                <X size={24} />
              </button>
              <motion.img 
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                transition={{ type: 'spring', damping: 25 }}
                src={activeImage} 
                alt="Store Zoom View" 
                className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl border border-gold/15" 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 9. WHOLESALE B2B CALL-TO-ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-br from-[#FAF5EE] to-[#FFF0F5] rounded-[32px] p-6 sm:p-8 md:p-12 text-primary border border-gold/30 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 shadow-xl">
          <div className="absolute top-0 right-0 h-64 w-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-gold/20">
              🤝 B2B Bulk Sourcing Desk
            </span>
            <h2 className="text-2xl md:text-4xl font-bold font-playfair leading-tight">Are you a Boutique Owner or Fashion Designer?</h2>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-light">
              ANUMEET KATPIECE is Bhopal's trusted fabric sourcing hub. Get custom color runs, priority design swatches, bulk billing discounts, and direct WhatsApp sales desk support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0 z-10">
            <Link 
              to="/wholesale" 
              className="px-8 py-4 bg-gold hover:bg-gold-dark text-primary font-bold text-xs uppercase tracking-widest rounded-xl text-center transition-all shadow-lg shadow-gold/10 hover:shadow-gold/25"
            >
              Get Bulk Pricing
            </Link>
            <a 
              href="https://wa.me/919131264893?text=Hello%20Anumeet%20Katpiece%20Bhopal,%20I'm%20a%20boutique%20owner%20interested%20in%20bulk%20fabric%20sourcing."
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10"
            >
              <MessageCircle size={16} /> WhatsApp B2B Desk
            </a>
          </div>
        </div>
      </section>

      {/* 10. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 md:space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">Patron Voices</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary font-playfair">What Designers Say</h2>
          <div className="h-[2px] w-16 bg-gold mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Priya Varma", role: "Designer, Varma Couture (Indore)", quote: "The Roman Silk gold fabric from Anumeet is stunning. We created a bridal trousseau line last month, and the texture hold was outstanding. Incredible wholesale pricing!" },
            { name: "Ruchi Lodhi", role: "Owner, Bhopal Fashion House", quote: "Our boutique has been sourcing Bagh Handblock and plain Rayons from Anumeet Katpiece for 3 years. Quality color fastness and reliable shipping make them our #1 supplier." },
            { name: "Sunita Advani", role: "Bespoke Tailoring Studio (Bhopal)", quote: "Ordering via WhatsApp is so smooth. They send videos of fabric drapes, measure precisely, and deliver to my studio same-day. Extremely professional!" }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-md space-y-4 md:space-y-6 flex flex-col justify-between hover:shadow-2xl hover:border-gold/25 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-3 md:space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={15} className="fill-gold text-gold" />)}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic font-playfair">"{item.quote}"</p>
              </div>
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-0.5">
                <h4 className="font-bold text-xs text-primary uppercase tracking-wider font-inter">{item.name}</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 space-y-8 md:space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">Got Questions?</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary font-playfair text-center">Frequently Asked</h2>
          <div className="h-[2px] w-16 bg-gold mx-auto mt-2"></div>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "What is your Minimum Order Quantity (MOQ) for wholesale prices?",
              a: "Our wholesale pricing starts at a minimum of 10 to 50 meters depending on the fabric category (e.g. 10 meters for heavy Silks/Velvets, 20 meters for Rayon). You can easily toggle between Retail and Wholesale pricing models directly on our shop pages."
            },
            {
              q: "Do you ship orders outside Bhopal across India?",
              a: "Yes, we ship to all states across India. Delivery takes 3-5 business days for major cities. Shipping is completely free for all retail and wholesale orders above ₹1,500."
            },
            {
              q: "Can I inspect samples before placing a bulk order?",
              a: "Absolutely! We supply sample swatch booklets to boutique owners and designers. You can place a sample pack request by contacting our Bhopal store desk or sending an inquiry on the Wholesale page."
            },
            {
              q: "Do you accept returns if the fabric quality differs?",
              a: "Yes, we have a strict quality guarantee. If you receive a fabric batch with manufacturing defects or printing errors, you can request an exchange or refund within 7 days of delivery."
            }
          ].map((faq, idx) => (
            <FaqItem key={idx} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>

      {/* 12. WHATSAPP FLOATING BUTTON */}
      <a 
        href="https://wa.me/919131264893?text=Hello%20Anumeet%20Katpiece%20Bhopal,%20I'm%20looking%20for%20premium%20wholesale%20fabrics."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3 md:p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 border border-gold/20"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={20} className="fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-500 ease-in-out text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap">
          WhatsApp Us
        </span>
      </a>

      {/* BRAND VIDEO MODAL LIGHTBOX */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/95 z-55 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 cursor-pointer" onClick={() => setVideoModalOpen(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-4xl aspect-[16/9] bg-black rounded-3xl overflow-hidden shadow-2xl border border-gold/20 z-10"
            >
              <button 
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-2 border border-white/10 rounded-full hover:border-gold transition-all duration-200 bg-black/40 z-20 cursor-pointer"
              >
                <X size={20} />
              </button>
              
              {/* HTML5 video loop with controls */}
              <video 
                src="https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-stitching-a-fabric-close-up-34149-large.mp4" 
                controls 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Subcomponent: Accordion item using Framer Motion
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-100 bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 sm:p-5 text-left text-primary hover:text-gold transition-colors"
      >
        <span className="font-bold text-[11px] uppercase tracking-wider leading-tight font-inter">{question}</span>
        <span className="text-[10px] text-slate-400 font-bold transition-transform duration-300" style={{ transform: open ? 'rotate(45deg)' : 'none' }}>
          ➕
        </span>
      </button>
      
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs text-muted leading-relaxed border-t border-slate-50 font-inter font-light">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}
