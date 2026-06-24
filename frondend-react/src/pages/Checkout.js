import React from "react";
import axios from "axios";

function Checkout({ cart }) {

  // ✅ Safe total calculation
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  // 🔥 Place Order Function
  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      // ✅ STEP 1: Create Order
      const orderRes = await axios.post(
        "http://127.0.0.1:8000/api/orders/",
        {
          items: cart.map(item => ({
            product: item.id,        // ⚠️ IMPORTANT (use id)
            quantity: item.quantity || 1
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const orderId = orderRes.data.id;

      // ✅ STEP 2: Payment API (optional if not created yet)
      await axios.post(
        `http://127.0.0.1:8000/api/orders/${orderId}/pay/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("🎉 Order placed & payment successful!");

    } catch (err) {
      console.error(err);
      alert("❌ Checkout failed");
    }
  };

  return (
    <div>
      <div className="checkout-grid-container">
        <h2
          style={{
            marginTop: 0,
            borderBottom: "2px solid #F9F6F0",
            paddingBottom: "15px"
          }}
        >
          💳 Secure Payment
        </h2>

        {cart.length === 0 ? (
          <div className="empty-box-view" style={{ padding: "20px 0" }}>
            <p>No items in cart. Your cart is empty.</p>
          </div>
        ) : (
          <div>
            <h3
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                textTransform: "uppercase"
              }}
            >
              Purchase Summary
            </h3>

            <div style={{ margin: "20px 0" }}>
              {cart.map((item, index) => (
                <div key={index} className="checkout-line-item">
                  <span style={{ color: "var(--text-main)", fontWeight: 500 }}>
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    ₹{item.price}
                  </span>
                </div>
              ))}
            </div>

            <hr className="divider" />

            <div className="checkout-total">
              <span>Grand Payable Amount:</span>
              <span className="total-price">₹{total}</span>
            </div>

            {/* 🔥 REAL BUTTON (API CALL) */}
            <button
              className="btn-primary-action"
              style={{
                marginTop: "30px",
                width: "100%",
                padding: "14px 0"
              }}
              onClick={placeOrder}
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