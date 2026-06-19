import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>SmartCart</h1>

        {/* Navigation */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/cart">Cart ({cart.length})</Link>
          | <Link to="/checkout">Checkout</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<Home products={products} addToCart={addToCart} />}
          />

          <Route
            path="/cart"
            element={<Cart cart={cart} removeFromCart={removeFromCart} />}
          />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;