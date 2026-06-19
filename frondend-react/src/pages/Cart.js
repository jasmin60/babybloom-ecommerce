import React from "react";
import { Link } from "react-router-dom";

function Cart({ cart, removeFromCart }) {
  return (
    <div>
      <h2>Cart Page</h2>

      {cart.length === 0 && <p>No items in cart</p>}

      {cart.map((item, index) => (
        <div key={index}>
          <p>{item.name} - ₹{item.price}</p>

          <button onClick={() => removeFromCart(index)}>
            Remove
          </button>
            <Link to="/checkout">
                <button>Proceed to Checkout</button>    
            </Link>
        </div>
      ))}
    </div>
  );
}

export default Cart;