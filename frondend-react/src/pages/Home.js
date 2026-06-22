import React from "react";

function Home({ products, addToCart }) {
  const fallbackPlaceholder = "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80";

  return (
    <div>
      {/* Editorial Hero Showcase Section */}
      <div className="hero-grid">
        <div className="hero-left">
          <span className="hero-tagline">PREMIUM NURSERY ESSENTIALS</span>
          <h2>
            Delivering Pure Comfort <br />
            To Your Little <span className="highlight-pink">Bloom</span><span className="highlight-blue">ing</span> Star
          </h2>
          <p>
            Experience premium, pediatrician-approved baby garments, hypoallergenic textiles, 
            and safety-certified accessories built sustainably for healthy development.
          </p>
          <button 
            className="btn-primary-action" 
            style={{ width: "max-content", padding: "14px 40px" }}
            onClick={() => document.getElementById("catalog").scrollIntoView({ behavior: 'smooth' })}
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

      {/* Grid Marketplace Section */}
      <div id="catalog" style={{ paddingTop: "10px" }}>
        <div className="section-header">
          <h2>Our Curated Arrivals</h2>
          <p className="section-sub">Dermatologist-tested products sourced directly from trusted sustainable manufacturers.</p>
        </div>

        {products.length === 0 ? (
          <div className="empty-box-view">
            <p>Loading the modern BabyBloom catalog database collections...</p>
          </div>
        ) : (
          <div className="product-container">
            {products.map((product) => (
              <div key={product.id} className="floating-product-card">
                <div className="card-img-container">
                  <img 
                    src={product.image && product.image.trim() !== "" ? product.image : fallbackPlaceholder} 
                    alt={product.name} 
                    onError={(e) => { e.target.src = fallbackPlaceholder; }}
                  />
                </div>
                
                <div className="card-details">
                  <div className="card-meta-row">
                    <h3>{product.name}</h3>
                  </div>
                  <p className="product-desc">{product.description || "No product summary provided. Hypoallergenic material base."}</p>

                  <div className="card-footer">
                    <span className="price-text">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
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