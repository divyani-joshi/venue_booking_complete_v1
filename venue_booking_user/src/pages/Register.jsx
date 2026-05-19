import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { signup } from "../services/api"
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "", address: "" }); const [loading, setLoading] = useState(false); const navigate = useNavigate()
  const inp = { width: "100%", padding: "11px 14px", border: "1px solid #e8e0dc", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error("Passwords don't match!"); return }
    if (form.password.length < 6) { toast.error("Password min 6 chars!"); return }
    setLoading(true)
    try {
      const r = await signup({ name: form.name, email: form.email, phone: form.phone, password: form.password, address: form.address })
      if (r.data.success) { toast.success("Account created! Please login."); navigate("/login") }
    } catch (err) { toast.error(err.response?.data?.message || "Registration failed!") } finally { setLoading(false) }
  }
  return (
    <div className="page-wrapper" style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f6f4", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 8px 40px rgba(0,0,0,.08)", overflow: "hidden", border: "1px solid #f0e8e2" }}>
          <div style={{ background: "var(--theme-color)", padding: "24px 32px" }}>
            <div style={{ fontFamily: "'Cormorant',serif", color: "#fff", fontWeight: 700, fontSize: 22, marginBottom: 4 }}>🏛️ Create Account</div>
            <p style={{ color: "rgba(255,255,255,.85)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, margin: 0 }}>Join VenueBook and start booking today!</p>
          </div>
          <div style={{ padding: 32 }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {[{ f: "name", l: "Full Name", t: "text", ph: "Enter your name " }, { f: "email", l: "Email", t: "email", ph: "enter your email" }].map(x => (
                  <div key={x.f} className="col-12"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>{x.l} *</label>
                    <input type={x.t} style={inp} placeholder={x.ph} value={form[x.f]} onChange={e => setForm({ ...form, [x.f]: e.target.value })} required /></div>
                ))}
                <div className="col-12"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block", width: "100%" }}>Phone *</label><input type="tel" pattern="[0-9]{10}" minLength="10" maxLength="10" style={inp} placeholder="Enter Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required minLength={6} /></div>
                <div className="col-12"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Address *</label><textarea rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Your full address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required /></div>
                <div className="col-6"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Password *</label><input type="password" style={inp} placeholder="Enter password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>
                <div className="col-6"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Confirm *</label><input type="password" style={inp} placeholder="Repeat Password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />{form.confirm && <small style={{ color: form.password === form.confirm ? "#16a34a" : "#dc2626", fontSize: 11 }}>{form.password === form.confirm ? "✓ Match" : "✗ Mismatch"}</small>}</div>
              </div>
              <button type="submit" className="btn-1" style={{ width: "100%", textAlign: "center", marginTop: 20 }} disabled={loading}>{loading ? "Creating..." : "Create Account"} <span></span></button>
            </form>
            <p style={{ color: "#888", textAlign: "center", marginTop: 20, fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>Have account? <Link to="/login" style={{ color: "var(--theme-color)", fontWeight: 700 }}>Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
