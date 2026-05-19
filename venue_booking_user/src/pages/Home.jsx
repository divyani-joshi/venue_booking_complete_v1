import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getVenues, getCities, getOccasions, getFeedbacks } from "../services/api"

const BACKEND = "http://localhost:8000"

export default function Home() {
  const [venues, setVenues] = useState([])
  const [cities, setCities] = useState([])
  const [occasions, setOccasions] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({ city_id: "", occasion_id: "", booking_start_date: "" })
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getVenues(), getCities(), getOccasions(), getFeedbacks()])
      .then(([vR, cR, oR, fR]) => {
        setVenues((vR.data.data || []).slice(0, 6))
        setCities(cR.data.data || [])
        setOccasions(oR.data.data || [])
        setFeedbacks((fR.data.data || []).slice(0, 3))
      }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (search.city_id) p.set("city_id", search.city_id)
    if (search.occasion_id) p.set("occasion_id", search.occasion_id)
    navigate(`/venues?${p.toString()}`)
  }

  const avg = feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : "5.0"

  return (
    <div className="page-wrapper">
      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/assets/images/main-slider/banner-3.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,26,46,.82) 0%, rgba(26,26,46,.6) 100%)" }} />
        <div className="auto-container" style={{ position: "relative", zIndex: 2, width: "100%" }}>
          <div style={{ maxWidth: 680 }}>
            <p style={{ color: "var(--theme-color)", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              India's Premier Venue Platform
            </p>
            <h1 style={{ fontFamily: "'Cormorant',serif", color: "#fff", fontWeight: 700, fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 1.15, marginBottom: 20 }}>
              Discover & Reserve <br />
              <span style={{ color: "var(--theme-color)" }}>Perfect Venues</span> <br />
              for Every Occasion
            </h1>
            <p style={{ color: "rgba(255,255,255,.8)", fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.8, maxWidth: 520, marginBottom: 36 }}>
              From grand wedding halls to intimate conference rooms — find, compare, and book the perfect space for your event.
            </p>
            <div className="link-box d-flex gap-3 flex-wrap">
              <Link to="/venues" className="btn-1">Explore Venues <span></span></Link>
              <Link to="/register" className="btn-1 btn-alt">Get Started Free <span></span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOOKING SEARCH FORM ── */}
      <div className="hotel-booking-form-1 gray-bg">
        <div className="auto-container">
          <div className="hotel-booking-form-1-wrap">
            <form className="hotel-booking-form-1-form flex-grow-1 d-flex align-items-end flex-wrap gap-3" onSubmit={handleSearch}>
              <div className="form-group flex-fill">
                <p className="hotel-booking-form-1-label">City / Location:</p>
                <select value={search.city_id} onChange={e => setSearch({ ...search, city_id: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e0e0e0", borderRadius: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 14, background: "#fff", outline: "none" }}>
                  <option value="">All Cities</option>
                  {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group flex-fill">
                <p className="hotel-booking-form-1-label">Occasion:</p>
                <select value={search.occasion_id} onChange={e => setSearch({ ...search, occasion_id: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e0e0e0", borderRadius: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 14, background: "#fff", outline: "none" }}>
                  <option value="">All Occasions</option>
                  {occasions.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                </select>
              </div>
              <div className="form-group flex-fill">
                <p className="hotel-booking-form-1-label">Event Date:</p>
                <input type="date" value={search.booking_start_date} onChange={e => setSearch({ ...search, booking_start_date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e0e0e0", borderRadius: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 14, background: "#fff", outline: "none" }} />
              </div>
              <div className="form-group">
                <button type="submit" className="btn-1">Search Venues <span></span></button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <section style={{ background: "var(--theme-color)", padding: "24px 0" }}>
        <div className="auto-container">
          <div className="row g-3 text-center">
            {[
              { n: venues.length || "50", s: "+", l: "Listed Venues" },
              { n: cities.length || "20", s: "+", l: "Cities Covered" },
              { n: occasions.length || "15", s: "+", l: "Occasion Types" },
              { n: avg, s: "★", l: "Average Rating" },
            ].map((s, i) => (
              <div key={i} className="col-md-3 col-6">
                <h3 style={{ color: "#fff", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 36, marginBottom: 2 }}>{s.n}<span style={{ fontSize: 20 }}>{s.s}</span></h3>
                <p style={{ color: "rgba(255,255,255,.85)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, margin: 0, fontWeight: 500 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED VENUES ── */}
      <section className="section-padding">
        <div className="auto-container">
          <div className="section_heading text-center mb_60">
            <span className="section_heading_title_small">Explore Spaces</span>
            <h2 className="section_heading_title_big">Featured Venues</h2>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <div style={{ width: 44, height: 44, border: "4px solid rgba(199,122,99,.2)", borderTopColor: "#C77A63", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : venues.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: 60, marginBottom: 16 }}>🏛️</div>
              <h4 style={{ fontFamily: "'Cormorant',serif" }}>No venues yet</h4>
            </div>
          ) : (
            <div className="row">
              {venues.map(v => (
                <div key={v._id} className="col-lg-4 col-md-6">
                  <div className="room-1-block wow fadeInUp">
                    <div className="room-1-image hvr-img-zoom-1" style={{ height: 240, overflow: "hidden" }}>
                      {v.image ? (
                        <img src={`${BACKEND}${v.image}`} alt={v.venue_type?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex" }} />
                      ) : null}
                      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#f8f0ec,#f0e8e2)", display: v.image ? "none" : "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>🏛️</div>
                    </div>
                    <div className="room-1-content">
                      <p className="room-1-meta-info">From <span className="theme-color">₹{v.price?.toLocaleString("en-IN")}</span> / event</p>
                      <div className="room-1-rating" style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                        {[1, 2, 3, 4, 5].map(s => <i key={s} className="icon-6" style={{ color: "var(--theme-color)", fontSize: 12 }} />)}
                      </div>
                      <h4 className="room-1-title mb_20">
                        <Link to={`/venues/${v._id}`}>{v.venue_type?.name || "Event Venue"}</Link>
                      </h4>
                      <p className="room-1-text mb_30" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {v.description}
                      </p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                        {v.city?.name && <span style={{ background: "rgba(199,122,99,.1)", color: "var(--theme-color)", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(199,122,99,.2)" }}>📍 {v.city.name}</span>}
                        {v.occasion?.name && <span style={{ background: "rgba(199,122,99,.1)", color: "var(--theme-color)", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(199,122,99,.2)" }}>🎉 {v.occasion.name}</span>}
                      </div>
                      <div className="link-btn">
                        <Link to={`/venues/${v._id}`} className="btn-1 btn-alt">Reserve Now <span></span></Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-5">
            <Link to="/venues" className="btn-1">View All Venues <span></span></Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 0", background: "#1a1a2e" }}>
        <div className="auto-container">
          <div className="section_heading text-center mb_60">
            <span className="section_heading_title_small" style={{ color: "var(--theme-color)" }}>Simple Steps</span>
            <h2 className="section_heading_title_big" style={{ color: "#fff" }}>How VenueBook Works</h2>
          </div>
          <div className="row g-4">
            {[
              { step: "01", icon: "fas fa-search", title: "Search Venues", desc: "Filter by city, occasion type, and your event dates to find the perfect space." },
              { step: "02", icon: "fas fa-calendar-alt", title: "Select Dates", desc: "Choose your event start date, end date, and preferred booking time." },
              { step: "03", icon: "fas fa-check-circle", title: "Get Approved", desc: "Admin confirms your reservation. You'll be notified once approved." },
              { step: "04", icon: "fas fa-credit-card", title: "Pay & Celebrate", desc: "Pay securely via Razorpay and your dream venue is booked!" },
            ].map((s, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <div style={{ textAlign: "center", padding: "32px 20px" }}>
                  <div style={{ width: 70, height: 70, borderRadius: "50%", border: "2px solid rgba(199,122,99,.4)", background: "rgba(199,122,99,.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <i className={s.icon} style={{ color: "var(--theme-color)", fontSize: 26 }} />
                  </div>
                  <span style={{ color: "var(--theme-color)", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>STEP {s.step}</span>
                  <h5 style={{ color: "#fff", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 20, margin: "8px 0 10px" }}>{s.title}</h5>
                  <p style={{ color: "#a0a0b0", fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "70px 0", background: "var(--theme-color)" }}>
        <div className="auto-container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span style={{ color: "rgba(255,255,255,.8)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>Limited Spots Available</span>
              <h2 style={{ color: "#fff", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.8rem)", margin: "8px 0 10px" }}>Ready to Book Your Dream Venue?</h2>
              <p style={{ color: "rgba(255,255,255,.85)", fontFamily: "'DM Sans',sans-serif", fontSize: 15, margin: 0 }}>Create a free account and start exploring hundreds of verified event venues today.</p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <Link to="/register" className="btn-1" style={{ background: "#fff", color: "var(--theme-color)", border: "none" }}>Create Free Account <span style={{ background: "var(--theme-color)" }}></span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEEDBACKS ── */}
      {feedbacks.length > 0 && (
        <section className="section-padding" style={{ background: "#f9f6f4" }}>
          <div className="auto-container">
            <div className="section_heading text-center mb_60">
              <span className="section_heading_title_small">Testimonials</span>
              <h2 className="section_heading_title_big">What Our Clients Say</h2>
            </div>
            <div className="row g-4">
              {feedbacks.map((f, i) => (
                <div key={f._id || i} className="col-lg-4 col-md-6">
                  <div style={{ background: "#fff", borderRadius: 12, padding: 30, boxShadow: "0 4px 20px rgba(0,0,0,.06)", border: "1px solid #f0e8e2", height: "100%" }}>
                    <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <i key={s} className="fas fa-star" style={{ color: s <= f.rating ? "var(--theme-color)" : "#e2e2e2", fontSize: 14 }} />
                      ))}
                    </div>
                    <p style={{ color: "#6b6b6b", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontStyle: "italic", lineHeight: 1.8, marginBottom: 6 }}>"{f.message}"</p>
                    {f.review && <p style={{ color: "var(--theme-color)", fontSize: 12, fontWeight: 600, marginBottom: 18 }}>— {f.review}</p>}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--theme-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 18 }}>
                        {f.user?.name?.charAt(0)?.toUpperCase() || "G"}
                      </div>
                      <div>
                        <p style={{ color: "#1a1a1a", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 15, margin: 0 }}>{f.user?.name || "Guest"}</p>
                        <p style={{ color: "#999", fontFamily: "'DM Sans',sans-serif", fontSize: 12, margin: 0 }}>{f.venue?.venue_type?.name || "Event Venue"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link to="/feedbacks" className="btn-1 btn-alt">All Reviews <span></span></Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
