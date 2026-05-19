import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getFeedbacks } from "../services/api"
export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => { getFeedbacks().then(r => setFeedbacks(r.data.data || [])).catch(console.error).finally(() => setLoading(false)) }, [])
  const avg = feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : 0
  return (
    <div className="page-wrapper">
      <div className="page-title" style={{ backgroundImage: "url(/assets/images/background/page-title-5.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}><div className="auto-container"><h1 style={{ fontFamily: "'Cormorant',serif", color: "#fff" }}>Customer Reviews</h1></div></div>
      <div className="bredcrumb-wrap"><div className="auto-container"><ul className="bredcrumb-list"><li><Link to="/">Home</Link></li><li>Reviews</li></ul></div></div>
      <section className="section-padding">
        <div className="auto-container">
          {!loading && feedbacks.length > 0 && (<div style={{ background: "#fff", border: "1px solid #f0e8e2", borderRadius: 12, padding: 28, marginBottom: 40, display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap", boxShadow: "0 4px 16px rgba(0,0,0,.05)" }}>
            <div className="text-center"><div style={{ fontSize: 52, fontFamily: "'Cormorant',serif", fontWeight: 700, color: "var(--theme-color)", lineHeight: 1 }}>{avg}</div><div style={{ display: "flex", justifyContent: "center", gap: 3, margin: "8px 0" }}>{[1,2,3,4,5].map(s => <i key={s} className="fas fa-star" style={{ color: s <= Math.round(avg) ? "var(--theme-color)" : "#e2e2e2", fontSize: 18 }}/>)}</div><p style={{ color: "#888", fontFamily: "'DM Sans',sans-serif", fontSize: 13, margin: 0 }}>{feedbacks.length} reviews</p></div>
            <div style={{ flex: 1, minWidth: 200 }}>{[5,4,3,2,1].map(star => { const c = feedbacks.filter(r => Math.round(r.rating) === star).length; const p = feedbacks.length ? Math.round((c / feedbacks.length) * 100) : 0; return (<div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}><span style={{ color: "#888", fontFamily: "'DM Sans',sans-serif", fontSize: 13, width: 20 }}>{star}</span><i className="fas fa-star" style={{ color: "var(--theme-color)", fontSize: 12 }}/><div style={{ flex: 1, height: 6, background: "#f0e8e2", borderRadius: 3 }}><div style={{ width: `${p}%`, height: "100%", background: "var(--theme-color)", borderRadius: 3 }}/></div><span style={{ color: "#888", fontFamily: "'DM Sans',sans-serif", fontSize: 12, width: 24 }}>{c}</span></div>) })}
            </div>
          </div>)}
          {loading ? (<div className="text-center py-5"><div style={{ width: 44, height: 44, border: "4px solid rgba(199,122,99,.2)", borderTopColor: "#C77A63", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>)
          : feedbacks.length === 0 ? (<div style={{ textAlign: "center", padding: "80px 0" }}><div style={{ fontSize: 64, marginBottom: 16 }}>⭐</div><h4 style={{ fontFamily: "'Cormorant',serif" }}>No reviews yet</h4></div>)
          : (<div className="row g-4">{feedbacks.map((f, i) => (<div key={f._id || i} className="col-lg-4 col-md-6"><div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,.05)", border: "1px solid #f0e8e2", height: "100%" }}><div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[1,2,3,4,5].map(s => <i key={s} className="fas fa-star" style={{ color: s <= f.rating ? "var(--theme-color)" : "#e2e2e2", fontSize: 14 }}/>)}</div><p style={{ color: "#6b6b6b", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontStyle: "italic", lineHeight: 1.8, marginBottom: 6 }}>"{f.message}"</p>{f.review && <p style={{ color: "var(--theme-color)", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, marginBottom: 16 }}>— {f.review}</p>}<div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--theme-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 18 }}>{f.user?.name?.charAt(0)?.toUpperCase() || "G"}</div><div><p style={{ color: "#1a1a1a", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 15, margin: 0 }}>{f.user?.name || "Guest"}</p><p style={{ color: "#999", fontFamily: "'DM Sans',sans-serif", fontSize: 12, margin: 0 }}>{f.venue?.venue_type?.name || "Venue"}</p></div></div></div></div>))}</div>)}
        </div>
      </section>
    </div>
  )
}
