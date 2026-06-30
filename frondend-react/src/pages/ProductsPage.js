import React, { useState } from "react";

function ProductsPage({ products, addToCart, favorites, toggleFavorite }) {
  const studioFallback = "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80";
  
  const [activeGenderFilter, setActiveGenderFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.subcategory_name && product.subcategory_name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeGenderFilter === "all") return true;
    if (activeGenderFilter === "girl") return product.gender_tag === "girl" || product.gender_tag === "baby_girl";
    if (activeGenderFilter === "boy") return product.gender_tag === "boy" || product.gender_tag === "baby_boy";
    return true;
  });

  const groupedProducts = filteredProducts.reduce((groups, product) => {
    const categoryKey = product.category_name || "General Collections";
    if (!groups[categoryKey]) groups[categoryKey] = [];
    groups[categoryKey].push(product);
    return groups;
  }, {});

  return (
    <div className="products-view-wrapper" style={{ marginTop: "20px" }}>
      <div className="catalog-header-text" style={{ paddingBottom: "40px" }}>
        <span className="section-mini-label" style={{ color: "var(--brand-secondary)" }}>Curated Studio Collections</span>
        <h2 style={{ fontFamily: "Playfair Display", fontSize: "2.8rem", fontWeight: "400", margin: "12px 0" }}>The Premium Infant Catalog</h2>
      </div>

      <div className="search-filter-dock">
        <div className="search-input-wrapper" style={{ marginBottom: "24px" }}>
          <input 
            type="text" 
            placeholder="Search our specialized collections by keyword, brand, or dynamic utility..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          {[
            { label: "All Collections", value: "all" },
            { label: "🌸 Organic Girl Capsule", value: "girl" },
            { label: "🦕 Tailored Boy Capsule", value: "boy" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveGenderFilter(tab.value)}
              style={{
                padding: "12px 28px",
                border: "1px solid var(--border-delicate)",
                borderRadius: "4px",
                fontWeight: "600",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                cursor: "pointer",
                fontFamily: "inherit",
                backgroundColor: activeGenderFilter === tab.value ? "var(--text-dark)" : "var(--surface-pure)",
                color: activeGenderFilter === tab.value ? "#FFF" : "var(--text-dark)",
                transition: "all 0.3s ease"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", background: "var(--surface-pure)", border: "1px solid var(--border-delicate)" }}>
            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No designs found meeting the active registry filters.</p>
          </div>
        ) : (
          Object.keys(groupedProducts).map((categoryName) => (
            <div key={categoryName} style={{ marginBottom: "80px" }}>
              <div style={{ borderBottom: "1px solid var(--text-dark)", paddingBottom: "14px", marginBottom: "40px" }}>
                <h3 style={{ textTransform: "uppercase", letterSpacing: "1px", margin: 0, fontSize: "1.4rem", fontFamily: "Playfair Display" }}>{categoryName}</h3>
              </div>

              <div className="product-container">
                {groupedProducts[categoryName].map((product) => {
                  const isLiked = favorites.some(item => item.id === product.id);
                  
                  return (
                    <div key={product.id} className="floating-product-card" style={{ position: "relative" }}>
                      
                      {/* 🔹 SLEEK ABSOLUTE LIKE HEART TOGGLE BUTTON */}
                      <button 
                        className={`studio-like-trigger-btn ${isLiked ? "liked-active" : ""}`}
                        onClick={() => toggleFavorite(product)}
                        title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        {isLiked ? "❤️" : "🤍"}
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
                          <span>{product.brand || "BabyBloom Atelier"}</span>
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
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductsPage;