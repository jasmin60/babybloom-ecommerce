import React, { useEffect, useState } from "react";
import axios from "axios"; // replace with standard axios import if typing alias exists
// import axiosInstance from "axios"; 
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
});

console.log("Cart state:", cart);


  useEffect(() => {
    // Dynamic Fetch directly targeting your Django view endpoint
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error loading products from backend DB:", err));
  }, []);

//   const addToCart = (product) => {
//   setCart((prevCart) => {
//     const safeCart = Array.isArray(prevCart) ? prevCart : [];

//     const existing = safeCart.find(item => item.product === product.id);

//     if (existing) {
//       return safeCart.map(item =>
//         item.product === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     }

//     return [
//       ...safeCart,
//       {
//         product: product.id,
//         quantity: 1,
//         name: product.name,
//         price: product.price
//       }
//     ];
//   });
// };
const addToCart = (product) => {
    setCart((prevCart) => {
      const safeCart = Array.isArray(prevCart) ? prevCart : [];
      
      // Matches both ID systems to satisfy DRF models + UI templates
      const existing = safeCart.find(item => item.id === product.id || item.product === product.id);

      if (existing) {
        return safeCart.map(item =>
          (item.id === product.id || item.product === product.id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [
        ...safeCart,
        {
          id: product.id,
          product: product.id, 
          name: product.name,
          price: product.price,
          quantity: 1
        }
      ];
    });
    alert(`${product.name} added to basket!`);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCart([]); // Clear cart on logout
  };

  return (
    <Router>
      <div className="app-container">
        
        {/* Professional E-commerce Floating Top Bar */}
        <div className="navbar-wrapper">
          <nav className="navbar">
            <Link to="/" className="logo-area">
              <span className="brand-emoji">🌸</span>
              <span className="logo-text">BabyBloom</span>
            </Link>
            
            <div className="nav-links-group">
              <Link to="/" className="nav-link">Shop Collection</Link>
              <Link to="/cart" className="nav-link nav-cart">
                My Basket <span className="cart-badge">{cart.length}</span>
              </Link>
              <Link to="/checkout" className="nav-link">Checkout</Link>
              
              {user ? (
                <button onClick={logout} className="btn-logout-nav">
                  Hi, {user.username} (Sign Out)
                </button>
              ) : (
                <Link to="/auth" className="auth-nav-button">Sign In</Link>
              )}
            </div>
          </nav>
        </div>

        {/* Dynamic Navigation Content Layouts */}
        <main className="main-viewport">
          <Routes>
            <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
            <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth setUser={setUser} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
            <Route 
              path="/checkout" 
              element={user ? <Checkout cart={cart} user={user} /> : <Navigate to="/auth" state={{ from: "/checkout" }} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;