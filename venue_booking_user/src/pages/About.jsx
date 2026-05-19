import React from "react"
import { Link } from "react-router-dom"
export default function About() {
  return (
    <div className="page-wrapper">
      <div className="page-title" style={{ backgroundImage: "url(/assets/images/background/page-title-5.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}><div className="auto-container"><h1 style={{ fontFamily: "'Cormorant',serif", color: "#fff" }}>About VenueBook</h1></div></div>
      <div className="bredcrumb-wrap"><div className="auto-container"><ul className="bredcrumb-list"><li><Link to="/">Home</Link></li><li>About</li></ul></div></div>
      <section className="section-padding"><div className="auto-container"><div className="row g-5 align-items-center">
        <div className="col-lg-6"><div style={{ background: "linear-gradient(135deg,rgba(199,122,99,.08),rgba(199,122,99,.04))", border: "1px solid rgba(199,122,99,.2)", borderRadius: 16, padding: 60, textAlign: "center" }}><div style={{ fontSize: 90, marginBottom: 16 }}>🏛️</div><h3 style={{ fontFamily: "'Cormorant',serif", color: "var(--theme-color)", fontWeight: 700 }}>VenueBook</h3><p style={{ color: "#888", fontFamily: "'DM Sans',sans-serif" }}>India's Premier Venue Discovery Platform</p></div></div>
        <div className="col-lg-6">
          <span className="section_heading_title_small">Our Story</span>
          <h2 className="section_heading_title_big" style={{ marginBottom: 16 }}>Making Event Venue <span style={{ color: "var(--theme-color)" }}>Booking Simple</span></h2>
          <p style={{ color: "#6b6b6b", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.8, marginBottom: 16 }}>VenueBook is India's leading online platform for discovering and booking event venues. We connect event planners and individuals with thousands of verified halls, auditoriums, banquet spaces, and conference rooms.</p>
          <p style={{ color: "#6b6b6b", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.8, marginBottom: 28 }}>Our digital-first approach eliminates manual booking struggles, provides real-time availability, and ensures secure payments — making venue booking fast, transparent, and reliable.</p>
          <div className="row g-3 mb-4">{[{n:"500+",l:"Venues Listed"},{n:"200+",l:"Cities"},{n:"10K+",l:"Events Booked"},{n:"4.8★",l:"Avg Rating"}].map(s=>(<div key={s.l} className="col-6"><div style={{ background: "#fff", border: "1px solid #f0e8e2", borderRadius: 8, padding: 14, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}><h4 style={{ color: "var(--theme-color)", fontFamily: "'Cormorant',serif", fontWeight: 700, marginBottom: 2 }}>{s.n}</h4><p style={{ color: "#888", fontFamily: "'DM Sans',sans-serif", fontSize: 12, margin: 0 }}>{s.l}</p></div></div>))}</div>
          <Link to="/venues" className="btn-1">Explore Venues <span></span></Link>
        </div>
      </div></div></section>
    </div>
  )
}
