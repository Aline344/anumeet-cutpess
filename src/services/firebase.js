// Firebase SDK Mock Service with LocalStorage persistence.
// This allows the entire application to work out-of-the-box immediately,
// while being designed to easily switch to real Firebase later.

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

const INITIAL_PRODUCTS = [
  {
    id: "rayon-plain-emerald",
    name: "Premium Plain Rayon - Emerald Green",
    sku: "RYN-PLN-EMD-01",
    category: "Kurti Cut Pieces",
    subCategory: "Plain Rayon",
    fabricType: "Rayon",
    width: "44 inches",
    weight: "140 GSM",
    color: "Emerald Green",
    colorHex: "#0F5257",
    description: "Ultra-soft and highly breathable premium plain rayon fabric. Perfect for summer dresses, kurtas, and comfortable daily wear. Features a beautiful fluid drape and a luxurious hand-feel.",
    pricePerMeter: 120,
    wholesalePrice: 85,
    wholesaleMoq: 20, // Min Order Qty in meters
    stock: 250,
    image: storeShelves,
    images: [
      storeShelves,
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600"
    ],
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.8,
    reviewsCount: 24
  },
  {
    id: "rayon-print-floral",
    name: "Vintage Floral Print Rayon",
    sku: "RYN-PRT-FLR-02",
    category: "Kurti Cut Pieces",
    subCategory: "Printed Rayon",
    fabricType: "Rayon",
    width: "44 inches",
    weight: "135 GSM",
    color: "Indigo & Cream",
    colorHex: "#2B3A67",
    description: "Elegant floral patterns printed on our highest grade rayon base. Features vibrant colors, superior color-fastness, and an exceptionally soft finish. Ideal for maxi dresses, blouses, and designer outfits.",
    pricePerMeter: 145,
    wholesalePrice: 95,
    wholesaleMoq: 25,
    stock: 180,
    image: storeRolls,
    images: [
      storeRolls,
      "https://images.unsplash.com/photo-1584184924103-e310d9d85cfc?auto=format&fit=crop&q=80&w=600"
    ],
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.5,
    reviewsCount: 16
  },
  {
    id: "bagh-print-cotton-natural",
    name: "Authentic Bagh Print - Crimson & Black",
    sku: "BGH-PRT-NAT-03",
    category: "Traditional Printed Fabrics",
    subCategory: "Handblock Print",
    fabricType: "Cotton",
    width: "44 inches",
    weight: "120 GSM",
    color: "Crimson & Coal Black",
    colorHex: "#721c24",
    description: "Traditional handblock printed fabric from Bagh, Madhya Pradesh. Handcrafted using natural vegetable dyes and wooden blocks. A timeless heritage piece with unique minor organic print variations.",
    pricePerMeter: 220,
    wholesalePrice: 160,
    wholesaleMoq: 15,
    stock: 90,
    image: storeCottonPrints,
    images: [
      storeCottonPrints
    ],
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewsCount: 42
  },
  {
    id: "roman-silk-gold",
    name: "Luxury Roman Silk - Champagne Gold",
    sku: "ROM-SLK-GLD-04",
    category: "Premium Dress Materials",
    subCategory: "Premium Silk",
    fabricType: "Roman Silk",
    width: "45 inches",
    weight: "180 GSM",
    color: "Champagne Gold",
    colorHex: "#E5C158",
    description: "Exquisite roman silk fabric with a subtle metallic sheen. Ideal for bridal ensembles, festive kurtas, and heavy designer lehengas. Extremely rich texture and structural hold.",
    pricePerMeter: 380,
    wholesalePrice: 280,
    wholesaleMoq: 10,
    stock: 120,
    image: storeDrapes,
    images: [
      storeDrapes,
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600"
    ],
    isBestSeller: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 38
  },
  {
    id: "georgette-pure-scarlet",
    name: "Pure Viscose Georgette - Scarlet Red",
    sku: "GEO-VIS-RED-05",
    category: "Premium Dress Materials",
    subCategory: "Viscose Georgette",
    fabricType: "Georgette",
    width: "44 inches",
    weight: "80 GSM",
    color: "Scarlet Red",
    colorHex: "#D32F2F",
    description: "Highly breathable, semi-transparent pure viscose georgette fabric. Ideal for heavy embroidery, custom dyeing, sarees, Anarkali suits, and breezy evening wear. Features a granular, bouncy feel.",
    pricePerMeter: 195,
    wholesalePrice: 140,
    wholesaleMoq: 20,
    stock: 300,
    image: storeStandingRolls,
    images: [
      storeStandingRolls
    ],
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.6,
    reviewsCount: 15
  },
  {
    id: "chanderi-silk-cotton",
    name: "Chanderi Silk Cotton - Royal Blue",
    sku: "CHN-SLK-BLU-06",
    category: "Premium Dress Materials",
    subCategory: "Silk Cotton Mix",
    fabricType: "Chanderi",
    width: "44 inches",
    weight: "90 GSM",
    color: "Royal Blue",
    colorHex: "#1A237E",
    description: "Woven in Chanderi, Madhya Pradesh. Features the classic sheer texture, lightweight handling, and elegant gold zari borders. Traditional yet contemporary fabric ideal for weddings and formal ceremonies.",
    pricePerMeter: 290,
    wholesalePrice: 210,
    wholesaleMoq: 15,
    stock: 140,
    image: storeStack,
    images: [
      storeStack
    ],
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.7,
    reviewsCount: 29
  },
  {
    id: "velvet-micro-9000",
    name: "Super-Soft Micro Velvet 9000 - Deep Wine",
    sku: "VVT-MIC-WNE-07",
    category: "Premium Dress Materials",
    subCategory: "Premium Velvet",
    fabricType: "Velvet",
    width: "44 inches",
    weight: "260 GSM",
    color: "Deep Wine",
    colorHex: "#4A0E17",
    description: "Premium Micro Velvet 9000 with a super rich pile, intense color depth, and soft fabric dynamics. Best suited for high-end winter wedding lehengas, heavy blouses, sherwanis, and decorative shawls.",
    pricePerMeter: 320,
    wholesalePrice: 240,
    wholesaleMoq: 10,
    stock: 160,
    image: storeVelvets,
    images: [
      storeVelvets
    ],
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 19
  },
  {
    id: "maslin-gold-khadi",
    name: "Luxury Maslin - Khadi Gold Print",
    sku: "MSL-KHD-GLD-08",
    category: "Kurti Cut Pieces",
    subCategory: "Khadi Block Print",
    fabricType: "Maslin",
    width: "44 inches",
    weight: "110 GSM",
    color: "Cream & Mustard",
    colorHex: "#E1AD01",
    description: "Finely woven Maslin fabric featuring exquisite gold khadi block prints. It feels light as air and offers a beautiful, rich traditional style. Ideal for summer kurtis, festive wear, and luxury dupattas.",
    pricePerMeter: 245,
    wholesalePrice: 175,
    wholesaleMoq: 15,
    stock: 200,
    image: storeDiagonalRolls,
    images: [
      storeDiagonalRolls
    ],
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.4,
    reviewsCount: 11
  },
  {
    id: "cotton-embroidery-suit",
    name: "Premium Cotton Suit Material - Heavy Embroidery",
    sku: "ETH-SUT-EMB-09",
    category: "Unstitched Suit Sets",
    subCategory: "Embroidered Suit",
    fabricType: "Cotton",
    width: "44 inches",
    weight: "150 GSM",
    color: "Multi-color Threadwork",
    colorHex: "#d946ef",
    description: "Exquisite hand-designed cotton suit material with heavy threadwork, intricate neck borders, and direct floral motifs on premium cotton base. Includes matching bottoms and soft dupatta fabric.",
    pricePerMeter: 450,
    wholesalePrice: 320,
    wholesaleMoq: 10,
    stock: 120,
    image: storeEmbroidery,
    images: [
      storeEmbroidery
    ],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 15
  },
  {
    id: "printed-cotton-polka",
    name: "Traditional Polka & Floral Printed Cotton",
    sku: "ETH-COT-PLK-10",
    category: "Kurti Cut Pieces",
    subCategory: "Printed Cotton",
    fabricType: "Cotton",
    width: "44 inches",
    weight: "120 GSM",
    color: "Multi-color Prints",
    colorHex: "#38bdf8",
    description: "Highly durable printed cotton cut pieces featuring traditional patterns, small floral shapes, and polka prints. Ideal for designing summery kurtas and shirts.",
    pricePerMeter: 160,
    wholesalePrice: 110,
    wholesaleMoq: 15,
    stock: 150,
    image: storePolkaPrints,
    images: [
      storePolkaPrints
    ],
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.6,
    reviewsCount: 8
  },
  {
    id: "georgette-plain-jorget",
    name: "Premium Plain Georgette (Jorget)",
    sku: "GEO-PLN-JGT-11",
    category: "Premium Dress Materials",
    subCategory: "Plain Georgette",
    fabricType: "Georgette",
    width: "44 inches",
    weight: "80 GSM",
    color: "Cream / Off-White",
    colorHex: "#FDFBF7",
    description: "Fine quality plain georgette (Jorget) fabric. Highly breathable with a beautiful bounce and elegant drape. Ideal for sarees, suits, and layered outfits.",
    pricePerMeter: 50,
    wholesalePrice: 35,
    wholesaleMoq: 20,
    stock: 300,
    image: storeStandingRolls,
    images: [storeStandingRolls],
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.5,
    reviewsCount: 12,
    unit: "meter"
  },
  {
    id: "crepe-plain-craps",
    name: "Soft Craps (Crepe) Fabric",
    sku: "CRP-PLN-CPS-12",
    category: "Premium Dress Materials",
    subCategory: "Plain Crepe",
    fabricType: "Crepe",
    width: "44 inches",
    weight: "120 GSM",
    color: "Peach",
    colorHex: "#FFD3B6",
    description: "Smooth, wrinkle-resistant premium crepe (craps) fabric with a soft matte finish. Very easy to handle and stitch. Perfect for shirts, kurtas, and bottoms.",
    pricePerMeter: 30,
    wholesalePrice: 20,
    wholesaleMoq: 30,
    stock: 400,
    image: storeRolls,
    images: [storeRolls],
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.3,
    reviewsCount: 9,
    unit: "meter"
  },
  {
    id: "vertical-stripe",
    name: "Vertical Textured Stripes Fabric",
    sku: "VRT-STR-TEX-13",
    category: "Premium Dress Materials",
    subCategory: "Textured Fabric",
    fabricType: "Vertical",
    width: "44 inches",
    weight: "150 GSM",
    color: "Beige & Gold",
    colorHex: "#D4B996",
    description: "Unique fabric featuring structural vertical stripes and a soft textured weave. Adds a premium tailored look to designer suits and kurtas.",
    pricePerMeter: 100,
    wholesalePrice: 70,
    wholesaleMoq: 15,
    stock: 220,
    image: storeDiagonalRolls,
    images: [storeDiagonalRolls],
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.7,
    reviewsCount: 18,
    unit: "meter"
  },
  {
    id: "chanderi-cotton-silk-premium",
    name: "Classic Chanderi Fabric",
    sku: "CHN-CSK-PRM-14",
    category: "Premium Dress Materials",
    subCategory: "Chanderi Silk",
    fabricType: "Chanderi",
    width: "44 inches",
    weight: "95 GSM",
    color: "Mustard Yellow",
    colorHex: "#E1AD01",
    description: "Traditional Chanderi weave blending fine silk and cotton threads. Sheer texture, lightweight body, and a luxurious golden sheen. Perfect for festive celebrations.",
    pricePerMeter: 180,
    wholesalePrice: 130,
    wholesaleMoq: 15,
    stock: 180,
    image: storeStack,
    images: [storeStack],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 22,
    unit: "meter"
  },
  {
    id: "net-mesh-fabric",
    name: "Premium Net Mesh Fabric",
    sku: "NET-MSH-FAB-15",
    category: "Premium Dress Materials",
    subCategory: "Net Fabric",
    fabricType: "Net",
    width: "50 inches",
    weight: "50 GSM",
    color: "Mint Green",
    colorHex: "#A2E8DD",
    description: "Fine hexagon net mesh fabric, highly durable and soft to touch. Best suited for creating flared overlays, dupattas, sleeves, and designer lehenga linings.",
    pricePerMeter: 40,
    wholesalePrice: 28,
    wholesaleMoq: 25,
    stock: 500,
    image: storeShelves,
    images: [storeShelves],
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.2,
    reviewsCount: 15,
    unit: "meter"
  },
  {
    id: "roman-silk-plain",
    name: "Plain Luxury Roman Silk",
    sku: "ROM-SLK-PLN-16",
    category: "Premium Dress Materials",
    subCategory: "Premium Silk",
    fabricType: "Roman Silk",
    width: "45 inches",
    weight: "170 GSM",
    color: "Crimson Red",
    colorHex: "#B71C1C",
    description: "Luxurious solid-color Roman Silk fabric. Features a rich, structural hand-feel and a subtle elegant luster. Ideal for tailoring premium kurtas, trousers, and ethnic jackets.",
    pricePerMeter: 70,
    wholesalePrice: 50,
    wholesaleMoq: 20,
    stock: 350,
    image: storeDrapes,
    images: [storeDrapes],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 26,
    unit: "meter"
  },
  {
    id: "organza-plain",
    name: "Plain Organza Fabric",
    sku: "ORG-PLN-FAB-17",
    category: "Premium Dress Materials",
    subCategory: "Organza",
    fabricType: "Organza",
    width: "44 inches",
    weight: "60 GSM",
    color: "Lavender",
    colorHex: "#E1BEE7",
    description: "Crisp, sheer plain organza fabric with a structural drape. Lightweight yet holds its shape perfectly. Ideal for voluminous sleeves, designer dupattas, and premium overlays.",
    pricePerMeter: 50,
    wholesalePrice: 35,
    wholesaleMoq: 20,
    stock: 280,
    image: storeStandingRolls,
    images: [storeStandingRolls],
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.6,
    reviewsCount: 14,
    unit: "meter"
  },
  {
    id: "blouse-astar-fall",
    name: "Premium Blouse Astar & Fall Lining",
    sku: "AST-FAL-COT-18",
    category: "Premium Dress Materials",
    subCategory: "Lining & Accessories",
    fabricType: "Cotton",
    width: "36 inches",
    weight: "100 GSM",
    color: "Assorted Solid Colors",
    colorHex: "#757575",
    description: "Highly durable, pure cotton blouse lining (Astar) and pre-washed saree fall. Extremely soft on the skin, color-fast, and shrinkage-controlled.",
    pricePerMeter: 30,
    wholesalePrice: 20,
    wholesaleMoq: 30,
    stock: 600,
    image: storePolkaPrints,
    images: [storePolkaPrints],
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.8,
    reviewsCount: 35,
    unit: "meter"
  },
  {
    id: "trouser-girls-readymade",
    name: "Readymade Trouser for Girls",
    sku: "RDY-TRS-GRL-19",
    category: "Ready to Wear",
    subCategory: "Trousers",
    fabricType: "Cotton Blend",
    width: "N/A (Standard Fit)",
    weight: "220 GSM",
    color: "Solid Black",
    colorHex: "#212121",
    description: "Comfortable, stretchable, and stylish ready-to-wear trouser for girls. Features elasticated waist, functional side pockets, and durable stitch detailing. Fits standard sizes.",
    pricePerMeter: 200,
    wholesalePrice: 140,
    wholesaleMoq: 10,
    stock: 150,
    image: storeVelvets,
    images: [storeVelvets],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.7,
    reviewsCount: 31,
    unit: "piece"
  },
  {
    id: "readymade-kurti-cotton",
    name: "Readymade Cotton Kurti (Redimate)",
    sku: "RDY-KRT-COT-20",
    category: "Ready to Wear",
    subCategory: "Kurtis",
    fabricType: "Cotton",
    width: "N/A (Standard Fit)",
    weight: "160 GSM",
    color: "Indigo Floral",
    colorHex: "#1A237E",
    description: "Fully stitched, straight-cut comfortable cotton kurti featuring elegant prints. Breathable daily-wear fabric that remains soft wash after wash.",
    pricePerPiece: 200,
    wholesalePrice: 145,
    wholesaleMoq: 10,
    stock: 160,
    image: storeEmbroidery,
    images: [storeEmbroidery],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 40,
    unit: "piece"
  },
  {
    id: "organza-print-piece",
    name: "Printed Organza Dupatta Cut Piece",
    sku: "ORG-PRT-DPT-21",
    category: "Premium Dress Materials",
    subCategory: "Organza",
    fabricType: "Organza",
    width: "44 inches",
    weight: "65 GSM",
    color: "Pastel Pink Floral",
    colorHex: "#F8BBD0",
    description: "Exquisite printed organza dupatta cut piece (2.5m standard length). Delicate floral designs printed on premium sheer organza. Elevates any solid ethnic suit.",
    pricePerMeter: 70,
    wholesalePrice: 55,
    wholesaleMoq: 15,
    stock: 160,
    image: storeDiagonalRolls,
    images: [storeDiagonalRolls],
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.4,
    reviewsCount: 10,
    unit: "piece"
  },
  {
    id: "printed-cotton-floral-80",
    name: "Traditional Printed Cotton Fabric",
    sku: "ETH-COT-PRT-22",
    category: "Traditional Printed Fabrics",
    subCategory: "Printed Cotton",
    fabricType: "Cotton",
    width: "44 inches",
    weight: "120 GSM",
    color: "Red & Ochre Prints",
    colorHex: "#D32F2F",
    description: "High-grade block-printed look cotton fabric. Extremely breathable and durable, perfect for custom stitched summer shirts, kurtis, and home upholstery.",
    pricePerMeter: 80,
    wholesalePrice: 55,
    wholesaleMoq: 20,
    stock: 300,
    image: storeCottonPrints,
    images: [storeCottonPrints],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.6,
    reviewsCount: 17,
    unit: "meter"
  }
];

const INITIAL_COUPONS = [
  { code: "WELCOME10", discountPercent: 10, minCartValue: 500, description: "Get 10% off on your first order above ₹500!" },
  { code: "BHOPALWHOLESALE", discountPercent: 15, minCartValue: 5000, description: "15% off for large wholesale purchases above ₹5,000" },
  { code: "FESTIVE20", discountPercent: 20, minCartValue: 2500, description: "Limited time 20% off for purchases above ₹2,500" }
];

const INITIAL_REVIEWS = [
  {
    productId: "rayon-plain-emerald",
    id: "rev-1",
    user: "Sunita Sharma",
    rating: 5,
    date: "2026-05-12",
    comment: "Absolutely outstanding quality. The color is exactly as pictured, and the drape of this rayon is incredibly luxurious. Will order again in bulk for my boutique in Bhopal."
  },
  {
    productId: "rayon-plain-emerald",
    id: "rev-2",
    user: "Deepika R.",
    rating: 4,
    date: "2026-06-01",
    comment: "Very soft fabric, perfect for high-quality summer kurtis. Highly recommended."
  },
  {
    productId: "bagh-print-cotton-natural",
    id: "rev-3",
    user: "Ananya Dixit",
    rating: 5,
    date: "2026-04-20",
    comment: "This is authentic block print! You can smell the natural dye processing. Beautiful crimson shade. Very happy with the purchase."
  },
  {
    productId: "roman-silk-gold",
    id: "rev-4",
    user: "Rajesh K.",
    rating: 5,
    date: "2026-05-28",
    comment: "Perfect shimmer and weight. Used it for wedding kurtas and got so many compliments. Excellent wholesale price!"
  }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-92817",
    userId: "customer-1",
    userEmail: "sunita@example.com",
    userName: "Sunita Sharma",
    date: "2026-06-10T14:23:00.000Z",
    items: [
      {
        productId: "rayon-plain-emerald",
        name: "Premium Plain Rayon - Emerald Green",
        price: 120,
        quantity: 5, // 5 meters
        image: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=600"
      },
      {
        productId: "roman-silk-gold",
        name: "Luxury Roman Silk - Champagne Gold",
        price: 380,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ce?auto=format&fit=crop&q=80&w=600"
      }
    ],
    totalAmount: 1360,
    status: "Shipped", // Pending, Packed, Shipped, Delivered, Cancelled
    trackingTimeline: [
      { status: "Order Placed", date: "2026-06-10T14:23:00Z", active: true },
      { status: "Packed", date: "2026-06-11T10:15:00Z", active: true },
      { status: "Shipped", date: "2026-06-12T16:40:00Z", active: true },
      { status: "Out for Delivery", date: "", active: false },
      { status: "Delivered", date: "", active: false }
    ],
    address: {
      fullName: "Sunita Sharma",
      mobile: "+91 9827011223",
      street: "24, Arera Colony, Sector E",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462016"
    },
    paymentMethod: "UPI",
    paymentStatus: "Paid"
  }
];

// Database initialization helper
const initStorage = () => {
  if (localStorage.getItem("ak_products_version") !== "7") {
    localStorage.setItem("ak_products", JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem("ak_products_version", "7");
  } else if (!localStorage.getItem("ak_products")) {
    localStorage.setItem("ak_products", JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem("ak_coupons")) {
    localStorage.setItem("ak_coupons", JSON.stringify(INITIAL_COUPONS));
  }
  if (!localStorage.getItem("ak_reviews")) {
    localStorage.setItem("ak_reviews", JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem("ak_orders")) {
    localStorage.setItem("ak_orders", JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem("ak_inquiries")) {
    localStorage.setItem("ak_inquiries", JSON.stringify([]));
  }
  if (!localStorage.getItem("ak_users")) {
    // Admin user: admin@anumeet.com / admin123
    // Regular customer: customer@example.com / customer123
    localStorage.setItem("ak_users", JSON.stringify([
      { id: "admin-1", email: "admin@anumeet.com", password: "admin123", name: "Anumeet Owner", role: "admin" },
      { id: "customer-1", email: "customer@example.com", password: "customer123", name: "Sunita Sharma", role: "customer" }
    ]));
  }
};

initStorage();

export const db = {
  // PRODUCTS
  getProducts: () => {
    return JSON.parse(localStorage.getItem("ak_products"));
  },
  saveProducts: (products) => {
    localStorage.setItem("ak_products", JSON.stringify(products));
  },
  addProduct: (product) => {
    const products = db.getProducts();
    const newProduct = {
      ...product,
      id: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000),
      rating: 5.0,
      reviewsCount: 0,
      images: [product.image]
    };
    products.push(newProduct);
    db.saveProducts(products);
    return newProduct;
  },
  updateProduct: (updatedProduct) => {
    const products = db.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      db.saveProducts(products);
      return true;
    }
    return false;
  },
  deleteProduct: (id) => {
    const products = db.getProducts();
    const filtered = products.filter(p => p.id !== id);
    db.saveProducts(filtered);
    return true;
  },

  // ORDERS
  getOrders: () => {
    return JSON.parse(localStorage.getItem("ak_orders"));
  },
  addOrder: (orderData) => {
    const orders = db.getOrders();
    const newOrder = {
      ...orderData,
      id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString(),
      status: "Pending",
      paymentStatus: orderData.paymentMethod === "COD" ? "Pending" : "Paid",
      trackingTimeline: [
        { status: "Order Placed", date: new Date().toISOString(), active: true },
        { status: "Packed", date: "", active: false },
        { status: "Shipped", date: "", active: false },
        { status: "Out for Delivery", date: "", active: false },
        { status: "Delivered", date: "", active: false }
      ]
    };
    orders.unshift(newOrder);
    localStorage.setItem("ak_orders", JSON.stringify(orders));

    // Deduct stock quantities
    const products = db.getProducts();
    newOrder.items.forEach(item => {
      const pIdx = products.findIndex(p => p.id === item.productId);
      if (pIdx !== -1) {
        products[pIdx].stock = Math.max(0, products[pIdx].stock - item.quantity);
      }
    });
    db.saveProducts(products);

    return newOrder;
  },
  updateOrderStatus: (orderId, status) => {
    const orders = db.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      // Update tracking timeline
      const now = new Date().toISOString();
      const statusIndex = orders[idx].trackingTimeline.findIndex(t => t.status === status);
      
      // Activate this status and all previous statuses
      for (let i = 0; i <= statusIndex; i++) {
        if (!orders[idx].trackingTimeline[i].active) {
          orders[idx].trackingTimeline[i].active = true;
          orders[idx].trackingTimeline[i].date = now;
        }
      }
      // If setting to Delivered, set paymentStatus to Paid for COD
      if (status === "Delivered") {
        orders[idx].paymentStatus = "Paid";
        orders[idx].trackingTimeline.forEach(t => {
          if (t.status === "Out for Delivery" || t.status === "Delivered") {
            t.active = true;
            if (!t.date) t.date = now;
          }
        });
      }
      localStorage.setItem("ak_orders", JSON.stringify(orders));
      return true;
    }
    return false;
  },

  // REVIEWS
  getReviews: (productId) => {
    const reviews = JSON.parse(localStorage.getItem("ak_reviews"));
    return reviews.filter(r => r.productId === productId);
  },
  addReview: (review) => {
    const reviews = JSON.parse(localStorage.getItem("ak_reviews"));
    const newReview = {
      ...review,
      id: "rev-" + Math.floor(Math.random() * 100000),
      date: new Date().toISOString().split('T')[0]
    };
    reviews.push(newReview);
    localStorage.setItem("ak_reviews", JSON.stringify(reviews));

    // Update product average rating
    const products = db.getProducts();
    const pIdx = products.findIndex(p => p.id === review.productId);
    if (pIdx !== -1) {
      const prodReviews = reviews.filter(r => r.productId === review.productId);
      const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      products[pIdx].rating = parseFloat((totalRating / prodReviews.length).toFixed(1));
      products[pIdx].reviewsCount = prodReviews.length;
      db.saveProducts(products);
    }
    return newReview;
  },

  // INQUIRIES (B2B Bulk Orders)
  getInquiries: () => {
    return JSON.parse(localStorage.getItem("ak_inquiries"));
  },
  addInquiry: (inquiry) => {
    const inquiries = db.getInquiries();
    const newInquiry = {
      ...inquiry,
      id: "INQ-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString(),
      status: "Received"
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem("ak_inquiries", JSON.stringify(inquiries));
    return newInquiry;
  },

  // COUPONS
  getCoupons: () => {
    return JSON.parse(localStorage.getItem("ak_coupons"));
  },
  addCoupon: (coupon) => {
    const coupons = db.getCoupons();
    coupons.push(coupon);
    localStorage.setItem("ak_coupons", JSON.stringify(coupons));
    return coupon;
  },
  deleteCoupon: (code) => {
    const coupons = db.getCoupons();
    const filtered = coupons.filter(c => c.code !== code);
    localStorage.setItem("ak_coupons", JSON.stringify(filtered));
    return true;
  }
};

export const auth = {
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem("ak_users"));
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const sessionUser = { id: user.id, email: user.email, name: user.name, role: user.role };
      sessionStorage.setItem("ak_current_user", JSON.stringify(sessionUser));
      return sessionUser;
    }
    throw new Error("Invalid email or password");
  },
  signup: (name, email, password, role = "customer") => {
    const users = JSON.parse(localStorage.getItem("ak_users"));
    if (users.find(u => u.email === email)) {
      throw new Error("User already exists with this email");
    }
    const newUser = {
      id: (role === "seller" ? "seller-" : "customer-") + Math.floor(Math.random() * 10000),
      email,
      password,
      name,
      role
    };
    users.push(newUser);
    localStorage.setItem("ak_users", JSON.stringify(users));

    const sessionUser = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
    sessionStorage.setItem("ak_current_user", JSON.stringify(sessionUser));
    return sessionUser;
  },
  logout: () => {
    sessionStorage.removeItem("ak_current_user");
  },
  getCurrentUser: () => {
    const userStr = sessionStorage.getItem("ak_current_user");
    return userStr ? JSON.parse(userStr) : null;
  }
};
