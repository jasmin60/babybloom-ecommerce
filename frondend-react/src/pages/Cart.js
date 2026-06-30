import React from "react";
import { Link } from "react-router-dom";

function Cart({ cart, removeFromCart }) {
  const subtotal = cart.reduce((sum, item) => sum + ((item.price * (item.quantity || 1)) || 0), 0);

  const getMiniImage = (name) => {
    const presets = {
      "Organic Cotton Onesie": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=250&q=80",
      "Plush Teddy Security Blanket": "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=250&q=80",
      "Ergonomic Baby Carrier": "https://images.unsplash.com/photo-1610214437290-761376b50d87?auto=format&fit=crop&w=250&q=80",
      "Gentle Silicone Teether Set": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=250&q=80"
    };
    return presets[name] || "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=250&q=80";
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ marginBottom: "40px", fontSize: "2.5rem", fontFamily: "Playfair Display", fontWeight: 400 }}>Shopping Bag</h2>

      {cart.length === 0 ? (
        <div style={{ background: "var(--surface-pure)", padding: "80px 40px", borderRadius: "4px", textAlign: "center", border: "1px solid var(--border-delicate)" }}>
          <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: "32px", fontSize: "1.1rem" }}>Your shopping basket is currently empty.</p>
          <Link to="/shop">
            <button className="btn-primary-action">Return to Store Catalog</button>
          </Link>
        </div>
      ) : (
        <div className="cart-floating-view">
          <div>
            {cart.map((item, index) => (
              <div key={index} className="cart-item-row">
                <div className="cart-item-meta">
                  <img src={getMiniImage(item.name)} alt={item.name} className="cart-item-img" />
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "1.2rem", fontFamily: "Playfair Display", fontWeight: 400 }}>{item.name}</h4>
                    <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                      ₹{item.price} <span style={{ color: "var(--text-muted)", fontWeight: "400", fontSize: "0.85rem" }}>× {item.quantity || 1}</span>
                    </span>
                  </div>
                </div>
                <button className="btn-remove" onClick={() => removeFromCart(index)}>Remove</button>
              </div>
            ))}
          </div>

          <div className="summary-card">
            <h3 style={{ marginTop: 0, fontFamily: "Playfair Display", fontSize: "1.6rem", fontWeight: 400, borderBottom: "1px solid var(--border-delicate)", paddingBottom: "16px" }}>Order Statement</h3>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "24px 0 12px 0", fontSize: "0.95rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "0.95rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Logistics Premium Shipping</span>
              <span style={{ color: "var(--text-dark)", fontWeight: 600 }}>COMPLIMENTARY</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.4rem", fontWeight: "600", borderTop: "1px solid var(--text-dark)", paddingTop: "20px", marginBottom: "32px" }}>
              <span>Total amount:</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <Link to="/checkout" style={{ textDecoration: "none" }}>
              <button className="btn-primary-action" style={{ width: "100%" }}>Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;