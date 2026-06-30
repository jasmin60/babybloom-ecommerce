import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Checkout({ cart, setCart }) {
  const [step, setStep] = useState(1); 
  const [selectedMethod, setSelectedMethod] = useState("card"); 
  const [processing, setProcessing] = useState(false);
  
  // Shipping Input States
  const [fullName, setFullName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [cityName, setCityName] = useState("");

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1) || 0), 0);

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!fullName || !shippingAddress || !cityName) {
      alert("Please fill out all required shipping fields.");
      return;
    }
    setStep(2); 
  };

  // 🔹 FIXED HOOK LINE: Added explicitly defined async contextual execution token
  const handleFinalizePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please sign in to verify your purchase registry.");
      return;
    }

    try {
      setProcessing(true);
      
      const orderPayload = {
        shipping_address: `${fullName}, ${shippingAddress}, ${cityName}`, 
        items: cart.map(item => ({
          product: item.product || item.id, 
          quantity: parseInt(item.quantity) || 1
        }))
      };

      const orderRes = await axios.post(
        "http://127.0.0.1:8000/api/orders/",
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        `http://127.0.0.1:8000/api/orders/${orderRes.data.id}/pay/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart([]); 
      setStep(3); 
    } catch (err) {
      console.error(err);
      alert("Transaction dropped during database synchronization.");
    } finally {
      setProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div style={{ textAlign: "center", padding: "80px 40px", background: "var(--surface-pure)", border: "1px solid var(--border-delicate)", maxWidth: "600px", margin: "40px auto", boxShadow: "var(--shadow-editorial)" }}>
        <h2 style={{ fontFamily: "Playfair Display", fontSize: "2.4rem", fontWeight: 400, margin: "0 0 16px 0" }}>Transaction Verified</h2>
        <span style={{ display: "inline-block", backgroundColor: "#E8F5E9", color: "#2E7D32", padding: "6px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "24px", textTransform: "uppercase" }}>
          Paid via {selectedMethod.toUpperCase()}
        </span>
        <p style={{ color: "var(--text-muted)", lineHeight: "1.8", marginBottom: "40px" }}>
          Thank you for choosing BabyBloom. Your order details have been finalized and routed to our premium nursery logistics fulfillment terminal.
        </p>
        <Link to="/shop">
          <button className="btn-primary-action">Continue Exploring</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "750px", margin: "40px auto", background: "var(--surface-pure)", padding: "48px", border: "1px solid var(--border-delicate)", boxShadow: "var(--shadow-editorial)" }}>
      <div style={{ display: "flex", gap: "24px", marginBottom: "40px", borderBottom: "1px solid var(--border-delicate)", paddingBottom: "20px" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: "600", color: step === 1 ? "var(--text-dark)" : "var(--text-muted)", borderBottom: step === 1 ? "2px solid var(--brand-primary)" : "none", paddingBottom: "4px" }}>
          01 Shipping Details
        </span>
        <span style={{ fontSize: "0.9rem", fontWeight: "600", color: step === 2 ? "var(--text-dark)" : "var(--text-muted)", borderBottom: step === 2 ? "2px solid var(--brand-primary)" : "none", paddingBottom: "4px" }}>
          02 Secure Payment Options
        </span>
      </div>

      {cart.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No active transactions found for empty bags.</p>
      ) : (
        <div>
          {step === 1 && (
            <form onSubmit={handleProceedToPayment}>
              <h3 style={{ fontFamily: "Playfair Display", fontSize: "1.6rem", fontWeight: "400", marginBottom: "24px" }}>Fulfillment Information</h3>
              <div className="input-group">
                <label>Recipient Full Name</label>
                <input type="text" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Street Address</label>
                <input type="text" placeholder="123 Luxury Nursery Lane" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>City / Region</label>
                <input type="text" placeholder="Bloom Town" value={cityName} onChange={(e) => setCityName(e.target.value)} required />
              </div>
              
              <div style={{ marginTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>Total: ₹{total.toLocaleString("en-IN")}</span>
                <button type="submit" className="btn-primary-action">Proceed to Methods ➔</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: "Playfair Display", fontSize: "1.6rem", fontWeight: "400", marginBottom: "24px" }}>Select Payment Gateway Option</h3>
              
              <div className="payment-options-matrix-grid">
                <div className={`payment-selection-row ${selectedMethod === 'card' ? 'selected' : ''}`} onClick={() => setSelectedMethod('card')}>
                  <div className="payment-row-left">
                    <input type="radio" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} />
                    <div>
                      <strong>Credit / Debit Card</strong>
                      <p>Visa, Mastercard, American Express, RuPay</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "1.4rem" }}>💳</span>
                </div>

                <div className={`payment-selection-row ${selectedMethod === 'upi' ? 'selected' : ''}`} onClick={() => setSelectedMethod('upi')}>
                  <div className="payment-row-left">
                    <input type="radio" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} />
                    <div>
                      <strong>Instant UPI Transfer</strong>
                      <p>Google Pay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "1.4rem" }}>📱</span>
                </div>

                <div className={`payment-selection-row ${selectedMethod === 'netbanking' ? 'selected' : ''}`} onClick={() => setSelectedMethod('netbanking')}>
                  <div className="payment-row-left">
                    <input type="radio" checked={selectedMethod === 'netbanking'} onChange={() => setSelectedMethod('netbanking')} />
                    <div>
                      <strong>Net Banking</strong>
                      <p>Secure routing through all major commercial institutional banks</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "1.4rem" }}>🏛️</span>
                </div>
              </div>

              <div className="payment-method-details-panel">
                {selectedMethod === "card" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" disabled />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div className="input-group" style={{ marginBottom: 0 }}><label>Expiry Date</label><input type="text" placeholder="MM/YY" disabled /></div>
                      <div className="input-group" style={{ marginBottom: 0 }}><label>CVV Code</label><input type="password" placeholder="•••" disabled /></div>
                    </div>
                  </div>
                )}

                {selectedMethod === "upi" && (
                  <div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Enter UPI Handle Address</label>
                      <input type="text" placeholder="username@upi" disabled />
                    </div>
                  </div>
                )}

                {selectedMethod === "netbanking" && (
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Select Bank</label>
                    <select style={{ width: "100%", padding: "14px", border: "1px solid var(--border-delicate)", background: "var(--bg-creme)", outline: "none" }} disabled>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                    </select>
                  </div>
                )}
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginTop: "12px", fontStyle: "italic" }}>
                  * Interface initialized in demo isolation mode. Field submission forms are mock-rendered.
                </span>
              </div>

              <div style={{ marginTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-delicate)", paddingTop: "24px" }}>
                <button className="btn-remove" style={{ textDecoration: "none", fontSize: "0.95rem" }} onClick={() => setStep(1)}>
                  ← Back to Details
                </button>
                <button className="btn-primary-action" onClick={handleFinalizePayment} disabled={processing}>
                  {processing ? "Authorizing Security Node..." : `Pay ₹${total.toLocaleString("en-IN")}`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Checkout;