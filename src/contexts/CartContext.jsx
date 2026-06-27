import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [activeCoupon, setActiveCoupon] = useState(null);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ak_cart");
    const savedWishlist = localStorage.getItem("ak_wishlist");
    const savedRecent = localStorage.getItem("ak_recent_viewed");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("ak_cart", JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("ak_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Save recently viewed to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("ak_recent_viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = (product, quantity = 1, wholesaleMode = false) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.wholesaleMode === wholesaleMode
      );
      
      const price = wholesaleMode ? product.wholesalePrice : product.pricePerMeter;
      
      if (existingIndex !== -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      
      return [
        ...prevCart,
        {
          productId: product.id,
          name: product.name,
          price: price,
          retailPrice: product.pricePerMeter,
          wholesalePrice: product.wholesalePrice,
          wholesaleMoq: product.wholesaleMoq,
          quantity: quantity,
          image: product.image,
          wholesaleMode: wholesaleMode,
          unit: product.unit || "meter"
        }
      ];
    });
  };

  const removeFromCart = (productId, wholesaleMode = false) => {
    setCart((prevCart) => prevCart.filter(item => !(item.productId === productId && item.wholesaleMode === wholesaleMode)));
  };

  const updateQuantity = (productId, quantity, wholesaleMode = false) => {
    if (quantity <= 0) {
      removeFromCart(productId, wholesaleMode);
      return;
    }
    setCart((prevCart) => {
      const idx = prevCart.findIndex(item => item.productId === productId && item.wholesaleMode === wholesaleMode);
      if (idx !== -1) {
        const newCart = [...prevCart];
        // Enforce Wholesale MoQ if in wholesaleMode
        if (wholesaleMode && quantity < newCart[idx].wholesaleMoq) {
          newCart[idx].quantity = newCart[idx].wholesaleMoq;
        } else {
          newCart[idx].quantity = quantity;
        }
        return newCart;
      }
      return prevCart;
    });
  };

  const toggleWholesaleMode = (productId, currentMode) => {
    setCart((prevCart) => {
      // Find item
      const itemIdx = prevCart.findIndex(item => item.productId === productId && item.wholesaleMode === currentMode);
      if (itemIdx === -1) return prevCart;

      const newCart = [...prevCart];
      const item = newCart[itemIdx];
      const newMode = !currentMode;
      
      // Check if there is already an item in the new mode
      const targetIdx = prevCart.findIndex(item => item.productId === productId && item.wholesaleMode === newMode);
      
      const newPrice = newMode ? item.wholesalePrice : item.retailPrice;
      const newQty = newMode ? Math.max(item.quantity, item.wholesaleMoq) : item.quantity;
      
      if (targetIdx !== -1) {
        // Merge them
        newCart[targetIdx].quantity += newQty;
        newCart.splice(itemIdx, 1);
      } else {
        // Convert the mode
        item.wholesaleMode = newMode;
        item.price = newPrice;
        item.quantity = newQty;
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some(item => item.id === product.id);
      if (exists) {
        return prevWishlist.filter(item => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const addRecentlyViewed = useCallback((product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter(item => item.id !== product.id);
      return [product, ...filtered].slice(0, 10); // keep up to 10 items
    });
  }, []);

  const applyCoupon = (code) => {
    const coupons = db.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      throw new Error("Coupon code is invalid.");
    }
    
    const subtotal = getCartSubtotal();
    if (subtotal < coupon.minCartValue) {
      throw new Error(`Minimum purchase of ₹${coupon.minCartValue} required for this coupon.`);
    }
    
    setActiveCoupon(coupon);
    return coupon;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartDiscount = () => {
    if (!activeCoupon) return 0;
    const subtotal = getCartSubtotal();
    return (subtotal * activeCoupon.discountPercent) / 100;
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getCartDiscount();
    const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99; // Free shipping above 1500
    return subtotal - discount + shipping;
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    wishlist,
    recentlyViewed,
    activeCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWholesaleMode,
    clearCart,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed,
    applyCoupon,
    removeCoupon,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
