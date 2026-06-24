import React from "react";
import { Link } from "react-router-dom";

function Cart({ cart, removeFromCart }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price|| 0), 0);

  // Fallback image asset mapper
  const getMiniImage = (name) => {
    const presets = {
      "Organic Cotton Onesie": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80",
      "Plush Teddy Security Blanket": "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=150&q=80",
      "Ergonomic Baby Carrier": "https://images.unsplash.com/photo-1610214437290-761376b50d87?auto=format&fit=crop&w=150&q=80",
      "Gentle Silicone Teether Set": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=150&q=80"
    };
    return presets[name] || "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=150&q=80";
  };

  return (
    <div>
      <h2 style={{ marginBottom: "25px", fontSize: "1.8rem" }}>🧺 Your Shopping Basket</h2>

      {cart.length === 0 ? (
        <div className="cart-floating-view" style={{ display: "block" }}>
          <div className="empty-box-view">
            <span style={{ fontSize: "4rem" }}>🧸</span>
            <p>Your shopping basket feels a little light!</p>
            <Link to="/">
              <button className="btn-primary-action" style={{ width: "auto", padding: "12px 30px", marginTop: "15px" }}>
                Return to Shop Catalog
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-floating-view">
          {/* Main List Column */}
          <div>
            <h3 style={{ marginTop: 0, color: "#7B706C" }}>Review Items ({cart.length})</h3>
            {cart.map((item, index) => (
              <div key={index} className="cart-item-row">
                <div className="cart-item-meta">
                  <img src={getMiniImage(item.name)} alt={item.name} className="cart-item-img" />
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "1.1rem" }}>{item.name}</h4>
                    <span style={{ fontWeight: 700, color: "#FF7597" }}>₹{item.price}</span>
                  </div>
                </div>

                <button className="btn-remove" onClick={() => removeFromCart(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Block Summary Column */}
          <div className="summary-card">
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            <div style={{ display: "flex", justifyContent: "between", margin: "20px 0 10px 0" }}>
              <span style={{ color: "var(--text-muted)", flexGrow: 1 }}>Subtotal Total</span>
              <strong>₹{subtotal}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "between", marginBottom: "25px" }}>
              <span style={{ color: "var(--text-muted)", flexGrow: 1 }}>Shipping Delivery</span>
              <strong style={{ color: "#2E7D32" }}>FREE</strong>
            </div>
            
            <hr style={{ border: "none", borderTop: "1px solid #E3F2FD", margin: "15px 0" }} />
            
            <Link to="/checkout" style={{ textDecoration: "none" }}>
              <button className="btn-primary-action">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;