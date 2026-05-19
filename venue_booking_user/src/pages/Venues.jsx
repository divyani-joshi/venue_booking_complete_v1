import React, { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { getVenues, getCities, getOccasions, getVenueTypes } from "../services/api"

const BACKEND = "http://localhost:8000"

export default function Venues() {
  const [venues, setVenues] = useState([])
  const [cities, setCities] = useState([])
  const [occasions, setOccasions] = useState([])
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    city_id: searchParams.get("city_id") || "",
    occasion_id: searchParams.get("occasion_id") || "",
    venue_type_id: "",
    min_price: "",
    max_price: "",
  })
  const [nameSearch, setNameSearch] = useState("")

  const fetchVenues = async (f = filters) => {
    setLoading(true)
    try {
      const params = {}
      if (f.city_id) params.city_id = f.city_id
      if (f.occasion_id) params.occasion_id = f.occasion_id
      if (f.venue_type_id) params.venue_type_id = f.venue_type_id
      if (f.min_price) params.min_price = f.min_price
      if (f.max_price) params.max_price = f.max_price
      const r = await getVenues(params)
      setVenues(r.data.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    Promise.all([getCities(), getOccasions(), getVenueTypes()])
      .then(([cR, oR, tR]) => { setCities(cR.data.data || []); setOccasions(oR.data.data || []); setTypes(tR.data.data || []) })
      .catch(console.error)
    fetchVenues()
  }, [])

  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  const handleApply = () => { fetchVenues(filters) }
  const handleClear = () => {
    const empty = { city_id: "", occasion_id: "", venue_type_id: "", min_price: "", max_price: "" }
    setFilters(empty); setNameSearch(""); setSearchParams({}); fetchVenues(empty)
  }

  const filtered = venues.filter(v =>
    !nameSearch || v.description?.toLowerCase().includes(nameSearch.toLowerCase()) || v.venue_type?.name?.toLowerCase().includes(nameSearch.toLowerCase())
  )

  const sel = { width: "100%", padding: "9px 12px", border: "1px solid #e8e0dc", borderRadius: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: "none", background: "#fff" }

  return (
    <div className="page-wrapper">
      {/* Breadcrumb */}
      <div className="page-title" style={{ backgroundImage: "url(/assets/images/background/page-title-5.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="auto-container">
          <h1 style={{ fontFamily: "'Cormorant',serif", color: "#fff" }}>All Venues</h1>
        </div>
      </div>
      <div className="bredcrumb-wrap">
        <div className="auto-container">
          <ul className="bredcrumb-list">
            <li><Link to="/">Home</Link></li>
            <li>Venues</li>
          </ul>
        </div>
      </div>

      <section className="section-padding">
        <div className="auto-container">
          <div className="row g-5">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div style={{ background: "#fff", border: "1px solid #f0e8e2", borderRadius: 10, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.05)", position: "sticky", top: 90 }}>
                {/* Search */}
                <div style={{ marginBottom: 24 }}>
                  <h6 style={{ fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid var(--theme-color)" }}>Search</h6>
                  <input type="text" placeholder="Search venues..." value={nameSearch} onChange={e => setNameSearch(e.target.value)}
                    style={{ ...sel, padding: "9px 12px" }} />
                </div>

                {/* City */}
                <div style={{ marginBottom: 20 }}>
                  <h6 style={{ fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid var(--theme-color)" }}>City</h6>
                  <button onClick={() => setF("city_id", "")} style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 4, border: "none", background: !filters.city_id ? "rgba(199,122,99,.1)" : "none", color: !filters.city_id ? "var(--theme-color)" : "#666", cursor: "pointer", fontSize: 13, fontWeight: !filters.city_id ? 700 : 400, fontFamily: "'DM Sans',sans-serif" }}>
                    All Cities
                  </button>
                  {cities.map(c => (
                    <button key={c._id} onClick={() => setF("city_id", c._id)}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 4, border: "none", background: filters.city_id === c._id ? "rgba(199,122,99,.1)" : "none", color: filters.city_id === c._id ? "var(--theme-color)" : "#666", cursor: "pointer", fontSize: 13, fontWeight: filters.city_id === c._id ? 700 : 400, fontFamily: "'DM Sans',sans-serif" }}>
                      <i className="fas fa-angle-right me-1" style={{ color: "var(--theme-color)", fontSize: 10 }} />{c.name}
                    </button>
                  ))}
                </div>

                {/* Occasion */}
                <div style={{ marginBottom: 20 }}>
                  <h6 style={{ fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid var(--theme-color)" }}>Occasion</h6>
                  <select value={filters.occasion_id} onChange={e => setF("occasion_id", e.target.value)} style={sel}>
                    <option value="">All Occasions</option>
                    {occasions.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                  </select>
                </div>

                {/* Venue Type */}
                <div style={{ marginBottom: 20 }}>
                  <h6 style={{ fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid var(--theme-color)" }}>Venue Type</h6>
                  <select value={filters.venue_type_id} onChange={e => setF("venue_type_id", e.target.value)} style={sel}>
                    <option value="">All Types</option>
                    {types.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>

                {/* Price Range */}
                <div style={{ marginBottom: 24 }}>
                  <h6 style={{ fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid var(--theme-color)" }}>Price Range / Day</h6>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="number" placeholder="Min ₹" value={filters.min_price} onChange={e => setF("min_price", e.target.value)} style={{ ...sel, flex: 1 }} />
                    <input type="number" placeholder="Max ₹" value={filters.max_price} onChange={e => setF("max_price", e.target.value)} style={{ ...sel, flex: 1 }} />
                  </div>
                </div>

                <button onClick={handleApply} className="btn-1" style={{ width: "100%", textAlign: "center" }}>Apply Filter <span></span></button>
                {(filters.city_id || filters.occasion_id || filters.venue_type_id || filters.min_price || filters.max_price || nameSearch) && (
                  <button onClick={handleClear} style={{ width: "100%", marginTop: 8, padding: "9px", background: "#f9f6f4", border: "1px solid #e8e0dc", borderRadius: 4, color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            <div className="col-lg-9">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 14, margin: 0 }}>
                  Showing <strong style={{ color: "var(--theme-color)" }}>{filtered.length}</strong> venue{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div style={{ width: 44, height: 44, border: "4px solid rgba(199,122,99,.2)", borderTopColor: "#C77A63", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🏛️</div>
                  <h4 style={{ fontFamily: "'Cormorant',serif" }}>No venues found</h4>
                  <p style={{ color: "#888", fontFamily: "'DM Sans',sans-serif" }}>Try adjusting your filters</p>
                </div>
              ) : (
                <div className="row g-4">
                  {filtered.map(v => (
                    <div key={v._id} className="col-md-6">
                      <div className="room-1-block" style={{ boxShadow: "0 4px 20px rgba(0,0,0,.07)", transition: "all .3s" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                        <div className="room-1-image hvr-img-zoom-1" style={{ height: 220, overflow: "hidden", position: "relative" }}>
                          {v.image ? (
                            <img src={`${BACKEND}${v.image}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#f8f0ec,#f0e8e2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>🏛️</div>
                          )}
                          <div style={{ position: "absolute", top: 12, left: 12 }}>
                            <span style={{ background: "var(--theme-color)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{v.status || "Active"}</span>
                          </div>
                        </div>
                        <div className="room-1-content">
                          <p className="room-1-meta-info">From <span className="theme-color">₹{v.price?.toLocaleString("en-IN")}</span> / event</p>
                          <h4 className="room-1-title mb_20">
                            <Link to={`/venues/${v._id}`}>{v.venue_type?.name || "Event Venue"}</Link>
                          </h4>
                          <p className="room-1-text mb_20" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.description}</p>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                            {v.city?.name && <span style={{ background: "rgba(199,122,99,.08)", color: "var(--theme-color)", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>📍 {v.city.name}</span>}
                            {v.occasion?.name && <span style={{ background: "rgba(199,122,99,.08)", color: "var(--theme-color)", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>🎉 {v.occasion.name}</span>}
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
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
