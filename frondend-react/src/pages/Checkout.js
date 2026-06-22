import React from "react";

function Checkout({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <div className="checkout-grid-container">
        <h2 style={{ marginTop: 0, borderBottom: "2px solid #F9F6F0", paddingBottom: "15px" }}>
          💳 Secured Secure Payment
        </h2>

        {cart.length === 0 ? (
          <div className="empty-box-view" style={{ padding: "20px 0" }}>
            <p>No open checkout schedules active. Your cart is empty.</p>
          </div>
        ) : (
          <div>
            <h3 style={{ color: "var(--text-muted)", fontSize: "1rem", uppercase: "true" }}>
              Purchase Summary
            </h3>
            
            <div style={{ margin: "20px 0" }}>
              {cart.map((item, index) => (
                <div key={index} className="checkout-line-item">
                  <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontWeight: 600 }}>₹{item.price}</span>
                </div>
              ))}
            </div>
            
            <hr className="divider" />
            
            <div className="checkout-total">
              <span>Grand Payable Amount:</span>
              <span className="total-price">₹{total}</span>
            </div>

            <button 
              className="btn-primary-action" 
              style={{ background: "linear-gradient(45deg, var(--dark-blue), #4fc3f7)", boxShadow: "0 6px 20px rgba(2, 136, 209, 0.3)" }}
              onClick={() => alert("🎉 Thank you! Your secure checkout order was placed successfully!")}
            >
              Authorize & Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;