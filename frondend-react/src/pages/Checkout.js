import React from "react";

function Checkout({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2>Checkout Page</h2>

      {cart.length === 0 && <p>Your cart is empty</p>}

      {cart.map((item, index) => (
        <div key={index}>
          <p>
            {item.name} - ₹{item.price}
          </p>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <button>Place Order</button>
    </div>
  );
}

export default Checkout;