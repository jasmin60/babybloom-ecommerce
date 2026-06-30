import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, NavLink } from "react-router-dom";

import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage"; 
import Cart from "./pages/Cart";
import FavoritesPage from "./pages/FavoritesPage"; // 🔹 New page view component
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import "./App.css";

function AppContent() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });

  // 🔹 WISHLIST STORAGE ENGINE STATE
  const [favorites, setFavorites] = useState([]);
  const [showGreetingModal, setShowGreetingModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  // 🔹 TOGGLE WISHLIST ACTION HOOK
  const toggleFavorite = (product) => {
    setFavorites((prevFavs) => {
      const isAlreadyLiked = prevFavs.some(item => item.id === product.id);
      if (isAlreadyLiked) {
        return prevFavs.filter(item => item.id !== product.id); // Remove if liked
      } else {
        return [...prevFavs, product]; // Add if new
      }
    });
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const safeCart = Array.isArray(prevCart) ? prevCart : [];
      const existing = safeCart.find(item => item.id === product.id || item.product === product.id);

      if (existing) {
        return safeCart.map(item =>
          (item.id === product.id || item.product === product.id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...safeCart, { id: product.id, product: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    navigate("/cart");
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCart([]);
    setFavorites([]);
    setShowGreetingModal(false);
  };

  const totalCartItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <div className="app-container">
      {/* FLOATING WELCOMING MESSAGE MODAL */}
      {showGreetingModal && user && (
        <div className="premium-overlay-curtain">
          <div className="aesthetic-greeting-card">
            <span className="section-mini-label" style={{ color: "var(--brand-secondary)", letterSpacing: "4px" }}>
              Authentication Complete
            </span>
            <h2>Welcome to BabyBloom, {user.username}</h2>
            <p>Your private registry profile has been synchronized successfully.</p>
            <button className="btn-primary-action" style={{ width: "100%" }} onClick={() => setShowGreetingModal(false)}>
              Enter Atelier Catalog
            </button>
          </div>
        </div>
      )}

      {/* Navbar Wrapper */}
      <div className="navbar-wrapper">
        <nav className="navbar">
          <Link to="/" className="logo-area">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeDasharray="2 2" opacity="0.3" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <circle cx="12" cy="12" r="3" fill="var(--surface-pure)" />
            </svg>
            <span className="logo-text" style={{ marginLeft: "4px" }}>BabyBloom</span>
          </Link>
          
          <div className="nav-links-group">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active-route" : "nav-link"}>Welcome</NavLink>
            <NavLink to="/shop" className={({ isActive }) => isActive ? "nav-link active-route" : "nav-link"}>Shop Collection</NavLink>
            <NavLink to="/checkout" className={({ isActive }) => isActive ? "nav-link active-route" : "nav-link"}>Checkout</NavLink>
            {user ? (
              <button onClick={logout} className="btn-logout-nav">Sign Out</button>
            ) : (
              <NavLink to="/auth" className={({ isActive }) => isActive ? "auth-nav-button active-auth" : "auth-nav-button"}>Sign In</NavLink>
            )}
          </div>
        </nav>
      </div>

      {/* 🔹 FLOATING CORNER CONTROLS PACKET */}
      <div className="corner-controls-stack">
        {/* LIKED PRODUCTS DOCK ICON BUTTON */}
        <NavLink 
          to="/favorites" 
          className={({ isActive }) => isActive ? "floating-control-circle active-control" : "floating-control-circle"}
          title="View Liked Products"
        >
          <span className="control-emoji">🖤</span>
          {favorites.length > 0 && <span className="control-badge-counter">{favorites.length}</span>}
        </NavLink>

        {/* SHOPPING BASKET ICON BUTTON */}
        <NavLink 
          to="/cart" 
          className={({ isActive }) => isActive ? "floating-control-circle active-control" : "floating-control-circle"}
          title="View Basket"
        >
          <span className="control-emoji">👜</span>
          {totalCartItems > 0 && <span className="control-badge-counter">{totalCartItems}</span>}
        </NavLink>
      </div>

      <main className="main-viewport">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductsPage products={products} addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/favorites" element={<FavoritesPage favorites={favorites} addToCart={addToCart} toggleFavorite={toggleFavorite} />} />
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth setUser={setUser} setShowGreetingModal={setShowGreetingModal} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={user ? <Checkout cart={cart} setCart={setCart} user={user} /> : <Navigate to="/auth" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;