// import React from "react";

// function Home({ products, cart, addToCart, setCart }) {

//   const fallbackPlaceholder =
//     "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80";

//   // 🔥 Add to Cart Logic (combined)
//   // const addToCart = (product) => {
//   //   const existing = cart.find(item => item.product === product.id);

//   //   if (existing) {
//   //     setCart(
//   //       cart.map(item =>
//   //         item.product === product.id
//   //           ? { ...item, quantity: item.quantity + 1 }
//   //           : item
//   //       )
//   //     );
//   //   } else {
//   //     setCart([
//   //       ...cart,
//   //       {
//   //         product: product.id,
//   //         quantity: 1,
//   //         name: product.name,
//   //         price: product.price
//   //       }
//   //     ]);
//   //   }

//   //   alert("Added to cart");
//   // };
//      const addToCart = (product) => {
//   // Safe array fallback check logic
//   const safeCart = Array.isArray(cart) ? cart : [];
  
//   const existing = safeCart.find(item => item.product === product.id);

//   if (existing) {
//     setCart(
//       safeCart.map(item =>
//         item.product === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       )
//     );
//   } else {
//     setCart([
//       ...safeCart,
//       {
//         product: product.id,
//         quantity: 1,
//         name: product.name,
//         price: product.price
//       }
//     ]);
//   }

//   alert("Added to cart");
// };

//   return (
//     <div>
//       {/* 🔹 HERO SECTION */}
//       <div className="hero-grid">
//         <div className="hero-left">
//           <span className="hero-tagline">PREMIUM NURSERY ESSENTIALS</span>
//           <h2>
//             Delivering Pure Comfort <br />
//             To Your Little <span className="highlight-pink">Bloom</span>
//             <span className="highlight-blue">ing</span> Star
//           </h2>
//           <p>
//             Experience premium, pediatrician-approved baby garments,
//             hypoallergenic textiles, and safety-certified accessories built
//             sustainably for healthy development.
//           </p>

//           <button
//             className="btn-primary-action"
//             style={{ width: "max-content", padding: "14px 40px" }}
//             onClick={() =>
//               document
//                 .getElementById("catalog")
//                 .scrollIntoView({ behavior: "smooth" })
//             }
//           >
//             Browse Premium Catalog ➔
//           </button>
//         </div>

//         <div className="hero-right-frame">
//           <img
//             src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=700&q=80"
//             alt="BabyBloom Collection Preview"
//             className="hero-right-img"
//           />
//         </div>
//       </div>

//       {/* 🔹 PRODUCT SECTION */}
//       <div id="catalog" style={{ paddingTop: "10px" }}>
//         <div className="section-header">
//           <h2>Our Curated Arrivals</h2>
//           <p className="section-sub">
//             Dermatologist-tested products sourced directly from trusted
//             sustainable manufacturers.
//           </p>
//         </div>

//         {products.length === 0 ? (
//           <div className="empty-box-view">
//             <p>Loading the BabyBloom catalog...</p>
//           </div>
//         ) : (
//           <div className="product-container">
//             {products.map((product) => (
//               <div key={product.id} className="floating-product-card">

//                 {/* 🔥 Image with fallback */}
//                 <div className="card-img-container">
//                   <img
//                     src={
//                       product.image && product.image.trim() !== ""
//                         ? product.image
//                         : fallbackPlaceholder
//                     }
//                     alt={product.name}
//                     onError={(e) => {
//                       e.target.src = fallbackPlaceholder;
//                     }}
//                   />
//                 </div>

//                 <div className="card-details">
//                   <div className="card-meta-row">
//                     <h3>{product.name}</h3>
//                   </div>

//                   <p className="product-desc">
//                     {product.description ||
//                       "No product summary provided. Hypoallergenic material base."}
//                   </p>

//                   <div className="card-footer">

//                     {/* 🔥 Safe price formatting */}
//                     <span className="price-text">
//                       ₹{product.price
//                         ? parseFloat(product.price).toLocaleString("en-IN")
//                         : "0"}
//                     </span>

//                     {/* 🔥 Add to Cart button */}
//                     <button
//                       className="btn-add-cart"
//                       onClick={() => addToCart(product)}
//                     >
//                       Add to Basket
//                     </button>

//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;


import React from "react";

function Home({ products, addToCart }) {
  const fallbackPlaceholder =
    "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80";

  return (
    <div>
      {/* 🔹 HERO SECTION */}
      <div className="hero-grid">
        <div className="hero-left">
          <span className="hero-tagline">PREMIUM NURSERY ESSENTIALS</span>
          <h2>
            Delivering Pure Comfort <br />
            To Your Little <span className="highlight-pink">Bloom</span>
            <span className="highlight-blue">ing</span> Star
          </h2>
          <p>
            Experience premium, pediatrician-approved baby garments,
            hypoallergenic textiles, and safety-certified accessories built
            sustainably for healthy development.
          </p>

          <button
            className="btn-primary-action"
            style={{ width: "max-content", padding: "14px 40px" }}
            onClick={() =>
              document
                .getElementById("catalog")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Browse Premium Catalog ➔
          </button>
        </div>

        <div className="hero-right-frame">
          <img
            src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=700&q=80"
            alt="BabyBloom Collection Preview"
            className="hero-right-img"
          />
        </div>
      </div>

      {/* 🔹 PRODUCT SECTION */}
      <div id="catalog" style={{ paddingTop: "10px" }}>
        <div className="section-header">
          <h2>Our Curated Arrivals</h2>
          <p className="section-sub">
            Dermatologist-tested products sourced directly from trusted
            sustainable manufacturers.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="empty-box-view">
            <p>Loading the BabyBloom catalog...</p>
          </div>
        ) : (
          <div className="product-container">
            {products.map((product) => (
              <div key={product.id} className="floating-product-card">

                {/* Image with fallback */}
                <div className="card-img-container">
                  <img
                    src={
                      product.image && product.image.trim() !== ""
                        ? product.image
                        : fallbackPlaceholder
                    }
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = fallbackPlaceholder;
                    }}
                  />
                </div>

                <div className="card-details">
                  <div className="card-meta-row">
                    <h3>{product.name}</h3>
                  </div>

                  <p className="product-desc">
                    {product.description ||
                      "No product summary provided. Hypoallergenic material base."}
                  </p>

                  <div className="card-footer">
                    {/* Safe price formatting */}
                    <span className="price-text">
                      ₹{product.price
                        ? parseFloat(product.price).toLocaleString("en-IN")
                        : "0"}
                    </span>

                    {/* Triggering the master prop function */}
                    <button
                      className="btn-add-cart"
                      onClick={() => addToCart(product)}
                    >
                      Add to Basket
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;