'use client';

import './globals.css';
import './layout.css'; 
import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Search, ShoppingBag, User, Heart, Compass, LayoutDashboard, Receipt, HelpCircle, Shield, Truck, Layers, ChevronDown, X, Sparkles } from 'lucide-react'; // 🚀 Added X and Sparkles icons
import toast, { Toaster } from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const MEDIA_BASE = 'http://127.0.0.1:8000'; 

export default function RootLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authView, setAuthView] = useState('login'); 
  const [activeTab, setActiveTab] = useState('home'); 
  const [genderFilter, setGenderFilter] = useState('ALL'); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false); // 🚀 NEW: Welcome Modal Visibility State
  const [currentUser, setCurrentUser] = useState('Bloom Guest'); // 🚀 NEW: Tracks user name context for modal text

  // Store Application Reactive Arrays
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: 0 });
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // User Authentication Forms
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileForm, setProfileForm] = useState({
    email: '', first_name: '', last_name: '', phone_number: '', district: '', place: '', pincode: ''
  });

  const getAuthHeaders = useCallback(() => {
    const token = Cookies.get('access_token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, []);

  const handleSignOutSystemAction = useCallback(() => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setIsAuthenticated(false);
    localStorage.clear();
    window.location.reload();
  }, []);

  const fetchProductsCatalog = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/products/`);
      const verifiedArray = Array.isArray(data) ? data : (data.results || []);
      setProducts(verifiedArray);
    } catch (err) {
      console.error("Communication failure accessing product rows:", err);
    }
  }, []);

  const fetchMainCategories = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/categories/`);
      const verifiedArray = Array.isArray(data) ? data : (data.results || []);
      setCategories(verifiedArray);
    } catch (err) {
      console.error("Could not load category metadata arrays:", err);
    }
  }, []);

  const fetchUserProfileMatrix = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/profile/`, getAuthHeaders());
      setProfileForm({
        email: data.email || '', first_name: data.first_name || '', last_name: data.last_name || '',
        phone_number: data.profile?.phone_number || '', district: data.profile?.district || '',
        place: data.profile?.place || '', pincode: data.profile?.pincode || ''
      });
      
      // 🚀 Dynamically assign welcome banner name parameters
      if (data.first_name) {
        setCurrentUser(data.first_name);
      }
    } catch (err) {
      console.error("Could not trace client profile row parameters:", err);
    }
  }, [getAuthHeaders]);

  const fetchOrdersHistoryLedger = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/orders/history/`, getAuthHeaders());
      setOrders(data.results || data);
    } catch (err) {
      console.error("Could not sync transaction rows list:", err);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      setIsAuthenticated(true);
      const savedUser = localStorage.getItem('username') || 'Bloom Guest';
      setCurrentUser(savedUser);
      setIsAdmin(savedUser.toLowerCase().includes('admin'));
      
      fetchProductsCatalog();
      fetchMainCategories(); 
      fetchUserProfileMatrix();
      fetchOrdersHistoryLedger();

      // 🚀 Handle One-Time Welcome Modal Dispatch
      const triggerPopup = localStorage.getItem('trigger_welcome_popup');
      if (triggerPopup === 'true') {
        setShowWelcomePopup(true);
        localStorage.removeItem('trigger_welcome_popup'); // Instantly consumption-cleared so it never pops on casual navigation updates
      }
    }
  }, [fetchProductsCatalog, fetchMainCategories, fetchUserProfileMatrix, fetchOrdersHistoryLedger]);

  const handleSystemAuthentication = async (e) => {
    e.preventDefault();
    try {
      if (authView === 'login') {
        const { data } = await axios.post(`${API_BASE}/login/`, { username, password });
        Cookies.set('access_token', data.access, { expires: 1 });
        Cookies.set('refresh_token', data.refresh, { expires: 7 });
        localStorage.setItem('username', username);
        localStorage.setItem('trigger_welcome_popup', 'true'); // 🚀 Flag set here to unlock popup on lifecycle reload
        
        setIsAuthenticated(true);
        setIsAdmin(username.toLowerCase().includes('admin'));
        toast.success(`Signed in successfully!`);
        window.location.reload();
      } else {
        const registrationPayload = {
          username: username.trim(),
          email: profileForm.email.trim(),
          password: password,
          profile: {
            phone_number: profileForm.phone_number.trim(),
            district: profileForm.district.trim(),
            place: profileForm.place.trim(),
            pincode: profileForm.pincode.trim()
          }
        };
        await axios.post(`${API_BASE}/register/`, registrationPayload);
        toast.success(`Account created successfully! Please sign in.`);
        setAuthView('login');
      }
    } catch (err) {
      console.error("Auth flow error:", err);
      toast.error('Authentication failed. Please check your verification metrics.');
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock_quantity <= 0) {
      toast.error("This product line is completely out of inventory stock.");
      return;
    }
    const existing = [...cart.items];
    const index = existing.findIndex(item => item.product.id === product.id);
    if (index > -1) { existing[index].quantity += 1; } 
    else { existing.push({ id: `local_${Date.now()}`, product, quantity: 1 }); }

    const total_items = existing.reduce((sum, item) => sum + item.quantity, 0);
    const total_price = existing.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    setCart({ items: existing, total_items, total_price });
    toast.success("Added to shopping bag container context!");
  };

  const handleToggleLikeProduct = (product) => {
    const isLiked = wishlist.some(item => item.id === product.id);
    if (isLiked) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      toast.success("Removed from your liked list.");
    } else {
      setWishlist([...wishlist, product]);
      toast.success("Added to your liked list! 💖");
    }
  };

  const executeOrderDispatchManifest = async () => {
    if (cart.items.length === 0) return;
    const targetAddress = `${profileForm.place}, ${profileForm.district}, PIN: ${profileForm.pincode}`;
    const orderPayload = {
      shipping_address: targetAddress, payment_method_selected: 'COD',
      subtotal_amount: cart.total_price, total_amount: cart.total_price,
      items: cart.items.map(item => ({ product: item.product.id, quantity: item.quantity }))
    };
    try {
      await axios.post(`${API_BASE}/orders/`, orderPayload, getAuthHeaders());
      toast.success("Order manifested successfully!");
      setCart({ items: [], total_items: 0, total_price: 0 });
      fetchProductsCatalog();
      fetchOrdersHistoryLedger();
      setActiveTab('history');
    } catch (err) {
      toast.error("Could not clear out active transaction row.");
    }
  };

  const getProductImageUrl = (imageProp) => {
    if (!imageProp) return null;
    if (imageProp.startsWith('http://') || imageProp.startsWith('https://')) return imageProp;
    return `${MEDIA_BASE}${imageProp}`;
  };

  const handleSelectHomeCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setGenderFilter('ALL');
    setActiveTab('shop');
  };

  // 🚀 FIXED: Robust Scoped Category Filter Grid
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory) {
      // 1. Trace down the active parent category definition object
      const mainCategoryObj = categories.find(
        cat => cat.name.toLowerCase() === selectedCategory.toLowerCase()
      );

      // 2. Safely capture allowed strings (Instantiated cleanly in the immediate if-block scope)
      let allowedSubcategories = [];
      if (mainCategoryObj && mainCategoryObj.subcategories) {
        allowedSubcategories = mainCategoryObj.subcategories.map(sub => sub.name.toLowerCase());
      } else if (mainCategoryObj && Array.isArray(mainCategoryObj.sub_categories)) {
        // Fallback catch variable check in case your serializer uses snake_case parameters
        allowedSubcategories = mainCategoryObj.sub_categories.map(sub => sub.name.toLowerCase());
      }

      // 3. String extraction metrics for current model instances
      const productSubcategoryName = (
        p.subcategory_name || 
        (p.subcategory && (typeof p.subcategory === 'object' ? p.subcategory.name : p.subcategory)) || 
        ""
      ).toLowerCase().trim();

      const productCategoryName = (
        p.category_name || 
        (p.category && (typeof p.category === 'object' ? p.category.name : p.category)) || 
        ""
      ).toLowerCase().trim();

      // 4. Evaluate intersection conditions safely
      matchesCategory = 
        productCategoryName === selectedCategory.toLowerCase() || 
        allowedSubcategories.includes(productSubcategoryName);
    }

    let matchesGender = true;
    if (genderFilter !== 'ALL') {
      const productGender = (p.gender_tag || 'unisex').toLowerCase().trim();
      const currentTarget = genderFilter.toLowerCase(); 

      if (currentTarget === 'girl') {
        matchesGender = productGender === 'girl' || productGender === 'baby_girl' || productGender === 'all' || productGender === 'unisex';
      } else if (currentTarget === 'boy') {
        matchesGender = productGender === 'boy' || productGender === 'baby_boy' || productGender === 'all' || productGender === 'unisex';
      }
    }

    return matchesSearch && matchesCategory && matchesGender;
  });

  return (
    <html lang="en" className="store-root">
      <body>
        <Toaster position="top-right" />
        
        {/* 🚀 NEW: BACKEND-CONNECTED WELCOME MODAL OVERLAY */}
        {showWelcomePopup && (
          <div className="modal-backdrop-blur">
            <div className="welcome-popup-box">
              <button onClick={() => setShowWelcomePopup(false)} className="modal-close-icon-btn">
                <X className="w-5 h-5" />
              </button>
              
              <div className="welcome-graphic-accent">
                <Sparkles className="w-8 h-8 text-[#A37B73] animate-pulse" />
              </div>

              <h2>Welcome Back, <br /><span>{currentUser}!</span></h2>
              <p>Cute, safe, and comfy products for your little one. 🧸</p>
              
              <button onClick={() => setShowWelcomePopup(false)} className="welcome-modal-ack-btn">
                EXPLORE
              </button>
            </div>
          </div>
        )}

        {!isAuthenticated ? (
          <div className="auth-container">
            <div className="auth-banner">
              <div className="brand-title">Baby Bloom.</div>
              <div className="auth-text-block">
                <h1>Everything<br /><span> Your Little One Needs</span></h1>
                <p>Sign in to track deliveries and explore our curated selection of baby essentials.</p>
              </div>
              <div className="auth-image-box">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/052/112/653/small/beautiful-newborn-baby-smiling-on-white-cottony-background-photo.jpg" alt="" />
              </div>
            </div>
            <div className="auth-form-box">
              <form onSubmit={handleSystemAuthentication}>
                <h2>{authView === 'login' ? 'Sign In' : 'Create Account'}</h2>
                
                <input required placeholder="Username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="input-field" />
                <input required placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" />
                
                {authView === 'register' && (
                  <div className="auth-register-fields">
                    <input required placeholder="Email Address" type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="input-field" />
                    <input required placeholder="Phone Number" type="text" value={profileForm.phone_number} onChange={e => setProfileForm({...profileForm, phone_number: e.target.value})} className="input-field" />
                    <input required placeholder="City / Place" type="text" value={profileForm.place} onChange={e => setProfileForm({...profileForm, place: e.target.value})} className="input-field" />
                    <div className="edit-grid">
                      <input required placeholder="District" type="text" value={profileForm.district} onChange={e => setProfileForm({...profileForm, district: e.target.value})} className="input-field" />
                      <input required placeholder="Pincode" type="text" value={profileForm.pincode} onChange={e => setProfileForm({...profileForm, pincode: e.target.value})} className="input-field" />
                    </div>
                  </div>
                )}
                
                <button type="submit" className="submit-btn">
                  {authView === 'login' ? 'Continue Session Login' : 'Register Account'}
                </button>

                <button type="button" onClick={() => setAuthView(authView === 'login' ? 'register' : 'login')} className="auth-toggle-link">
                  {authView === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="app-layout">
            <header className="navbar">
              <button onClick={() => { setActiveTab('home'); setGenderFilter('ALL'); setSelectedCategory(''); }} className="logo">
              BabyBloom<span>.</span>
              </button>

              <div className="search-box">
                <Search className="search-icon" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search store items..." />
              </div>

              <nav className="nav-links">
                <button onClick={() => { setActiveTab('home'); setSelectedCategory(''); }} className={activeTab === 'home' ? 'active' : ''}> Home</button>
                <button onClick={() => { setActiveTab('shop'); setGenderFilter('ALL'); setSelectedCategory(''); }} className={activeTab === 'shop' && genderFilter === 'ALL' && !selectedCategory ? 'active' : ''}>Catalog</button>
                <button onClick={() => { setActiveTab('shop'); setGenderFilter('GIRL'); }} className={genderFilter === 'GIRL' ? 'girl-active' : ''}>👧 Girls</button>
                <button onClick={() => { setActiveTab('shop'); setGenderFilter('BOY'); }} className={genderFilter === 'BOY' ? 'boy-active' : ''}>👦 Boys</button>
                <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}><User className="icon" /></button>
              </nav>
            </header>

            <main className="main-content">
              
              {/* HOME DISCOVERY TAB */}
              {activeTab === 'home' && (
                <div className="home-tab space-y-12">
                  <div className="hero-section">
                    <div className="hero-text">
                      <h1>Everything <br /><span> Your Little One Needs</span></h1>
                      <p>BabyBloom is a baby shopping website where you can find clothes, toys, feeding essentials, and baby care products all in one place.We offer safe, comfortable, and quality products for babies to make shopping easy for every parent.Find baby essentials, cute outfits, toys, and care products at BabyBloom. Simple shopping for happy families.</p>
                      <button onClick={() => setActiveTab('shop')} className="shop-now-btn">Enter to Catalog</button>
                    </div>
                    <div className="hero-image">
                      <img src="https://static.vecteezy.com/system/resources/thumbnails/052/112/653/small/beautiful-newborn-baby-smiling-on-white-cottony-background-photo.jpg" alt="" />
                    </div>
                  </div>

                  <div className="home-categories-section">
                    <h3 className="section-title">
                      <Layers className="inline-block w-5 h-5 mr-2 text-[#A37B73]" />
                      Shop By Category
                    </h3>
                    <div className="home-category-grid">
                      {categories.map((category) => (
                        <div 
                          key={category.id} 
                          onClick={() => handleSelectHomeCategory(category.name)}
                          className="home-category-card"
                        >
                          <div className="category-icon-bubble">
                            {category.icon ? category.icon : '👶'}
                          </div>
                          <h4>{category.name}</h4>
                          <span className="explore-tag">Explore Collection →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MARKETPLACE CATALOG DISPLAY GRID */}
              {activeTab === 'shop' && (
                <div className="space-y-8">
                  <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                      <h2 className="font-display text-3xl font-bold uppercase tracking-tight">
                        {genderFilter === 'ALL' ? "Our Products" : `${genderFilter === 'GIRL' ? 'Girls' : 'Boys'} Collection`}
                        {selectedCategory && <span className="text-[#A37B73] font-sans text-sm tracking-wide lowercase italic ml-2"> (Category: {selectedCategory})</span>}
                      </h2>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="relative-dropdown-wrapper">
                        <button 
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                          className={`dropdown-trigger-btn ${selectedCategory ? 'dropdown-active' : ''}`}
                        >
                          <Layers className="w-3.5 h-3.5 text-[#A37B73]" />
                          <span>{selectedCategory ? `Category: ${selectedCategory}` : 'Filter By Category'}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isDropdownOpen && (
                          <div className="dropdown-overlay-menu">
                            <button 
                              onClick={() => { setSelectedCategory(''); setIsDropdownOpen(false); }}
                              className={`dropdown-item-btn ${!selectedCategory ? 'item-selected' : ''}`}
                            >
                              All Categories
                            </button>
                            {categories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => { setSelectedCategory(cat.name); setIsDropdownOpen(false); }}
                                className={`dropdown-item-btn ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'item-selected' : ''}`}
                              >
                                {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {selectedCategory && (
                        <button onClick={() => setSelectedCategory('')} className="px-3 py-2 border border-red-200 text-red-600 bg-red-50 text-xs font-bold uppercase tracking-wider">
                          Clear Filter ✕
                        </button>
                      )}
                      
                      <div className="flex border border-neutral-200 bg-white p-0.5 rounded-sm">
                        <button onClick={() => setGenderFilter('ALL')} className={`px-3 py-1.5 text-xs font-medium ${genderFilter === 'ALL' ? 'bg-black text-white' : 'bg-white text-neutral-600'}`}>All</button>
                        <button onClick={() => setGenderFilter('GIRL')} className={`px-3 py-1.5 text-xs font-medium ${genderFilter === 'GIRL' ? 'bg-pink-600 text-white' : 'bg-white text-neutral-600'}`}>Girls Only</button>
                        <button onClick={() => setGenderFilter('BOY')} className={`px-3 py-1.5 text-xs font-medium ${genderFilter === 'BOY' ? 'bg-blue-600 text-white' : 'bg-white text-neutral-600'}`}>Boys Only</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {filteredProducts.map(product => {
                        const original = Number(product.original_price || 0);
                        const offer = Number(product.price || 0);
                        const discountPercent = original > offer && original > 0 ? Math.round(((original - offer) / original) * 100) : 0;
                        const isItemLiked = wishlist.some(w => w.id === product.id);

                        return (
                          <div key={product.id} className="product-card">
                            {discountPercent > 0 && (
                              <span className="discount-tag">
                                {discountPercent}% OFF
                              </span>
                            )}
                            
                            <div>
                              <div className="image-wrapper">
                                {product.image_url ? (
                                  <img src={product.image_url} alt={product.name} />
                                ) : product.image ? (
                                  <img src={getProductImageUrl(product.image)} alt="" />
                                ) : (
                                  <div className="text-4xl">🍼</div>
                                )}

                                <button 
                                  onClick={() => handleToggleLikeProduct(product)} 
                                  className={`product-like-overlay-btn ${isItemLiked ? 'liked-active' : ''}`}
                                  title={isItemLiked ? "Remove Like" : "Like Product"}
                                >
                                  <Heart className="like-icon-svg" />
                                </button>
                              </div>

                              <span className="gender-tag">
                                Collection: {product.gender_tag ? product.gender_tag.replace('_', ' ').toUpperCase() : 'UNISEX'}
                              </span>
                              <h4 className="product-title">{product.name}</h4>
                              <p className="product-desc">{product.description}</p>
                              <div className="mt-4 p-2 bg-neutral-50 border text-[11px] flex justify-between">
                                <span>Stock Available:</span>
                                <span className={product.stock_quantity > 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{product.stock_quantity} pieces left</span>
                              </div>
                            </div>
                            <div className="card-footer">
                              <div className="price-box">
                                <span className="current-price">₹{offer}</span>
                                {original > offer && (
                                  <span className="old-price">M.R.P: ₹{original}</span>
                                )}
                              </div>
                              <button onClick={() => handleAddToCart(product)} disabled={product.stock_quantity <= 0} className="buy-btn">Add to Cart</button>
                            </div>
                          </div>
                        );
                      })}
                      {filteredProducts.length === 0 && (
                        <p className="col-span-full text-center text-xs text-neutral-400 font-mono py-12 card bg-white">
                          No specific products found matching these active options.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* DEDICATED STORE CART PAGE */}
              {activeTab === 'cart' && (
                <div className="cart-page">
                  <h2>Your Cart ({cart.total_items} items)</h2>
                  {cart.items.map((item, i) => (
                    <div key={i} className="cart-item">
                      <span>{item.product.name} (x{item.quantity})</span>
                      <strong>₹{item.product.price * item.quantity}</strong>
                    </div>
                  ))}
                  <div className="cart-summary">
                    <p>Total Price: ₹{cart.total_price}</p>
                    <button onClick={() => setActiveTab('checkout')} className="checkout-btn">Proceed to checkout</button>
                  </div>
                </div>
              )}

              {/* THE ADDRESS-AWARE ONE-CLICK CHECKOUT PAGE */}
              {activeTab === 'checkout' && (
                <div className="checkout-page">
                  <h2>Complete Checkout</h2>
                  <div className="address-box">
                    <span>Shipping Address:</span>
                    <strong>{profileForm.place ? `${profileForm.place}, ${profileForm.district}, PIN: ${profileForm.pincode}` : "Delhi Logistics Depot Center Hub"}</strong>
                  </div>
                  <div className="payment-method">Method: Cash on Delivery (COD)</div>
                  <button onClick={executeOrderDispatchManifest} className="confirm-btn">CONFIRM COD PURCHASE</button>
                </div>
              )}

              {/* WISHLIST REGISTERS */}
              {activeTab === 'wishlist' && (
                <div className="cart-page">
                  <h2>Your Wishlist ({wishlist.length} items)</h2>
                  {wishlist.length === 0 ? (
                    <p className="text-neutral-400 italic">No items saved yet.</p>
                  ) : (
                    wishlist.map((p, i) => (
                      <div key={i} className="cart-item">
                        <span>{p.name}</span>
                        <div className="flex-row-gap">
                          <button onClick={() => handleAddToCart(p)} className="buy-btn">Move to Bag</button>
                          <button onClick={() => handleToggleLikeProduct(p)} className="profile-signout-btn py-1">Remove</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TRANSACTION HISTORY */}
              {activeTab === 'history' && (
                <div className="cart-page">
                  <h2>Order History</h2>
                  {orders.length === 0 ? (
                    <p className="text-neutral-400 italic">No recent orders found.</p>
                  ) : orders.map((o, i) => (
                    <div key={i} className="cart-item">
                      <div><p className="font-bold">Order ID: #{o.id}</p><p className="text-[10px] text-neutral-400">Address: {o.shipping_address}</p></div>
                      <span className="font-bold text-[#A37B73]">₹{o.total_amount || o.subtotal_amount}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* PROFILE SETTINGS */}
              {activeTab === 'profile' && (
                <div className="profile-wrapper">
                  <div className="profile-card-display">
                    <div className="profile-header-flex">
                      <h3>Verified User Details</h3>
                      <button onClick={handleSignOutSystemAction} className="profile-signout-btn">
                        Sign Out Account
                      </button>
                    </div>
                    <div className="profile-detail-row">
                      <span>Full Name:</span>
                      <strong>
                        {profileForm.first_name || profileForm.last_name 
                          ? `${profileForm.first_name} ${profileForm.last_name}` 
                          : (typeof window !== 'undefined' ? localStorage.getItem('username') : '') || username || 'Bloom Guest'}
                      </strong>
                    </div>
                    <div className="profile-detail-row">
                      <span>Email Address:</span>
                      <strong>{profileForm.email || 'Not Configured'}</strong>
                    </div>
                    <div className="profile-detail-row">
                      <span>Phone Number:</span>
                      <strong>{profileForm.phone_number || 'Not Configured'}</strong>
                    </div>
                    <div className="profile-detail-row">
                      <span>Default Dispatch Station:</span>
                      <strong>{profileForm.place ? `${profileForm.place}, ${profileForm.district} (PIN: ${profileForm.pincode})` : 'Delhi Logistics Depot Center Hub'}</strong>
                    </div>
                  </div>

                  <div className="profile-edit-box">
                    <h3>Update Profile Parameters</h3>
                    <div className="edit-grid">
                      <input value={profileForm.first_name} onChange={e => setProfileForm({...profileForm, first_name: e.target.value})} className="input-field" placeholder="First Name" />
                      <input value={profileForm.last_name} onChange={e => setProfileForm({...profileForm, last_name: e.target.value})} className="input-field" placeholder="Last Name" />
                    </div>
                    <input value={profileForm.place} onChange={e => setProfileForm({...profileForm, place: e.target.value})} className="input-field" placeholder="City Address" />
                    <div className="edit-grid">
                      <input value={profileForm.district} onChange={e => setProfileForm({...profileForm, district: e.target.value})} className="input-field" placeholder="District" />
                      <input value={profileForm.pincode} onChange={e => setProfileForm({...profileForm, pincode: e.target.value})} className="input-field" placeholder="Pincode" />
                    </div>
                    <button onClick={() => toast.success("Profile saved successfully!")} className="btn-primary">Save Changes</button>
                  </div>
                </div>
              )}

            </main>

            {/* FLOATING ACTION EMOJI STACK ELEMENT RIG */}
            <div className="emoji-floating-dock">
              <button onClick={() => setActiveTab('cart')} className={`emoji-fab ${activeTab === 'cart' ? 'fab-active' : ''}`} title="My Cart">
                <span>🛒</span>
                {cart.total_items > 0 && <span className="fab-badge">{cart.total_items}</span>}
              </button>
              <button onClick={() => setActiveTab('wishlist')} className={`emoji-fab ${activeTab === 'wishlist' ? 'fab-active' : ''}`} title="Wishlist">
                <span>💖</span>
                {wishlist.length > 0 && <span className="fab-badge pink-badge">{wishlist.length}</span>}
              </button>
              <button onClick={() => setActiveTab('history')} className={`emoji-fab ${activeTab === 'history' ? 'fab-active' : ''}`} title="Order History">
                <span>📦</span>
              </button>
            </div>

            {/* CUSTOMER SUPPORT FOOTER HUB */}
            <footer className="footer">
              <div className="footer-columns">
                <div className="footer-col">
                  <h4>Baby Bloom.</h4>
                  <p>Delivering premium baby clothing and organic diapering essentials safely across India.</p>
                </div>
                <div className="footer-col">
                  <h5 className="flex items-center gap-1.5"><HelpCircle className="h-4 w-4 text-[#A37B73]" /> Help & Support</h5>
                  <ul>
                    <li>• Help Desk: 6282368650</li>
                    <li>• Support Email: support@babybloom.com</li>
                    <li>• Live Help Chat: Active 24/7</li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h5 className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-[#A37B73]" /> Shipping</h5>
                  <p>Fast courier deliveries handled via Bluedart tracking. Free delivery on orders over ₹1,999.</p>
                </div>
                <div className="footer-col">
                  <h5 className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-[#A37B73]" /> Secure SSL</h5>
                  <p>100% verified encrypted connection architecture protecting purchases.</p>
                </div>
              </div>
              
              <div className="footer-bottom">
                © 2026 Baby Bloom Shop. Everything for your little one. All Rights Reserved.
              </div>
            </footer>

          </div>
        )}
      </body>
    </html>
  );
}