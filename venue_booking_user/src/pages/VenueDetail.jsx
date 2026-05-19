import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { getVenueDetails, getFeedbacks, bookVenue, genOrderId, verifyPayment } from "../services/api"

const BACKEND = "http://localhost:8000"
const RAZORPAY_KEY = "rzp_test_VQhEfe2NCXbbwI"

export default function VenueDetail({ isAuthenticated }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [venue, setVenue] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [form, setForm] = useState({ booking_start_date: "", booking_end_date: "", booking_time: "10:00" })

  useEffect(() => {
    Promise.all([getVenueDetails(id), getFeedbacks(id)])
      .then(([vR, fR]) => { setVenue(vR.data.data); setFeedbacks(fR.data.data || []) })
      .catch(() => { toast.error("Venue not found!"); navigate("/venues") })
      .finally(() => setLoading(false))
  }, [id])

  const rentalDays = form.booking_start_date && form.booking_end_date
    ? Math.max(1, Math.ceil((new Date(form.booking_end_date) - new Date(form.booking_start_date)) / 86400000))
    : 0
  const totalCost = venue && rentalDays ? venue.price * rentalDays : 0

  const handleBook = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error("Please login to book!"); navigate("/login"); return }
    if (!form.booking_start_date) { toast.error("Select start date"); return }
    if (!form.booking_end_date) { toast.error("Select end date"); return }
    if (new Date(form.booking_end_date) < new Date(form.booking_start_date)) { toast.error("End date must be after start"); return }
    if (!form.booking_time) { toast.error("Select booking time"); return }
    setBooking(true)
    try {
      const r = await bookVenue({ venue_id: id, ...form })
      if (r.data.success) {
        toast.success("Venue booked! Awaiting admin approval.")
        navigate("/my-bookings")
      }
    } catch (err) { toast.error(err.response?.data?.message || "Booking failed!") }
    finally { setBooking(false) }
  }

  if (loading) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 48, height: 48, border: "4px solid rgba(199,122,99,.2)", borderTopColor: "#C77A63", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  if (!venue) return null

  const today = new Date().toISOString().split("T")[0]
  const avgRating = feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : null

  return (
    <div className="page-wrapper">
      {/* Breadcrumb */}
      <div className="page-title" style={{ backgroundImage: "url(/assets/images/background/page-title-5.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="auto-container">
          <h1 style={{ fontFamily: "'Cormorant',serif", color: "#fff" }}>{venue.venue_type?.name || "Venue Details"}</h1>
        </div>
      </div>
      <div className="bredcrumb-wrap">
        <div className="auto-container">
          <ul className="bredcrumb-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/venues">Venues</Link></li>
            <li>{venue.venue_type?.name || "Detail"}</li>
          </ul>
        </div>
      </div>

      <section className="section-padding">
        <div className="auto-container">
          <div className="row g-5">
            {/* Left */}
            <div className="col-lg-7">
              {/* Image */}
              <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 30, boxShadow: "0 8px 30px rgba(0,0,0,.1)" }}>
                {venue.image ? (
                  <img src={`${BACKEND}${venue.image}`} alt={venue.venue_type?.name} style={{ width: "100%", maxHeight: 460, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                ) : (
                  <div style={{ height: 380, background: "linear-gradient(135deg,#f8f0ec,#f0e8e2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100 }}>🏛️</div>
                )}
              </div>

              {/* Info Card */}
              <div style={{ background: "#fff", border: "1px solid #f0e8e2", borderRadius: 12, padding: 30, boxShadow: "0 4px 20px rgba(0,0,0,.05)", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: "clamp(1.6rem,3vw,2.2rem)", color: "#1a1a1a", marginBottom: 8 }}>
                      {venue.venue_type?.name || "Event Venue"}
                    </h2>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {venue.city?.name && <span style={{ background: "rgba(199,122,99,.1)", color: "var(--theme-color)", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(199,122,99,.25)" }}>📍 {venue.city.name}</span>}
                      {venue.occasion?.name && <span style={{ background: "rgba(199,122,99,.1)", color: "var(--theme-color)", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(199,122,99,.25)" }}>🎉 {venue.occasion.name}</span>}
                      {venue.venue_type?.name && <span style={{ background: "#f0f4ff", color: "#4f46e5", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>🏛️ {venue.venue_type.name}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "var(--theme-color)", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 32, margin: 0 }}>₹{venue.price?.toLocaleString("en-IN")}</p>
                    <p style={{ color: "#999", fontFamily: "'DM Sans',sans-serif", fontSize: 13, margin: 0 }}>per day</p>
                    {avgRating && (
                      <div style={{ display: "flex", gap: 2, justifyContent: "flex-end", marginTop: 4 }}>
                        {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star" style={{ color: s <= avgRating ? "var(--theme-color)" : "#e2e2e2", fontSize: 12 }} />)}
                        <span style={{ color: "#999", fontSize: 12, marginLeft: 4 }}>({feedbacks.length})</span>
                      </div>
                    )}
                  </div>
                </div>
                <p style={{ color: "#6b6b6b", fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.8, margin: 0 }}>{venue.description}</p>
              </div>

              {/* Feedbacks */}
              {feedbacks.length > 0 && (
                <div>
                  <h4 style={{ fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 22, color: "#1a1a1a", marginBottom: 20 }}>
                    Guest Reviews <span style={{ color: "var(--theme-color)", fontSize: 16 }}>({feedbacks.length})</span>
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {feedbacks.slice(0, 4).map((f, i) => (
                      <div key={f._id || i} style={{ background: "#fff", border: "1px solid #f0e8e2", borderRadius: 10, padding: 20 }}>
                        <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                          {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star" style={{ color: s <= f.rating ? "var(--theme-color)" : "#e2e2e2", fontSize: 13 }} />)}
                        </div>
                        <p style={{ color: "#6b6b6b", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontStyle: "italic", marginBottom: 8 }}>"{f.message}"</p>
                        {f.review && <p style={{ color: "var(--theme-color)", fontSize: 12, fontWeight: 600, marginBottom: 0 }}>— {f.review}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Booking Card */}
            <div className="col-lg-5">
              <div style={{ background: "#fff", border: "1px solid #f0e8e2", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,.1)", position: "sticky", top: 90 }}>
                <div style={{ background: "var(--theme-color)", padding: "18px 24px" }}>
                  <h4 style={{ color: "#fff", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 22, margin: 0 }}>
                    🗓️ Reserve This Venue
                  </h4>
                  <p style={{ color: "rgba(255,255,255,.85)", fontFamily: "'DM Sans',sans-serif", fontSize: 12, margin: "4px 0 0" }}>
                    Book and await admin confirmation
                  </p>
                </div>
                <form onSubmit={handleBook} style={{ padding: 24 }}>
                  {/* Dates */}
                  <div className="row g-3" style={{ marginBottom: 16 }}>
                    <div className="col-12">
                      <label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6, display: "block" }}>Event Start Date *</label>
                      <input type="date" value={form.booking_start_date} min={today}
                        onChange={e => { setForm(f => ({ ...f, booking_start_date: e.target.value, booking_end_date: e.target.value >= form.booking_end_date ? "" : form.booking_end_date })) }}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #e8e0dc", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }} required />
                    </div>
                    <div className="col-12">
                      <label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6, display: "block" }}>Event End Date *</label>
                      <input type="date" value={form.booking_end_date} min={form.booking_start_date || today}
                        onChange={e => setForm(f => ({ ...f, booking_end_date: e.target.value }))}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #e8e0dc", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }} required />
                    </div>
                    <div className="col-12">
                      <label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6, display: "block" }}>Preferred Time *</label>
                      <input type="time" value={form.booking_time}
                        onChange={e => setForm(f => ({ ...f, booking_time: e.target.value }))}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #e8e0dc", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }} required />
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  {rentalDays > 0 && (
                    <div style={{ background: "#fdf8f5", border: "1px solid rgba(199,122,99,.2)", borderRadius: 8, padding: "16px 18px", marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                        <span style={{ color: "#888" }}>₹{venue.price?.toLocaleString("en-IN")} × {rentalDays} day{rentalDays > 1 ? "s" : ""}</span>
                        <span style={{ color: "#1a1a1a", fontWeight: 600 }}>₹{totalCost.toLocaleString("en-IN")}</span>
                      </div>
                      <div style={{ borderTop: "1px solid rgba(199,122,99,.2)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#1a1a1a", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 16 }}>Total Amount</span>
                        <span style={{ color: "var(--theme-color)", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 26 }}>₹{totalCost.toLocaleString("en-IN")}</span>
                      </div>
                      <p style={{ color: "#aaa", fontSize: 11, margin: "8px 0 0", fontFamily: "'DM Sans',sans-serif" }}>
                        ⚠️ Payment only after admin approves your booking.
                      </p>
                    </div>
                  )}

                  <button type="submit" className="btn-1" style={{ width: "100%", textAlign: "center", opacity: booking ? .7 : 1 }} disabled={booking}>
                    {booking ? "Submitting..." : isAuthenticated ? "Submit Booking Request" : "Login to Book"} <span></span>
                  </button>
                  {!isAuthenticated && (
                    <p style={{ color: "#888", fontFamily: "'DM Sans',sans-serif", fontSize: 12, textAlign: "center", marginTop: 12 }}>
                      <Link to="/login" style={{ color: "var(--theme-color)" }}>Login</Link> or <Link to="/register" style={{ color: "var(--theme-color)" }}>Register</Link> to book
                    </p>
                  )}
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 5 }}>
                    {["✅ Admin approval required", "🔒 Secure Razorpay payment", "📧 Email confirmation", "❌ Free cancellation"].map(t => (
                      <p key={t} style={{ color: "#aaa", fontSize: 11, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{t}</p>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
