import React from "react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer style={{ background: "#1a1a2e", color: "#a0a0b0" }}>
      <div className="auto-container" style={{ paddingTop: 60, paddingBottom: 30 }}>
        <div className="row g-5 mb-5">
          {/* Brand */}
          <div className="col-lg-4">
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 26, color: "#fff" }}>
                🏛️ Venue<span style={{ color: "var(--theme-color)" }}>Book</span>
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 22 }}>
              India's premier platform for discovering and reserving event venues — halls, auditoriums, banquet spaces and more.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[["fab fa-facebook-f", "#"], ["fab fa-instagram", "#"], ["fab fa-twitter", "#"], ["fab fa-linkedin-in", "#"]].map(([ic, h]) => (
                <a key={ic} href={h} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(199,122,99,.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--theme-color)", transition: "all .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--theme-color)"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--theme-color)" }}>
                  <i className={ic} style={{ fontSize: 13 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-4">
            <h6 style={{ color: "#fff", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 18, marginBottom: 20, paddingBottom: 10, borderBottom: "2px solid var(--theme-color)" }}>Explore</h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[{ to: "/", l: "Home" }, { to: "/venues", l: "All Venues" }, { to: "/feedbacks", l: "Reviews" }, { to: "/about", l: "About Us" }, { to: "/contact", l: "Contact" }].map(x => (
                <li key={x.to} style={{ marginBottom: 10 }}>
                  <Link to={x.to} style={{ color: "#a0a0b0", fontSize: 14, textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => e.target.style.color = "var(--theme-color)"}
                    onMouseLeave={e => e.target.style.color = "#a0a0b0"}>
                    <i className="fas fa-angle-right me-2" style={{ color: "var(--theme-color)", fontSize: 11 }} />{x.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="col-lg-2 col-md-4">
            <h6 style={{ color: "#fff", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 18, marginBottom: 20, paddingBottom: 10, borderBottom: "2px solid var(--theme-color)" }}>Account</h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[{ to: "/login", l: "Login" }, { to: "/register", l: "Register" }, { to: "/my-bookings", l: "My Bookings" }, { to: "/profile", l: "My Profile" }, { to: "/forgot-password", l: "Reset Password" }].map(x => (
                <li key={x.to} style={{ marginBottom: 10 }}>
                  <Link to={x.to} style={{ color: "#a0a0b0", fontSize: 14, textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => e.target.style.color = "var(--theme-color)"}
                    onMouseLeave={e => e.target.style.color = "#a0a0b0"}>
                    <i className="fas fa-angle-right me-2" style={{ color: "var(--theme-color)", fontSize: 11 }} />{x.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-4">
            <h6 style={{ color: "#fff", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 18, marginBottom: 20, paddingBottom: 10, borderBottom: "2px solid var(--theme-color)" }}>Contact Us</h6>
            {[
              { i: "fas fa-map-marker-alt", t: "Navrangpura, Ahmedabad, Gujarat – 380009" },
              { i: "fas fa-phone", t: "+91 12345 67890" },
              { i: "fas fa-envelope", t: "hello@venuebook.in" },
              { i: "fas fa-clock", t: "Mon–Sat: 9:00 AM – 7:00 PM" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <i className={c.i} style={{ color: "var(--theme-color)", marginTop: 3, flexShrink: 0, width: 16 }} />
                <span style={{ fontSize: 14, lineHeight: 1.6 }}>{c.t}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ margin: 0, fontSize: 13 }}>© {new Date().getFullYear()} <strong style={{ color: "var(--theme-color)" }}>VenueBook</strong>. All rights reserved.</p>
          <p style={{ margin: 0, fontSize: 13 }}>Secure payments powered by <strong style={{ color: "var(--theme-color)" }}>Razorpay</strong></p>
        </div>
      </div>
    </footer>
  )
}
