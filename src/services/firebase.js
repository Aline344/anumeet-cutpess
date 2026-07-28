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
import sareeBanarasi from '../assets/saree_banarasi.png';

// New generated product fabric images matching cutpiecewala.com
import blueFloralCotton from '../assets/blue_floral_cotton.png';
import whiteLining001 from '../assets/white_lining_001.png';
import whiteLining002 from '../assets/white_lining_002.png';
import pinkFloralCotton from '../assets/pink_floral_cotton.png';
import pinkChiffonDupatta from '../assets/pink_chiffon_dupatta.png';
import userSaree3 from '../assets/user_saree_3.png';
import userSaree4 from '../assets/user_saree_4.png';
import userSaree5 from '../assets/user_saree_5.jpg';

const INITIAL_PRODUCTS = [
  {
    id: "blue-floral-cotton-printed-cutpiece",
    name: "blue Floral Cotton Printed CutPiece | 44 Inch Width",
    sku: "CPW-BLU-FLR-01",
    category: "Kurti Cut Pieces",
    subCategory: "Cotton Printed CutPiece",
    fabricType: "Cotton",
    width: "44 inches",
    weight: "120 GSM",
    color: "Royal Blue & Cream",
    colorHex: "#1A237E",
    description: "Premium quality 100% Cotton fabric featuring beautiful royal blue floral prints and indigo motifs printed on a light cream base. Breathable, pre-shrunk, ideal for Kurtis, summer dresses, blouses, and designer suits.",
    pricePerMeter: 80,
    wholesalePrice: 65,
    wholesaleMoq: 20,
    stock: 150,
    image: blueFloralCotton,
    images: [blueFloralCotton],
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.8,
    reviewsCount: 32,
    unit: "meter"
  },
  {
    id: "cpwl001-white-lining",
    name: "CPWL001 white Lining",
    sku: "CPW-LIN-WHT-02",
    category: "Lining",
    subCategory: "Lining",
    fabricType: "Cotton",
    width: "36 inches",
    weight: "90 GSM",
    color: "Ivory White",
    colorHex: "#FFFFFF",
    description: "Super soft and breathable premium quality white cotton lining (astar) fabric. Neatly stacked, plain weave, bright daylight, clean fabric edges, high-quality lining material for custom stitching. Prevents transparent outlines and keeps the outer garment structural and comfortable.",
    pricePerMeter: 40,
    wholesalePrice: 30,
    wholesaleMoq: 30,
    stock: 500,
    image: whiteLining001,
    images: [whiteLining001],
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.7,
    reviewsCount: 48,
    unit: "meter"
  },
  {
    id: "cpwl002-white-lining",
    name: "CPWL002 white Lining",
    sku: "CPW-LIN-WHT-03",
    category: "Lining",
    subCategory: "Lining",
    fabricType: "Cotton",
    width: "36 inches",
    weight: "95 GSM",
    color: "Pure White",
    colorHex: "#F5F5F5",
    description: "Close-up macro photography of a soft, breathable white cotton lining fabric with a very fine plain weave. Exceptional sweat absorption and durability. Perfect for matching under premium Georgette, Rayon, and Chanderi suits.",
    pricePerMeter: 40,
    wholesalePrice: 30,
    wholesaleMoq: 30,
    stock: 400,
    image: whiteLining002,
    images: [whiteLining002],
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.6,
    reviewsCount: 22,
    unit: "meter"
  },
  {
    id: "pink-floral-cotton-printed-cutpiece",
    name: "Pink Floral Cotton Printed CutPiece | 44 Inch Width",
    sku: "CPW-PNK-FLR-04",
    category: "Kurti Cut Pieces",
    subCategory: "Cotton Printed CutPiece",
    fabricType: "Cotton",
    width: "44 inches",
    weight: "120 GSM",
    color: "Rose Pink & White",
    colorHex: "#F8BBD0",
    description: "Premium grade 100% organic cotton printed cutpiece with elegant rose and floral blooms printed on a bright white cotton base. Detailed weave, elegant textile design, boutique catalog, soft to the skin with high color-fastness. Perfect for luxury summer outfits and bespoke styling.",
    pricePerMeter: 1200,
    wholesalePrice: 950,
    wholesaleMoq: 10,
    stock: 80,
    image: pinkFloralCotton,
    images: [pinkFloralCotton],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 65,
    unit: "meter"
  },
  {
    id: "pink-floral-printed-chiffon-dupatta",
    name: "Pink Floral Printed Chiffon Dupatta with Tassels | Lightweight Women's Dupatta",
    sku: "CPW-PNK-CHF-05",
    category: "Traditional Printed Fabrics",
    subCategory: "Chiffon Dupatta",
    fabricType: "Chiffon",
    width: "44 inches",
    weight: "65 GSM",
    color: "Pink Floral",
    colorHex: "#FF80AB",
    description: "Lightweight and airy chiffon dupatta featuring pastel pink floral prints and beautiful thread tassels hanging along the borders. Easy to carry and pairs perfectly with casual and festive wear.",
    pricePerMeter: 100,
    wholesalePrice: 75,
    wholesaleMoq: 15,
    stock: 200,
    image: pinkChiffonDupatta,
    images: [pinkChiffonDupatta],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.5,
    reviewsCount: 18,
    unit: "piece"
  },
  {
    id: "surat-rayon-gold-print-cutpiece",
    name: "Surat Rayon Gold Foil Printed Cutpiece | 44 Inch Width",
    sku: "CPW-RYN-GLD-06",
    category: "Kurti Cut Pieces",
    subCategory: "Rayon Gold Print",
    fabricType: "Rayon",
    width: "44 inches",
    weight: "140 GSM",
    color: "Emerald Green & Gold",
    colorHex: "#004D40",
    description: "Soft and heavy-density Liva Rayon fabric featuring intricate gold foil print motifs in an ethnic design on a rich emerald green base. Drapes beautifully, doesn't shrink, perfect for festive kurtis, palazzo sets, and ethnic skirts.",
    pricePerMeter: 95,
    wholesalePrice: 70,
    wholesaleMoq: 20,
    stock: 300,
    image: storeRolls,
    images: [storeRolls],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 29,
    unit: "meter"
  },
  {
    id: "jaipuri-indigo-dabu-cotton-cutpiece",
    name: "Jaipuri Indigo Dabu Printed Cotton Cutpiece | 44 Inch Width",
    sku: "CPW-COT-IND-07",
    category: "Kurti Cut Pieces",
    subCategory: "Dabu Printed Cotton",
    fabricType: "Cotton",
    width: "44 inches",
    weight: "120 GSM",
    color: "Indigo Blue",
    colorHex: "#0D47A1",
    description: "Authentic Jaipuri Dabu hand-block printed cotton cutpiece fabric. Made using organic indigo dyes and traditional mud-resist hand-printing techniques. Ideal for high-end boutique kurtas, summer shirts, and breathable ethnic dresses.",
    pricePerMeter: 110,
    wholesalePrice: 80,
    wholesaleMoq: 15,
    stock: 180,
    image: storeCottonPrints,
    images: [storeCottonPrints],
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewsCount: 42,
    unit: "meter"
  },
  {
    id: "surat-plain-georgette-cutpiece",
    name: "Surat Plain Georgette Cutpiece Lot | 44 Inch Width",
    sku: "CPW-GEO-PLN-08",
    category: "Traditional Printed Fabrics",
    subCategory: "Plain Georgette",
    fabricType: "Georgette",
    width: "44 inches",
    weight: "60 GSM",
    color: "Bright Yellow",
    colorHex: "#FFD54F",
    description: "Premium fluid poly-georgette fabric in a vibrant daylight yellow hue. Shear texture, lightweight, and wrinkle-resistant. Widely used for lining, designer sarees, double-layered kurtas, and custom-tailored flared maxis.",
    pricePerMeter: 50,
    wholesalePrice: 35,
    wholesaleMoq: 30,
    stock: 600,
    image: storeDrapes,
    images: [storeDrapes],
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.4,
    reviewsCount: 15,
    unit: "meter"
  },
  {
    id: "lucknowi-chikankari-cotton-cutpiece",
    name: "Lucknowi Chikankari Handwork Cotton Cutpiece | 44 Inch Width",
    sku: "CPW-COT-CHK-09",
    category: "Traditional Printed Fabrics",
    subCategory: "Chikankari Cotton",
    fabricType: "Cotton",
    width: "44 inches",
    weight: "130 GSM",
    color: "Peach Pink",
    colorHex: "#FFCC80",
    description: "Exquisite Lucknowi Chikankari hand-embroidered floral motifs on a soft premium white cotton fabric. The beautiful pastel peach embroidery threads create a subtle contrast. Perfect for luxury boutique kurtis, custom shirts, and festive jackets.",
    pricePerMeter: 220,
    wholesalePrice: 160,
    wholesaleMoq: 10,
    stock: 120,
    image: storeEmbroidery,
    images: [storeEmbroidery],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 25,
    unit: "meter"
  },
  {
    id: "banarasi-brocade-silk-cutpiece",
    name: "Banarasi Brocade Katan Silk Cutpiece | 44 Inch Width",
    sku: "CPW-SLK-BAN-10",
    category: "Traditional Printed Fabrics",
    subCategory: "Brocade Silk",
    fabricType: "Silk",
    width: "44 inches",
    weight: "180 GSM",
    color: "Ruby Red",
    colorHex: "#D32F2F",
    description: "Rich Banarasi Katan silk brocade cutpiece featuring heavy gold zari floral jaal weaving. Perfect for making premium bridal blouses, sherwanis, ethnic jackets, festival lehengas, and designer border attachments.",
    pricePerMeter: 250,
    wholesalePrice: 170,
    wholesaleMoq: 10,
    stock: 90,
    image: sareeBanarasi,
    images: [sareeBanarasi],
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.8,
    reviewsCount: 37,
    unit: "meter"
  },
  {
    id: "micro-velvet-9000-cutpiece",
    name: "Surat Micro Velvet 9000 Cutpiece | 44 Inch Width",
    sku: "CPW-VEL-WNE-11",
    category: "Traditional Printed Fabrics",
    subCategory: "Premium Velvet",
    fabricType: "Velvet",
    width: "44 inches",
    weight: "220 GSM",
    color: "Deep Wine",
    colorHex: "#4A0E17",
    description: "Super soft, luxurious micro velvet 9000 lot fabric with a deep wine maroon tone and rich pile. Very shiny and soft drape. Perfect for premium winter kurtas, blouses, lehenga borders, and high-end cushion covers.",
    pricePerMeter: 180,
    wholesalePrice: 125,
    wholesaleMoq: 12,
    stock: 140,
    image: storeVelvets,
    images: [storeVelvets],
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.7,
    reviewsCount: 19,
    unit: "meter"
  },
  {
    id: "premium-french-crepe-printed-cutpiece",
    name: "Premium French Crepe Printed Cutpiece | 44 Inch Width",
    sku: "CPW-CRP-PRN-12",
    category: "Kurti Cut Pieces",
    subCategory: "Crepe Printed",
    fabricType: "Crepe",
    width: "44 inches",
    weight: "110 GSM",
    color: "Navy Blue Floral",
    colorHex: "#1A237E",
    description: "Premium French Crepe fabric featuring gorgeous multi-colored floral prints on a deep navy blue background. Wrinkle-resistant, soft texture, clean drape. Excellent choice for office-wear kurtis, flowy dresses, and designer kaftans.",
    pricePerMeter: 85,
    wholesalePrice: 60,
    wholesaleMoq: 25,
    stock: 220,
    image: storeDiagonalRolls,
    images: [storeDiagonalRolls],
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.5,
    reviewsCount: 11,
    unit: "meter"
  },
  {
    id: "digital-print-organza-cutpiece",
    name: "Digital Print Premium Organza Cutpiece | 44 Inch Width",
    sku: "CPW-ORG-DIG-13",
    category: "Traditional Printed Fabrics",
    subCategory: "Printed Organza",
    fabricType: "Organza",
    width: "44 inches",
    weight: "70 GSM",
    color: "Lavender Blush",
    colorHex: "#E1BEE7",
    description: "Ultra-sheer, crisp organza fabric featuring vibrant pastel digital floral designs. High-end look with a lightweight and semi-stiff texture that holds shape beautifully. Perfect for designer dupattas, puffy sleeves, gowns, and overlay dresses.",
    pricePerMeter: 130,
    wholesalePrice: 90,
    wholesaleMoq: 15,
    stock: 160,
    image: storeDrapes,
    images: [storeDrapes],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.6,
    reviewsCount: 20,
    unit: "meter"
  },
  {
    id: "bhagalpuri-linen-cotton-cutpiece",
    name: "Bhagalpuri Linen Cotton Solid Cutpiece | 44 Inch Width",
    sku: "CPW-LIN-COT-14",
    category: "Kurti Cut Pieces",
    subCategory: "Linen Cotton",
    fabricType: "Linen",
    width: "44 inches",
    weight: "150 GSM",
    color: "Natural Beige",
    colorHex: "#D7CCC8",
    description: "Premium blend of Bhagalpuri linen and organic cotton in its beautiful natural beige slub texture. Highly breathable, eco-friendly, pre-washed fabric. Perfect for smart-casual unisex kurtas, trousers, shirts, and home linens.",
    pricePerMeter: 120,
    wholesalePrice: 90,
    wholesaleMoq: 15,
    stock: 110,
    image: storeStandingRolls,
    images: [storeStandingRolls],
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.5,
    reviewsCount: 14,
    unit: "meter"
  },
  {
    id: "polka-print-cotton-cambric-cutpiece",
    name: "Polka Print Cotton Cambric Cutpiece | 44 Inch Width",
    sku: "CPW-COT-PLK-15",
    category: "Kurti Cut Pieces",
    subCategory: "Cotton Cambric",
    fabricType: "Cotton",
    width: "44 inches",
    weight: "110 GSM",
    color: "Black & White",
    colorHex: "#212121",
    description: "Classic retro polka dot print on premium 60-60 quality Cotton Cambric fabric. Soft finish, zero transparency, very comfortable to wear. Ideal for summer tops, kidswear, designer kurtis, and creative patchwork.",
    pricePerMeter: 80,
    wholesalePrice: 60,
    wholesaleMoq: 20,
    stock: 250,
    image: storePolkaPrints,
    images: [storePolkaPrints],
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.6,
    reviewsCount: 8,
    unit: "meter"
  },
  {
    id: "surat-cotton-satin-lining-fabric",
    name: "Surat Cotton Satin Lining Fabric | 38 Inch Width",
    sku: "CPW-LIN-SAT-16",
    category: "Lining",
    subCategory: "Cotton Satin Lining",
    fabricType: "Cotton",
    width: "38 inches",
    weight: "100 GSM",
    color: "Creamy Ivory",
    colorHex: "#FFFDE7",
    description: "Premium cotton-satin blend lining fabric with a subtle silky sheen. Super soft against the skin, high sweat absorption. Extends the life and structure of heavy embroidery georgette and silk suits.",
    pricePerMeter: 55,
    wholesalePrice: 40,
    wholesaleMoq: 30,
    stock: 350,
    image: storeStack,
    images: [storeStack],
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.7,
    reviewsCount: 16,
    unit: "meter"
  },
  {
    id: "unstitched-chanderi-silk-suit-set",
    name: "Unstitched Chanderi Silk Suit Set with Organza Dupatta",
    sku: "CPW-SET-CHA-17",
    category: "Unstitched Suit Sets",
    subCategory: "Chanderi Silk Suit",
    fabricType: "Silk",
    width: "N/A",
    weight: "N/A",
    color: "Mint Green",
    colorHex: "#A5D6A7",
    description: "Elegant 3-piece unstitched salwar suit set. Includes a luxury mint green Chanderi Silk kurta fabric (2.5m) with gold zari buti weaving, a premium cotton-satin bottom fabric (2.5m), and a digital-printed sheer Organza dupatta (2.25m).",
    pricePerMeter: 1450,
    wholesalePrice: 1100,
    wholesaleMoq: 5,
    stock: 45,
    image: userSaree3,
    images: [userSaree3],
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 12,
    unit: "piece"
  },
  {
    id: "unstitched-pure-cotton-salwar-suit-set",
    name: "Unstitched Jaipuri Pure Cotton Salwar Suit Set",
    sku: "CPW-SET-COT-18",
    category: "Unstitched Suit Sets",
    subCategory: "Cotton Salwar Suit",
    fabricType: "Cotton",
    width: "N/A",
    weight: "N/A",
    color: "Mustard Yellow",
    colorHex: "#FBC02D",
    description: "Traditional Jaipuri 3-piece cotton suit set. Features a mustard yellow block-printed pure cotton kurta (2.5m), a contrasting white zig-zag print cotton bottom fabric (2.5m), and a matching pure cotton Mulmul dupatta (2.25m). Highly breathable and soft.",
    pricePerMeter: 750,
    wholesalePrice: 520,
    wholesaleMoq: 10,
    stock: 85,
    image: userSaree4,
    images: [userSaree4],
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.8,
    reviewsCount: 30,
    unit: "piece"
  },
  {
    id: "unstitched-georgette-embroidered-suit-set",
    name: "Unstitched Faux Georgette Heavy Embroidered Suit Set",
    sku: "CPW-SET-GEO-19",
    category: "Unstitched Suit Sets",
    subCategory: "Georgette Suit",
    fabricType: "Georgette",
    width: "N/A",
    weight: "N/A",
    color: "Deep Royal Blue",
    colorHex: "#0D47A1",
    description: "Premium heavy-festive 3-piece suit set. Features a deep royal blue faux georgette kurta (2.5m) embellished with gorgeous zari and sequence embroidery work. Comes with a santoon bottom/lining fabric (4m) and a matching embroidered georgette dupatta.",
    pricePerMeter: 1650,
    wholesalePrice: 1250,
    wholesaleMoq: 5,
    stock: 35,
    image: userSaree5,
    images: [userSaree5],
    isBestSeller: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 8,
    unit: "piece"
  }
];

const INITIAL_COUPONS = [
  { code: "WELCOME10", discountPercent: 10, minCartValue: 500, description: "Get 10% off on your first order above ₹500!" },
  { code: "BHOPALWHOLESALE", discountPercent: 15, minCartValue: 5000, description: "15% off for large wholesale purchases above ₹5,000" },
  { code: "FESTIVE20", discountPercent: 20, minCartValue: 2500, description: "Limited time 20% off for purchases above ₹2,500" }
];

const INITIAL_REVIEWS = [
  {
    productId: "pink-floral-cotton-printed-cutpiece",
    id: "rev-1",
    user: "Sunita Sharma",
    rating: 5,
    date: "2026-05-12",
    comment: "Absolutely outstanding quality. The color is exactly as pictured, and the print of this cotton is incredibly beautiful."
  },
  {
    productId: "pink-floral-cotton-printed-cutpiece",
    id: "rev-2",
    user: "Deepika R.",
    rating: 4,
    date: "2026-06-01",
    comment: "Very soft fabric, perfect for high-quality summer kurtis. Highly recommended."
  },
  {
    productId: "blue-floral-cotton-printed-cutpiece",
    id: "rev-3",
    user: "Ananya Dixit",
    rating: 5,
    date: "2026-04-20",
    comment: "This is authentic print! Beautiful blue shade. Very happy with the purchase."
  },
  {
    productId: "pink-floral-printed-chiffon-dupatta",
    id: "rev-4",
    user: "Rajesh K.",
    rating: 5,
    date: "2026-05-28",
    comment: "Perfect lightness and beautiful tassels. My customer loved the dupatta combination!"
  }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-92817",
    userId: "customer-1",
    userEmail: "customer@example.com",
    userName: "Sunita Sharma",
    date: "2026-06-10T14:23:00.000Z",
    items: [
      {
        productId: "blue-floral-cotton-printed-cutpiece",
        name: "blue Floral Cotton Printed CutPiece | 44 Inch Width",
        price: 80,
        quantity: 5,
        image: blueFloralCotton
      },
      {
        productId: "pink-floral-cotton-printed-cutpiece",
        name: "Pink Floral Cotton Printed CutPiece | 44 Inch Width",
        price: 1200,
        quantity: 2,
        image: pinkFloralCotton
      }
    ],
    totalAmount: 2800,
    status: "Shipped",
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
  if (localStorage.getItem("ak_products_version") !== "10") {
    localStorage.setItem("ak_products", JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem("ak_products_version", "10");
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
