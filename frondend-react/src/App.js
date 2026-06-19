import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products from Django API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Add to cart
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Remove from cart
  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>SmartCart</h1>

      {/* Cart Count */}
      <h2>Cart Items: {cart.length}</h2>

      {/* Cart Section */}
      <h3>Cart:</h3>
      {cart.length === 0 && <p>No items in cart</p>}

      {cart.map((item, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <p>
            {item.name} - ₹{item.price}
          </p>
          <button onClick={() => removeFromCart(index)}>
            Remove
          </button>
        </div>
      ))}

      <hr />

      {/* Product List */}
      <h2>Products</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              width: "200px",
              borderRadius: "10px",
            }}
          >
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price}</p>
            <p>{product.description}</p>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "auto" }} />

            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;