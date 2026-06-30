import React from "react";
import { Link } from "react-router-dom";

function Home({ user }) {
  const editorialBabyImage = "https://static.vecteezy.com/system/resources/thumbnails/029/508/069/small/baby-s-happy-time-on-the-bed-generative-by-ai-photo.jpg";

  const handleRevealScroll = () => {
    document.getElementById("brand-story-section").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-scroll-container">
      {/* SECTION 1: EDITORIAL GATED DISPLAY FRAME */}
      <div className="fullscreen-aesthetic-gate">
        <div className="gate-text-frame">
          
          {/* DYNAMIC WELCOME BANNER ARCHITECTURE */}
          {user ? (
            <div style={{ marginBottom: "28px", animation: "fadeIn 0.8s ease" }}>
              <span className="section-mini-label" style={{ color: "var(--brand-secondary)", letterSpacing: "4px" }}>
                Welcome Back
              </span>
              <h2 style={{ fontFamily: "Playfair Display", fontSize: "2rem", fontWeight: "400", margin: "6px 0 0 0", color: "var(--text-dark)" }}>
                Greetings, {user.username}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: "4px 0 0 0", fontStyle: "italic" }}>
                Your private registry selection is synchronized and ready.
              </p>
            </div>
          ) : (
            <span className="section-mini-label" style={{ color: "var(--brand-secondary)", letterSpacing: "4px", marginBottom: "20px" }}>
              The Premium Nursery Registry
            </span>
          )}

          <h1>Delivering Pure Comfort To Your Little Blooming Star</h1>
          <p className="gate-quote">
            “A thoughtful curation of organic, chemical-free textiles tailored precisely for healthy early growth cycles.”
          </p>
          
          <button className="btn-primary-action" onClick={handleRevealScroll} style={{ width: "max-content" }}>
            Discover The Paradigm ↓
          </button>
        </div>
        
        <div className="gate-image-frame">
          <img src={editorialBabyImage} alt="Happy baby smiling on the bed" />
        </div>
      </div>

      {/* SECTION 2: THE EXTENDED BRAND SUMMARY STORY BLOCK */}
      <div id="brand-story-section" className="brand-extended-bio">
        <span className="section-mini-label" style={{ marginBottom: "16px" }}>Material Purity Index</span>
        <h3>Our Sustainable Nursery Promise</h3>
        <p>
          We believe that newborn garments require an architectural focus on fabric science. 
          Our organic capsule lines are entirely engineered from chemical-free long-staple cotton structures to ensure thermoregulation loops remain uncompromised. Developed in tandem with pediatric practitioners, our luxury collections preserve soft skin barriers and prioritize environmental longevity.
        </p>
        <div style={{ marginTop: "40px" }}>
          <Link to="/shop" className="btn-primary-action" style={{ display: "inline-block", textDecoration: "none" }}>
            Browse Atelier Catalog ➔
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;