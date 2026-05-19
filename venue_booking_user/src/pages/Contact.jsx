import React from "react"
import { Link } from "react-router-dom"
export default function Contact() {
  const inp = { width: "100%", padding: "11px 14px", border: "1px solid #e8e0dc", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }
  return (
    <div className="page-wrapper">
      <div className="page-title" style={{ backgroundImage: "url(/assets/images/background/page-title-5.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}><div className="auto-container"><h1 style={{ fontFamily: "'Cormorant',serif", color: "#fff" }}>Contact Us</h1></div></div>
      <div className="bredcrumb-wrap"><div className="auto-container"><ul className="bredcrumb-list"><li><Link to="/">Home</Link></li><li>Contact</li></ul></div></div>
      <section className="section-padding"><div className="auto-container"><div className="row g-5">
        <div className="col-lg-5">
          <span className="section_heading_title_small">Get In Touch</span>
          <h2 className="section_heading_title_big" style={{ marginBottom: 24 }}>We'd Love to <span style={{ color: "var(--theme-color)" }}>Hear From You</span></h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[{i:"fas fa-map-marker-alt",t:"Address",v:"Navrangpura, Ahmedabad, Gujarat – 380009"},{i:"fas fa-phone",t:"Phone",v:"+91 12345 67890"},{i:"fas fa-envelope",t:"Email",v:"hello@venuebook.in"},{i:"fas fa-clock",t:"Hours",v:"Mon–Sat: 9:00 AM – 7:00 PM"}].map(c=>(<div key={c.t} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", border: "1px solid #f0e8e2", borderRadius: 10, padding: 18, boxShadow: "0 2px 10px rgba(0,0,0,.04)" }}><i className={c.i} style={{ color: "var(--theme-color)", fontSize: 20, marginTop: 2, flexShrink: 0 }}/><div><p style={{ color: "#1a1a1a", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{c.t}</p><p style={{ color: "#888", fontFamily: "'DM Sans',sans-serif", fontSize: 13, margin: 0 }}>{c.v}</p></div></div>))}
          </div>
        </div>
        <div className="col-lg-7">
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,.06)", border: "1px solid #f0e8e2" }}>
            <h4 style={{ fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 22, marginBottom: 20 }}>Send a Message</h4>
            <div className="row g-3">
              <div className="col-md-6"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Full Name</label><input type="text" style={inp} placeholder="John Doe"/></div>
              <div className="col-md-6"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Email</label><input type="email" style={inp} placeholder="john@email.com"/></div>
              <div className="col-12"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Subject</label><input type="text" style={inp} placeholder="How can we help?"/></div>
              <div className="col-12"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Message</label><textarea rows={5} style={{ ...inp, resize: "vertical" }} placeholder="Your message..."/></div>
              <div className="col-12"><button className="btn-1">Send Message <span></span></button></div>
            </div>
          </div>
        </div>
      </div></div></section>
    </div>
  )
}
