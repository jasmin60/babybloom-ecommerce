import React from "react";
import { Link } from "react-router-dom";

function FavoritesPage({ favorites, addToCart, toggleFavorite }) {
  const studioFallback = "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80";

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="catalog-header-text" style={{ paddingBottom: "40px", textAlign: "left" }}>
        <span className="section-mini-label" style={{ color: "var(--brand-secondary)" }}>Your Personal Lookbook</span>
        <h2 style={{ fontFamily: "Playfair Display", fontSize: "2.5rem", fontWeight: "400", margin: "8px 0" }}>Liked Products</h2>
      </div>

      {favorites.length === 0 ? (
        <div style={{ background: "var(--surface-pure)", padding: "80px 40px", borderRadius: "4px", textAlign: "center", border: "1px solid var(--border-delicate)" }}>
          <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: "32px", fontSize: "1.1rem" }}>
            You haven't liked any baby designs yet.
          </p>
          <Link to="/shop">
            <button className="btn-primary-action">Explore Atelier Catalog</button>
          </Link>
        </div>
      ) : (
        <div className="product-container">
          {favorites.map((product) => (
            <div key={product.id} className="floating-product-card" style={{ position: "relative" }}>
              
              {/* Heart controller toggle directly on the grid card list */}
              <button 
                className="studio-like-trigger-btn liked-active"
                onClick={() => toggleFavorite(product)}
                title="Remove from Favorites"
              >
                ❤️
              </button>

              <div className="card-img-container">
                <img
                  src={product.image && product.image.trim() !== "" ? product.image : studioFallback}
                  alt={product.name}
                  onError={(e) => { e.target.src = studioFallback; }}
                />
              </div>
              <div className="card-details">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  <span>{product.brand || "BabyBloom"}</span>
                  <span style={{ color: "var(--brand-secondary)" }}>{product.subcategory_name}</span>
                </div>
                
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description || "Hypoallergenic luxury nursery essential composition."}</p>
                
                <div className="card-footer">
                  <span className="price-text">₹{product.price ? parseFloat(product.price).toLocaleString("en-IN") : "0"}</span>
                  <button className="btn-add-cart" onClick={() => addToCart(product)}>Add to Basket</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;