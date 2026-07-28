import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  ArrowRight, Star, ShoppingBag, ShieldCheck, Truck, Percent, 
  Sparkles, MessageCircle, Award, Database, Play, Heart, X, Check, 
  Info, Calculator, Palette, HelpCircle, FileText, ChevronRight, 
  MapPin, Phone, Mail, Clock, ExternalLink, Compass 
} from 'lucide-react';
import { db } from '../services/firebase';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/ui/Toast';
import confetti from 'canvas-confetti';

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

// Collection of images for Hero slideshow rotation
const HERO_IMAGES = [
  userSaree1,
  userSaree2,
  userSaree3,
  userSaree4,
  userSaree5,
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
  storeShelves
];

export default function Home() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [activeImage, setActiveImage] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('all');
  
  // Interactive Guides Modal State
  const [activeGuideKey, setActiveGuideKey] = useState(null);
  
  // Sizing Calculator State (inside guides modal)
  const [outfitType, setOutfitType] = useState('kurti');
  const [outfitSize, setOutfitSize] = useState('m');
  const [calculatedMeters, setCalculatedMeters] = useState(2.0);
  const [calculatedWidth, setCalculatedWidth] = useState('44 inches');
  const [calcRecommendation, setCalcRecommendation] = useState('');
  
  // GSM Matcher State (inside guides modal)
  const [activeGsmTab, setActiveGsmTab] = useState('Cotton');

  // Auto-advance hero slideshow every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Top header notification ticker messages
  const TICKER_MESSAGES = [
    "🚚 FREE Shipping across India on Retail & Wholesale Orders above ₹1,500!",
    "💬 Need Fabric Sourcing Advice? Chat on WhatsApp: +91 9131264893",
    "🧵 Premium Quality Fabrics • Direct Bhopal Warehouse Sourcing • Fast Dispatch",
    "🔒 100% Secure Payments | Trusted Support Before & After Purchase",
    "🇮🇳 From Our Family Store to Your Stitching Table ❤️"
  ];

  // Rotate Top Ticker every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  
  // Ref hooks for GSAP animations
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroCtasRef = useRef(null);

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

  const products = db.getProducts() || [];

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

  // ✦ SHOP FABRICS BY TYPE ✦
  const fabricCategories = [
    { name: "Cotton", tag: "Soft • Breathable • Daily", image: storeCottonPrints, link: "/shop?fabric=Cotton" },
    { name: "Rayon", tag: "Smooth • Flowing • Daily", image: storeShelves, link: "/shop?fabric=Rayon" },
    { name: "Georgette", tag: "Light • Flowing • Elegant", image: storeStandingRolls, link: "/shop?fabric=Georgette" },
    { name: "Chiffon", tag: "Soft • Airy • Graceful", image: storeRolls, link: "/shop?fabric=Chiffon" },
    { name: "Crepe", tag: "Fluid • Soft • Wrinkle-Free", image: storeEmbroidery, link: "/shop?fabric=Crepe" },
    { name: "Banarasi", tag: "Rich • Woven • Festive", image: sareeBanarasi, link: "/shop?fabric=Banarasi" },
    { name: "Organza", tag: "Sheer • Crisp • Elegant", image: storeDiagonalRolls, link: "/shop?fabric=Organza" },
    { name: "Silk", tag: "Soft • Premium • Classic", image: storeDrapes, link: "/shop?fabric=Silk" },
    { name: "Fendy", tag: "Smooth • Stylish • Party", image: storeStack, link: "/shop?fabric=Fendy" }
  ];

  // ✦ SHOP DUPATTAS BY OCCASION ✦
  const dupattasOccasions = [
    { name: "Daily Wear", desc: "Simple printed chiffon & cotton dupattas", image: storeCottonPrints, link: "/shop?query=daily" },
    { name: "Casual Wear", desc: "Breezy Kota Doria & Rayon drapes", image: storeShelves, link: "/shop?query=casual" },
    { name: "Festive Wear", desc: "Gota Patti & traditional mirror work", image: storeDiagonalRolls, link: "/shop?query=festive" },
    { name: "Party Wear", desc: "Sequins & digital prints on sheer organza", image: storeStack, link: "/shop?query=party" },
    { name: "Wedding Wear", desc: "Rich Zari border Banarasi & silk dupattas", image: sareeBanarasi, link: "/shop?query=wedding" },
    { name: "Bridal Collection", desc: "Heavy embroidered velvet & net overlays", image: storeEmbroidery, link: "/shop?query=bridal" }
  ];

  // ✦ STITCH YOUR STYLE ✦ (Inspired by Every Style)
  const inspiredStyles = [
    { title: "Slit Kurti Dress", desc: "Stitched from Plain Emerald Green Rayon", image: userSaree1 },
    { title: "Celebration Lehenga", desc: "Tailored from Champagne Gold Roman Silk", image: userSaree2 },
    { title: "Bagh Print Suit Set", desc: "Designed with Natural Handblock Cotton", image: userSaree3 },
    { title: "Heavy Zari Anarkali", desc: "Woven in Chanderi Silk Cotton Mix", image: userSaree4 }
  ];

  // ✦ CELEBRATION EDIT ✦ (Wedding & Festive Fabrics)
  const celebrationFabrics = products.filter(p => 
    p.id.includes("pink") || 
    p.id.includes("blue")
  ).slice(0, 4);

  // ✦ SEE THE DETAILS ✦ (Watch Before You Buy Video Reels)
  const reelsMockup = [
    { title: "Cotton Fabric Flow", views: "12K", image: storeCottonPrints, desc: "Testing the drape of natural handblock cotton." },
    { title: "Roman Silk Zoom", views: "18K", image: storeDrapes, desc: "Close-up look at Anumeet's signature champagne luster." },
    { title: "Georgette Twirl", views: "24K", image: storeStandingRolls, desc: "Watch the bounce of our scarlet red viscose base." },
    { title: "Embroidery Details", views: "9K", image: storeEmbroidery, desc: "Intricate threadwork & neck borders inspected." }
  ];

  // Color options for the dynamic shade filter
  const SHADES = [
    { name: "all", label: "Show All", hex: "linear-gradient(135deg, #B71C1C 0%, #fff 100%)" },
    { name: "Red", label: "Crimson Red", hex: "#B71C1C" },
    { name: "White", label: "Ivory White", hex: "#FDFBF7" },
    { name: "Blue", label: "Royal Blue", hex: "#1A237E" },
    { name: "Black", label: "Charcoal Black", hex: "#212121" },
    { name: "Green", label: "Emerald Green", hex: "#0F5257" },
    { name: "Yellow", label: "Mustard Yellow", hex: "#E1AD01" },
    { name: "Pink", label: "Rose Pink", hex: "#F8BBD0" }
  ];

  // Get color-filtered products
  const getColorFilteredProducts = () => {
    if (selectedColor === 'all') {
      return products.slice(0, 4);
    }
    return products.filter(p => {
      const matchName = p.color && p.color.toLowerCase().includes(selectedColor.toLowerCase());
      const matchCat = p.subCategory && p.subCategory.toLowerCase().includes(selectedColor.toLowerCase());
      return matchName || matchCat;
    }).slice(0, 4);
  };

  // ✦ FABRIC BUYING GUIDES ✦
  const buyingGuides = [
    { key: "choose", title: "How to Choose the Right Fabric", desc: "Cotton vs Rayon vs Silk vs Chiffon comparison" },
    { key: "need", title: "How Much Fabric Do You Need?", desc: "Kurti, Suit, Blouse, Lehenga calculations" },
    { key: "gsm", title: "Fabric GSM Guide", desc: "Lightweight, Medium, Heavy fabrics explained" },
    { key: "lining", title: "How to Match Lining", desc: "Perfect lining selection with every fabric" },
    { key: "care", title: "Fabric Care Guide", desc: "Washing, Ironing & Storage Tips" },
    { key: "season", title: "Summer vs Winter Fabrics", desc: "Best fabrics for every season" },
    { key: "occasion", title: "Fabric by Occasion", desc: "Daily Wear, Office, Wedding, Party, Festive" },
    { key: "width", title: "Fabric Width Guide", desc: "36\", 44\", 58\", 60\" – what each is used for" }
  ];

  // Sizing Calculator calculations
  const outfitCalculatorConfig = {
    blouse: {
      estimates: { s: 1.0, m: 1.0, l: 1.0, xl: 1.25, xxl: 1.25 },
      width: '44 inches',
      desc: 'Blouses usually need standard 1 to 1.25 meters. For heavy puff sleeves or designers, add 0.5 meters.'
    },
    kurti: {
      estimates: { s: 2.0, m: 2.0, l: 2.25, xl: 2.5, xxl: 2.75 },
      width: '44 inches',
      desc: 'Ideal for short or straight kurtis. We recommend soft cotton or fluid rayon for high-comfort daily wear.'
    },
    kurta: {
      estimates: { s: 2.5, m: 2.5, l: 2.75, xl: 3.0, xxl: 3.25 },
      width: '44 inches',
      desc: 'Fits standard knee-length or long designer kurtas. Cotton-linen or structured Maslin blends work best.'
    },
    'salwar-suit': {
      estimates: { s: 4.0, m: 4.0, l: 4.25, xl: 4.5, xxl: 4.75 },
      width: '44 inches',
      desc: 'Includes fabric estimates for both top (Kurta) and bottom (Salwar). Check out our matching lining fabrics too.'
    },
    anarkali: {
      estimates: { s: 4.5, m: 4.5, l: 4.75, xl: 5.0, xxl: 5.5 },
      width: '58 inches',
      desc: 'Wide width (58\") is highly recommended for Anarkali dresses to maximize panels (kalis) and flare.'
    },
    lehenga: {
      estimates: { s: 4.5, m: 5.0, l: 5.0, xl: 5.5, xxl: 6.0 },
      width: '58 inches',
      desc: 'Lehengas benefit from structured fabrics like Roman Silk, Brocade, or Velvet. Requires cotton-astar lining.'
    },
    palazzo: {
      estimates: { s: 2.0, m: 2.0, l: 2.25, xl: 2.5, xxl: 2.5 },
      width: '44 inches',
      desc: 'Palazzos and trousers require fluid, opaque fabrics like plain Rayon or heavy Crepe for elegant falls.'
    }
  };

  useEffect(() => {
    const config = outfitCalculatorConfig[outfitType];
    if (config) {
      const meters = config.estimates[outfitSize];
      setCalculatedMeters(meters);
      setCalculatedWidth(config.width);
      setCalcRecommendation(config.desc);
    }
  }, [outfitType, outfitSize]);

  // GSM data mapping
  const GSM_DATA = {
    Cotton: {
      gsm: "120 GSM",
      weight: "Light-Medium",
      lining: "No lining needed (completely opaque).",
      uses: "Daily Kurtis, Salwars, Summer Shirts, Home Linen.",
      desc: "Anumeet's signature pure organic cotton. Woven with dual-core yarns to prevent shrinkage, ensuring high air permeability while keeping the fabric light and structured."
    },
    Rayon: {
      gsm: "140 GSM",
      weight: "Medium",
      lining: "Lining optional (opaque, but lining extends life).",
      uses: "Flowy Dresses, Palazzos, Tunics, Flared Pants.",
      desc: "Super-soft viscose rayon. Possesses a cool touch with a heavy liquid-drape quality. Ideal for comfortable daily and office casual ensembles."
    },
    Silk: {
      gsm: "180 GSM",
      weight: "Medium-Heavy",
      lining: "Lining recommended (Cotton Astar for skin comfort).",
      uses: "Wedding Kurtas, Sherwanis, Structured Lehenga panels.",
      desc: "Champagne Roman Silk with a tight luxurious weave. Provides a beautiful metallic luster and structural stiffness that keeps pleats and folds crisp."
    },
    Georgette: {
      gsm: "80 GSM",
      weight: "Lightweight & Sheer",
      lining: "Lining required (Crepe or Cotton lining matches best).",
      uses: "Anarkali panels, gathered sarees, sheer overlays.",
      desc: "Viscose georgette displaying a classic granular crinkly feel. Exceptionally bouncy and lightweight, making it beautiful for multi-layered drapes."
    },
    Organza: {
      gsm: "60 GSM",
      weight: "Ultra-Light & Crisp",
      lining: "Lining required (Satin or Silk lining for shine).",
      uses: "Designer dupattas, voluminous sleeves, structured overlays.",
      desc: "Glassy, sheer organza woven with highly twisted monofilament silk. Holds a stiff shape beautifully, giving designer silhouettes an avant-garde look."
    },
    Velvet: {
      gsm: "260 GSM",
      weight: "Heavyweight & Plush",
      lining: "Lining recommended (Soft satin or cotton lining).",
      uses: "Heavy winter blouses, bridal lehengas, royal shawls.",
      desc: "Premium Micro Velvet 9000. Dense pile with a rich dual-tone luster. Keeps warm and feels incredibly plush on the skin."
    },
    Chiffon: {
      gsm: "65 GSM",
      weight: "Feather-light & Transparent",
      lining: "Lining required (Breezy crepe or soft cotton).",
      uses: "Layered panels, light summer dupattas, flowy sleeves.",
      desc: "Airy chiffon with a soft feel. Highly transparent, offering unmatched light-refracting qualities for soft pastel clothing."
    },
    Crepe: {
      gsm: "120 GSM",
      weight: "Light-Medium",
      lining: "Lining optional (Opaque, wrinkle-free base).",
      uses: "Pencil trousers, custom stitched tunics, formal wear.",
      desc: "Flat-crepe fabric showcasing a subtle pebble texture. Wrinkle-free and holds colors deeply. Sews exceptionally easily without slipping."
    }
  };

  const handleCalculatorCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#B71C1C', '#121212', '#FFFFFF']
    });
    showToast(`Calculator matches: Sourced ${calculatedMeters}m of fabric at 100% precision!`, "success");
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16 md:pb-24 font-inter bg-white">
      
      {/* 1. TOP HEADER NOTIFICATION TICKER */}
      <div className="w-full bg-[#B71C1C] text-white py-3 px-4 relative overflow-hidden border-b border-black/5 z-30 font-inter">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={tickerIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-[10px] md:text-xs font-semibold tracking-wider flex items-center justify-center gap-2"
            >
              <Sparkles size={13} className="text-white animate-pulse shrink-0" />
              <span>{TICKER_MESSAGES[tickerIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 2. SPLIT HERO BANNER SECTION (Premium & Bright Collection) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-stone-50 border-b border-slate-100 min-h-[75vh] flex items-center pt-24 pb-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column - Bright & High Contrast */}
          <div className="lg:col-span-6 space-y-6 text-left" ref={heroTitleRef}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B71C1C]/10 border border-[#B71C1C]/15 text-[#B71C1C] text-[10px] font-extrabold uppercase tracking-widest">
              <Sparkles size={11} className="animate-pulse" />
              <span>Premium Collection 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              Premium Fabrics <br />
              <span className="text-[#B71C1C]">For Every Stitch.</span>
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-xl leading-relaxed font-normal">
              Discover premium cut pieces and elegant dupattas at prices that fit every budget. Sourced straight from master craftsmen to protect margins for boutique designers.
            </p>
            
            <div className="flex items-center gap-4 pt-2" ref={heroCtasRef}>
              <Link 
                to="/shop?category=Kurti Cut Pieces" 
                className="px-8 py-3.5 bg-[#B71C1C] hover:bg-[#991B1B] text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg rounded-lg flex items-center gap-2 group"
              >
                <span>Shop Cut Pieces</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link 
                to="/shop?category=Traditional Printed Fabrics" 
                className="px-8 py-3.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-lg"
              >
                Explore Dupattas
              </Link>
            </div>

            {/* Micro Trust badges under CTAs */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-900 uppercase block">10,000+ Meters</span>
                <span className="text-[9px] text-slate-500 block font-normal">Premium ready stock</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-900 uppercase block">Direct Sourcing</span>
                <span className="text-[9px] text-slate-500 block font-normal">Wholesale price margin</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-900 uppercase block">Fast Dispatch</span>
                <span className="text-[9px] text-slate-500 block font-normal">Delivery across India</span>
              </div>
            </div>
          </div>

          {/* Right Slideshow Column - Bright image container with glass cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Soft decorative color splash */}
            <div className="absolute w-[300px] h-[300px] bg-[#B71C1C]/5 rounded-full blur-[80px] -z-10"></div>
            
            {/* Elegant Framed rotating image */}
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl bg-slate-50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroIndex}
                  src={HERO_IMAGES[heroIndex]}
                  alt="Anumeet premium fabric rotate showcase"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Floating micro glass banner inside image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div className="space-y-0.5 text-left">
                  <span className="text-[8px] bg-[#B71C1C] text-white px-2 py-0.5 font-bold uppercase tracking-wider rounded">Featured Sourcing</span>
                  <h4 className="text-slate-900 font-extrabold text-xs">Premium Loom Textiles</h4>
                </div>
                <Link to="/shop" className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-[#B71C1C] transition-colors shadow">
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Small floating preview card */}
            <div className="absolute -left-6 bottom-16 bg-white border border-slate-100 p-3 rounded-xl shadow-lg flex items-center gap-3 hidden sm:flex animate-[float_4s_ease-in-out_infinite]">
              <div className="w-10 h-10 rounded-lg bg-[#B71C1C]/10 flex items-center justify-center text-[#B71C1C]">
                <Palette size={18} />
              </div>
              <div className="text-left">
                <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block">Batch Quality</span>
                <span className="text-xs font-bold text-slate-800 block">100% Cotton Lining</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CURATED PROMO GRID ("Buy Premium Cut Pieces & Dupattas Online") */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 font-inter">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ EXPLORE COLLECTIONS ✦</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#121212]">Buy Premium Cut Pieces & Dupattas Online</h2>
          <div className="h-[2.5px] w-12 bg-[#B71C1C] mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Premium Fabrics",
              desc: "Discover premium cut pieces for every occasion.",
              btnText: "Shop Cut Pieces",
              link: "/shop?category=Kurti Cut Pieces",
              img: storeShelves
            },
            {
              title: "Elegant Dupattas",
              desc: "Complete every outfit with beautiful dupattas.",
              btnText: "Shop Dupattas",
              link: "/shop?category=Traditional Printed Fabrics",
              img: sareeBanarasi
            },
            {
              title: "Combos & Offers",
              desc: "Save more with curated combo collections.",
              btnText: "Shop Combos",
              img: storeEmbroidery,
              link: "/shop?category=Unstitched Suit Sets"
            }
          ].map((promo, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(promo.link)}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] md:h-[280px] border border-slate-200 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <img 
                src={promo.img} 
                alt={promo.title} 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-extrabold text-xl tracking-wide">{promo.title}</h3>
                <p className="text-[11px] text-slate-200 leading-relaxed font-normal mt-1 max-w-xs">
                  {promo.desc}
                </p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-white uppercase tracking-widest pt-3 group-hover:translate-x-1 transition-transform">
                  {promo.btnText} <ArrowRight size={10} className="text-[#B71C1C]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. "SHOP FABRICS BY TYPE" (Circular List) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 font-inter">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ SHOP FABRICS BY TYPE ✦</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#121212]">Premium Fabrics</h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto font-normal">Explore fabrics by material type, weight, and texture</p>
          <div className="h-[2.5px] w-12 bg-[#B71C1C] mx-auto mt-2"></div>
        </div>

        {/* Circular list */}
        <div className="flex items-center gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar px-2 select-none justify-start md:justify-center">
          {fabricCategories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(cat.link)}
              className="flex flex-col items-center shrink-0 space-y-2 cursor-pointer group"
            >
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden border border-slate-200 group-hover:border-[#B71C1C]/60 shadow-sm group-hover:shadow-md transition-all duration-300 relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#B71C1C]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Compass size={16} className="text-[#B71C1C]" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xs font-bold text-slate-800 tracking-wide group-hover:text-[#B71C1C] transition-colors">{cat.name}</h4>
                <p className="text-[8px] text-slate-400 font-medium whitespace-nowrap">{cat.tag.split("•")[0].trim()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. "FIND YOUR PERFECT DUPATTA" (Dupattas by Occasion) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 font-inter">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ SHOP DUPATTAS BY OCCASION ✦</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#121212]">Find Your Perfect Dupatta</h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto font-normal">Elevate your look with dupattas designed for every event</p>
          <div className="h-[2.5px] w-12 bg-[#B71C1C] mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dupattasOccasions.map((occasion, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(occasion.link)}
              className="group relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-[#B71C1C]/30 hover:-translate-y-0.5"
            >
              <img 
                src={occasion.image} 
                alt={occasion.name} 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-extrabold text-sm tracking-wide leading-tight">{occasion.name}</h3>
                <p className="text-[8px] text-slate-300 mt-0.5 line-clamp-2 leading-snug">{occasion.desc}</p>
                <div className="flex items-center gap-1 text-[8px] font-bold text-[#B71C1C] uppercase tracking-widest pt-2 group-hover:translate-x-0.5 transition-transform">
                  Explore <ChevronRight size={8} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. "INSPIRED BY EVERY STYLE" (Stitch Your Style bento) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 font-inter">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ STITCH YOUR STYLE ✦</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#121212]">Inspired by Every Style</h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto font-normal">See how designers stitch Anumeet's fabrics into tailored masterpieces</p>
          <div className="h-[2.5px] w-12 bg-[#B71C1C] mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {inspiredStyles.map((style, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm group hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4.2] overflow-hidden bg-slate-50 shrink-0">
                <img 
                  src={style.image} 
                  alt={style.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                />
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-lg shadow-sm border border-slate-700">
                  Anumeet Styled
                </span>
              </div>
              <div className="p-5 space-y-1 text-left">
                <h4 className="font-extrabold text-sm text-slate-900 tracking-wide">{style.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium">{style.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. "WEDDING & FESTIVE FABRICS" (Celebration Edit) */}
      <section className="bg-slate-50 text-slate-800 py-20 px-4 md:px-8 relative overflow-hidden border-t border-b border-slate-100 font-inter">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-200 pb-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ CELEBRATION EDIT ✦</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">Wedding & Festive Fabrics</h2>
            </div>
            
            <Link to="/shop?fabric=Banarasi" className="text-xs font-bold uppercase tracking-wider text-[#B71C1C] hover:text-[#991B1B] flex items-center gap-2 border-b border-[#B71C1C] pb-1 transition-colors">
              Explore Heavy Fabrics <ArrowRight size={12} />
            </Link>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {celebrationFabrics.map((prod) => (
              <Link 
                to={`/product/${prod.id}`}
                key={prod.id} 
                className="bg-white rounded-xl overflow-hidden border border-slate-100 group hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between font-inter"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 shrink-0">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                  />
                  
                  <span className="absolute top-4 left-4 bg-[#B71C1C] text-white text-[8px] font-bold px-2.5 py-0.5 uppercase tracking-widest rounded shadow border border-[#B71C1C]/10">
                    Festive Edit
                  </span>

                  {/* Action overlays */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={(e) => handleAddToCartClick(e, prod)}
                      className="p-3 bg-white text-stone-900 hover:bg-[#B71C1C] hover:text-white rounded-full transition-colors cursor-pointer shadow-md hover:scale-105 duration-200"
                      aria-label="Add to Cart"
                    >
                      <ShoppingBag size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleWishlistClick(e, prod)}
                      className={`p-3 rounded-full transition-colors cursor-pointer shadow-md hover:scale-105 duration-200 ${isInWishlist(prod.id) ? 'bg-[#B71C1C] text-white' : 'bg-white text-stone-900 hover:bg-slate-50'}`}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart size={18} fill={isInWishlist(prod.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{prod.category}</span>
                    <h3 className="font-extrabold text-sm text-slate-800 line-clamp-1 group-hover:text-[#B71C1C] transition-colors">{prod.name}</h3>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-900 font-mono">₹{prod.pricePerMeter}<span className="text-[10px] text-slate-400 font-normal">/{prod.unit === 'piece' ? 'pc' : 'm'}</span></span>
                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-wider">Wholesale: ₹{prod.wholesalePrice}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. "WATCH BEFORE YOU BUY" (Cinematic Reels grid) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 font-inter">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ SEE THE DETAILS ✦</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#121212]">Watch Before You Buy</h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto font-normal">Inspect the texture, flow, and drape density of our flagship loom materials</p>
          <div className="h-[2.5px] w-12 bg-[#B71C1C] mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reelsMockup.map((reel, idx) => (
            <div 
              key={idx}
              onClick={() => setVideoModalOpen(true)}
              className="group relative rounded-xl overflow-hidden aspect-[9/16] border border-slate-150 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white font-inter"
            >
              <img 
                src={reel.image} 
                alt={reel.title} 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-[1000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-left">
                <div className="flex justify-between items-center text-white/80 text-[8px] font-bold uppercase tracking-widest mb-1.5">
                  <span className="bg-[#B71C1C] text-white px-2 py-0.5 rounded">Reel #{idx+1}</span>
                  <span className="flex items-center gap-0.5">👁️ {reel.views}</span>
                </div>
                <h4 className="text-white font-bold text-sm tracking-wide">{reel.title}</h4>
                <p className="text-[10px] text-slate-300 mt-1 line-clamp-2 font-normal leading-relaxed">
                  {reel.desc}
                </p>
                <div className="w-9 h-9 rounded-full bg-[#B71C1C]/90 text-white flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-lg border border-[#B71C1C]/20">
                  <Play size={12} className="fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. "EXPLORE FABRICS IN YOUR FAVORITE COLORS" (Shop by Shade color filter) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 bg-white py-12 rounded-2xl border border-slate-100 shadow-sm font-inter">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ SHOP BY SHADE ✦</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#121212]">Explore fabrics in your favorite colors.</h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto font-normal">Click a color dot below to instantly view matching fabrics</p>
          <div className="h-[2.5px] w-12 bg-[#B71C1C] mx-auto mt-2"></div>
        </div>

        {/* Color circle filters */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 pt-2">
          {SHADES.map((shade, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedColor(shade.name);
                showToast(`Filtered store items matching shade: ${shade.label}`, "info");
              }}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${
                selectedColor === shade.name 
                  ? 'border-[#B71C1C] border bg-[#B71C1C] text-white' 
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-350'
              }`}
            >
              <span 
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-inner" 
                style={{ 
                  background: shade.hex,
                  border: shade.name === "White" ? "1px solid #cbd5e1" : "none"
                }}
              ></span>
              <span>{shade.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Filter Output */}
        <div className="pt-4">
          {getColorFilteredProducts().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getColorFilteredProducts().map((prod) => (
                <Link 
                  to={`/product/${prod.id}`}
                  key={prod.id} 
                  className="bg-white rounded-xl overflow-hidden border border-slate-100 group hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between font-inter"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 shrink-0">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                    />
                    
                    {/* Action overlays */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={(e) => handleAddToCartClick(e, prod)}
                        className="p-3 bg-white text-stone-900 hover:bg-[#B71C1C] hover:text-white rounded-full transition-colors cursor-pointer shadow-md hover:scale-105 duration-200"
                        aria-label="Add to Cart"
                      >
                        <ShoppingBag size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleWishlistClick(e, prod)}
                        className={`p-3 rounded-full transition-colors cursor-pointer shadow-md hover:scale-105 duration-200 ${isInWishlist(prod.id) ? 'bg-[#B71C1C] text-white' : 'bg-white text-stone-900 hover:bg-slate-50'}`}
                        aria-label="Toggle Wishlist"
                      >
                        <Heart size={18} fill={isInWishlist(prod.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-2 flex-grow flex flex-col justify-between bg-white text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{prod.category}</span>
                      <h3 className="font-extrabold text-sm text-slate-800 line-clamp-1 group-hover:text-[#B71C1C] transition-colors">{prod.name}</h3>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <span className="text-sm font-bold text-slate-900 font-mono">₹{prod.pricePerMeter}<span className="text-[10px] text-slate-400 font-normal">/{prod.unit === 'piece' ? 'pc' : 'm'}</span></span>
                      <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-wider">Wholesale: ₹{prod.wholesalePrice}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
              <Info size={32} className="text-[#B71C1C] mx-auto" />
              <h4 className="font-bold text-slate-800">No fabric matches found.</h4>
              <p className="text-xs text-slate-500">We drop weekly batches. Please request custom dyeing on WhatsApp.</p>
            </div>
          )}
        </div>
      </section>

      {/* 10. "WHY CHOOSE CUTPIECEWALA?" (Trust Grid matching exactly) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 font-inter">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ WHY CHOOSE US ✦</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#121212]">Why Choose Anumeet Cutpiece?</h2>
          <div className="h-[2.5px] w-12 bg-[#B71C1C] mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[
            { title: "Premium Quality", desc: "Handpicked fabrics with reliable quality." },
            { title: "Fast Shipping", desc: "Quick delivery across India." },
            { title: "Secure Payments", desc: "Safe & trusted checkout." },
            { title: "WhatsApp Support", desc: "Get help before and after purchase." },
            { title: "Carefully Selected", desc: "Every fabric is checked before dispatch." },
            { title: "Trusted by Customers", desc: "Quality and service you can rely on." }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-6 md:p-8 rounded-xl border border-slate-150 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex items-start gap-4 hover:-translate-y-0.5"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-[#B71C1C]/10 flex items-center justify-center text-[#B71C1C]">
                {index === 0 && <ShieldCheck size={20} />}
                {index === 1 && <Truck size={20} />}
                {index === 2 && <Percent size={20} />}
                {index === 3 && <MessageCircle size={20} />}
                {index === 4 && <Award size={20} />}
                {index === 5 && <Star size={20} className="fill-current" />}
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-extrabold text-[#121212] text-base sm:text-lg">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. "CHOOSE THE RIGHT FABRIC WITH EASY EXPERT GUIDES" (Fabric Buying Guides) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 font-inter">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ FABRIC BUYING GUIDES ✦</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#121212]">Choose the right fabric with easy expert guides.</h2>
          <div className="h-[2.5px] w-12 bg-[#B71C1C] mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {buyingGuides.map((guide, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveGuideKey(guide.key);
                showToast(`Opened Buying Guide: ${guide.title}`, "info");
              }}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-2 text-left">
                <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center border border-slate-200">
                  <FileText size={18} className="text-[#B71C1C]" />
                </div>
                <h4 className="font-extrabold text-sm text-[#121212] tracking-wide leading-tight">{guide.title}</h4>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">{guide.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#B71C1C] uppercase tracking-widest pt-4">
                Open Guide <ChevronRight size={10} />
              </div>
            </div>
          ))}
        </div>

        {/* Buying Guides Details Lightbox Overlay Modal */}
        <AnimatePresence>
          {activeGuideKey && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-950/70 z-55 flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveGuideKey(null)}></div>
              
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 z-10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setActiveGuideKey(null)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 p-2 border border-slate-200 rounded-full hover:border-slate-400 transition-all duration-200 bg-white"
                >
                  <X size={18} />
                </button>

                {/* 1. Modal Content: Sizing Calculator */}
                {activeGuideKey === "need" && (
                  <div className="space-y-6 text-left">
                    <div>
                      <span className="text-[10px] font-bold text-[#B71C1C] uppercase tracking-widest">Sizing Calculator</span>
                      <h3 className="text-2xl font-extrabold text-[#121212]">How Much Fabric Do You Need?</h3>
                      <p className="text-xs text-slate-500">Select outfit type and standard size to calculate meters instantly.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-center">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label htmlFor="modal-outfit" className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Outfit Type</label>
                          <select
                            id="modal-outfit"
                            value={outfitType}
                            onChange={(e) => setOutfitType(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 uppercase tracking-wider focus:border-[#B71C1C] cursor-pointer"
                          >
                            <option value="kurti">Kurti (Short / Straight)</option>
                            <option value="kurta">Kurta (Long / Flared)</option>
                            <option value="salwar-suit">Full Salwar Suit Set</option>
                            <option value="anarkali">Anarkali Dress (Floor Length)</option>
                            <option value="lehenga">Heavy Lehenga panel skirt</option>
                            <option value="blouse">Blouse (Saree matching)</option>
                            <option value="palazzo">Palazzo Pants / Trousers</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Garment Size</label>
                          <div className="grid grid-cols-5 gap-1.5">
                            {['s', 'm', 'l', 'xl', 'xxl'].map((size) => (
                              <button
                                key={size}
                                onClick={() => setOutfitSize(size)}
                                className={`py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                  outfitSize === size 
                                    ? 'border-[#B71C1C] bg-[#B71C1C] text-white shadow-md' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-450'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleCalculatorCelebration}
                          className="w-full py-3 bg-[#B71C1C] hover:bg-[#991B1B] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Calculator size={13} /> Calculate Fabric
                        </button>
                      </div>

                      <div className="bg-[#121212] text-white p-5 rounded-xl border border-slate-850 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest">Length Required</span>
                            <div className="text-2xl font-bold font-mono text-[#B71C1C]">{calculatedMeters} <span className="text-xs font-normal">meters</span></div>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest">Width Recommended</span>
                            <div className="text-sm font-bold font-mono text-slate-200">{calculatedWidth}</div>
                          </div>
                        </div>
                        <div className="border-t border-slate-800 pt-3">
                          <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block">Sourcing Advice</span>
                          <p className="text-[11px] font-light text-slate-350 leading-relaxed mt-1">{calcRecommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Modal Content: GSM Matcher */}
                {activeGuideKey === "gsm" && (
                  <div className="space-y-6 text-left">
                    <div>
                      <span className="text-[10px] font-bold text-[#B71C1C] uppercase tracking-widest">Fabric Specifications</span>
                      <h3 className="text-2xl font-extrabold text-[#121212]">Fabric GSM & Density Guide</h3>
                      <p className="text-xs text-slate-500">Check GSM (Grams per Square Meter), thickness weight, and lining requirements.</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
                      {Object.keys(GSM_DATA).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveGsmTab(tab)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            activeGsmTab === tab 
                              ? 'bg-[#B71C1C] text-white shadow-sm' 
                              : 'bg-white border border-slate-200 text-slate-500'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-bold text-slate-900">{activeGsmTab} Details</h4>
                        <span className="bg-[#B71C1C]/10 text-[#B71C1C] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#B71C1C]/20">
                          {GSM_DATA[activeGsmTab].gsm} ({GSM_DATA[activeGsmTab].weight})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">{GSM_DATA[activeGsmTab].desc}</p>
                      
                      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Lining Suggestion</span>
                          <span className="font-semibold text-slate-800">{GSM_DATA[activeGsmTab].lining}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Best Style Uses</span>
                          <span className="font-semibold text-slate-800">{GSM_DATA[activeGsmTab].uses}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Modal Content: General comparative guide */}
                {activeGuideKey === "choose" && (
                  <div className="space-y-4 text-left">
                    <h3 className="text-2xl font-extrabold text-[#121212]">How to Choose the Right Fabric</h3>
                    <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-light">
                      <p>Selecting fabric depends entirely on the flow, drape, and structural thickness required for your design:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Cotton:</strong> Opaque, breathable, structures well. Best for casual wear, straight kurtis, and shirts.</li>
                        <li><strong>Rayon:</strong> Heavier, cold-touch, highly fluid drape. Perfect for palazzos, maxi skirts, and flowy outfits.</li>
                        <li><strong>Viscose Georgette:</strong> Lightweight, granular, bouncy drape. Great for layered gathers, flares, and sarees.</li>
                        <li><strong>Organza:</strong> Extremely transparent, stiff, and crisp. Ideal for structured puff-sleeves, borders, and dupattas.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 4. Modal Content: Lining matching */}
                {activeGuideKey === "lining" && (
                  <div className="space-y-4 text-left">
                    <h3 className="text-2xl font-extrabold text-[#121212]">How to Match Lining</h3>
                    <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-light">
                      <p>Matching the lining (Astar) is crucial to avoid transparent outlines and skin friction:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Cotton Lining:</strong> Use for cotton and rayon suits. Pre-wash cotton linings to prevent shrinkage mismatch.</li>
                        <li><strong>Crepe Lining:</strong> Use for georgette, chiffon, and sheer drapes. Crepe lining provides a matching fluid drape that prevents bulk.</li>
                        <li><strong>Satin Lining:</strong> Use for net, organza, and heavy silk. Satin lining adds opacity and a luxury light reflection beneath sheer fabric panels.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 5. Modal Content: Fabric care */}
                {activeGuideKey === "care" && (
                  <div className="space-y-4 text-left">
                    <h3 className="text-2xl font-extrabold text-[#121212]">Fabric Care Guide</h3>
                    <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-light">
                      <p>Ensure fabric longevity with simple cleaning guidelines:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Handblock Cotton:</strong> Wash separately in cold water during the first few washes. Minor vegetable dye bleeding is organic.</li>
                        <li><strong>Roman Silks & Chanderi:</strong> Dry clean only. Iron inside out under low heat to protect the golden Zari weaves.</li>
                        <li><strong>Rayon & Crepe:</strong> Machine wash gentle. Line dry inside-out in shade to preserve color density.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 6. Modal Content: Summer vs Winter */}
                {activeGuideKey === "season" && (
                  <div className="space-y-4 text-left">
                    <h3 className="text-2xl font-extrabold text-[#121212]">Summer vs Winter Fabrics</h3>
                    <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-light">
                      <p>Different seasons demand customized material density choices:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Summer Favorites (60 - 120 GSM):</strong> Go for Cotton prints, sheer organzas, and light georgettes. Viscose rayon has a cool hand-feel, ideal for hot tropical days.</li>
                        <li><strong>Winter Staples (180 - 260 GSM):</strong> Go for Super-Soft Micro Velvet 9000 and heavy Champagne Roman Silks. These dense fabrics offer high insulation and rich colors.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 7. Modal Content: Occasion */}
                {activeGuideKey === "occasion" && (
                  <div className="space-y-4 text-left">
                    <h3 className="text-2xl font-extrabold text-[#121212]">Fabric Sourcing by Occasion</h3>
                    <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-light">
                      <p>Dressing according to the dress code is easier when choosing correct fabrics:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Daily / Office wear:</strong> Cotton linings, printed rayon, and plain peachy crepes.</li>
                        <li><strong>Festive Ceremonies:</strong> Silk-cotton mixes, block khadi maslins, and embroidered cottons.</li>
                        <li><strong>Wedding / Parties:</strong> Premium Micro Velvet 9000, Banarasi woven drapes, and sheer crisp organzas.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 8. Modal Content: Fabric width */}
                {activeGuideKey === "width" && (
                  <div className="space-y-4 text-left">
                    <h3 className="text-2xl font-extrabold text-[#121212]">Fabric Width Guide</h3>
                    <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-light">
                      <p>Choosing width helps minimize fabric wastage during cutting patterns:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>36 inches Width:</strong> Common in traditional blouse astar or simple border laces. Requires more meters for kurtis.</li>
                        <li><strong>44 inches Width:</strong> The universal standard width. Most printed cottons, rayon cut pieces, and dress materials use 44\".</li>
                        <li><strong>58 - 60 inches Width:</strong> Wide width. Highly useful for flared lehengas, umbrella-cut Anarkalis, and trousers. Reduces stitching joints.</li>
                      </ul>
                    </div>
                  </div>
                )}

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 12. "VISIT OUR STORE" (Bright & Welcoming physical showroom card) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 font-inter">
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50/30 rounded-2xl p-8 md:p-12 text-slate-800 border border-slate-200/80 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-md">
          <div className="absolute top-0 right-0 h-64 w-64 bg-[#B71C1C]/5 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 bg-[#B71C1C]/10 text-[#B71C1C] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#B71C1C]/15">
              📍 PHYSICAL SHOWROOM DESK
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">Visit Our Flagship Store</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light font-inter">
              Prefer testing the fabric texture, GSM density, and color bleeding yourself? Step into Anumeet Cutpiece by Radhe Krishna Fashion located in the ladies market of Bhopal. Check out our physical catalog stack of over 10,000 meters.
            </p>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-250/80 p-6 sm:p-8 rounded-xl space-y-4 text-slate-600 shadow-sm text-left">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-wide border-b border-slate-100 pb-2">
              Anumeet Cutpiece by Radhe Krishna Fashion
            </h3>
            
            <ul className="space-y-3.5 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#B71C1C] shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-700">Makan No. 13, Subhash Nagar Phase-1, Near Subhash Nagar, Bhopal, MP, 462023</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#B71C1C] shrink-0" />
                <a href="tel:+919131264893" className="hover:text-[#B71C1C] transition-colors font-mono font-bold text-slate-800">+91 9131264893</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#B71C1C] shrink-0" />
                <a href="mailto:info@anumeetkatpiece.com" className="hover:text-[#B71C1C] transition-colors text-slate-700">info@anumeetkatpiece.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="text-[#B71C1C] shrink-0 mt-0.5" />
                <div className="leading-tight">
                  <p className="font-semibold text-slate-850">Mon - Sat: 11:00 AM - 08:30 PM</p>
                  <p className="text-red-650 font-bold text-[9px] uppercase tracking-wider mt-1">Sunday Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials & FAQs */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 font-inter">
        
        {/* Testimonials */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ Client Endorsements ✦</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#121212]">What Designers Say</h2>
            <div className="h-[2.5px] w-12 bg-[#B71C1C] mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Varma", role: "Designer, Varma Couture (Indore)", quote: "The Roman Silk gold fabric from Anumeet is stunning. We created a bridal trousseau line last month, and the texture hold was outstanding. Incredible wholesale pricing!" },
              { name: "Ruchi Lodhi", role: "Owner, Bhopal Fashion House", quote: "Our boutique has been sourcing Bagh Handblock and plain Rayons from Anumeet Cutpiece for 3 years. Quality color fastness and reliable shipping make them our #1 supplier." },
              { name: "Sunita Advani", role: "Bespoke Tailoring Studio (Bhopal)", quote: "Ordering via WhatsApp is so smooth. They send videos of fabric drapes, measure precisely, and deliver to my studio same-day. Extremely professional!" }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-white p-6 md:p-8 rounded-xl border border-slate-150 shadow-sm space-y-4 md:space-y-6 flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300 hover:-translate-y-0.5 font-inter text-left"
              >
                <div className="space-y-3 font-inter">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-[#B71C1C] text-[#B71C1C]" />)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{item.quote}"</p>
                </div>
                <div className="border-t border-slate-100 pt-4 flex flex-col gap-0.5">
                  <h4 className="font-bold text-[10px] text-slate-800 uppercase tracking-wider font-inter">{item.name}</h4>
                  <p className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-8 font-inter">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#B71C1C] uppercase">✦ Sourcing Assistance ✦</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#121212] text-center">Frequently Asked Questions</h2>
            <div className="h-[2.5px] w-12 bg-[#B71C1C] mx-auto mt-2"></div>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is your Minimum Order Quantity (MOQ) for wholesale prices?",
                a: "Our wholesale pricing starts at a minimum of 10 to 30 meters depending on the fabric category (e.g. 10 meters for heavy Silks/Velvets, 20 meters for Rayon). You can easily toggle between Retail and Wholesale pricing models directly on our shop pages."
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
        </div>
      </section>

      {/* 13. WHATSAPP FLOATING BUTTON */}
      <a 
        href="https://wa.me/919131264893?text=Hello%20Anumeet%20Cutpiece%20Bhopal,%20I'm%20looking%20for%20premium%20wholesale%20fabrics."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg flex items-center gap-2 group transition-all duration-300 border border-white/10"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={20} className="fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-500 ease-in-out text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap">
          WhatsApp Sourcing Desk
        </span>
      </a>

      {/* BRAND VIDEO MODAL LIGHTBOX */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/95 z-55 flex items-center justify-center p-4 font-inter"
          >
            <div className="absolute inset-0 cursor-pointer" onClick={() => setVideoModalOpen(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-4xl aspect-[16/9] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 z-10"
            >
              <button 
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-2 border border-white/10 rounded-full transition-all duration-200 bg-black/40 z-20 cursor-pointer"
              >
                <X size={20} />
              </button>
              
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
    <div className="border border-slate-150 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow font-inter">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 sm:p-5 text-left text-slate-800 hover:text-[#B71C1C] transition-colors font-inter"
      >
        <span className="font-extrabold text-[10px] sm:text-xs uppercase tracking-wider leading-tight">{question}</span>
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
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-[11px] sm:text-xs text-slate-500 leading-relaxed border-t border-slate-50 font-normal">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}
