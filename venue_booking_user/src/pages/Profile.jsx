import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { getProfile, updateProfile, changePassword } from "../services/api"
const BACKEND = "http://localhost:8000"
export default function Profile({ setUserData }) {
  const [profile, setProfile] = useState(null); const [loading, setLoading] = useState(true); const [tab, setTab] = useState("info"); const [saving, setSaving] = useState(false); const [changing, setChanging] = useState(false); const [imgFile, setImgFile] = useState(null); const [preview, setPreview] = useState(null); const [form, setForm] = useState({ name: "", phone: "", address: "" }); const [passForm, setPassForm] = useState({ newPassword: "", confirm: "" })
  const inp = { width: "100%", padding: "11px 14px", border: "1px solid #e8e0dc", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }
  const fetch = async () => { try { const r = await getProfile(); const d = r.data.data; setProfile(d); setForm({ name: d.name||"", phone: d.phone||"", address: d.address||"" }) } catch { toast.error("Failed") } finally { setLoading(false) } }
  useEffect(() => { fetch() }, [])
  const handleSave = async (e) => { e?.preventDefault(); setSaving(true); try { const fd = new FormData(); fd.append("name", form.name); fd.append("phone", form.phone); fd.append("address", form.address); if (imgFile) fd.append("profile_image", imgFile); const r = await updateProfile(fd); if (r.data.success) { toast.success("Profile updated!"); setImgFile(null); setPreview(null); fetch(); setUserData(p => ({ ...p, name: form.name })) } } catch (err) { toast.error(err.response?.data?.message || "Failed!") } finally { setSaving(false) } }
  const handlePass = async (e) => { e.preventDefault(); if (passForm.newPassword !== passForm.confirm) { toast.error("Don't match!"); return }; setChanging(true); try { const r = await changePassword({ email: profile.email, newPassword: passForm.newPassword }); if (r.data.success) { toast.success("Password changed!"); setPassForm({ newPassword: "", confirm: "" }) } } catch (err) { toast.error(err.response?.data?.message || "Failed!") } finally { setChanging(false) } }
  const avatarSrc = preview ? preview : profile?.profile_image ? `${BACKEND}${profile.profile_image}` : null
  if (loading) return <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 44, height: 44, border: "4px solid rgba(199,122,99,.2)", borderTopColor: "#C77A63", borderRadius: "50%", animation: "spin .8s linear infinite" }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
  return (
    <div className="page-wrapper">
      <div className="page-title" style={{ backgroundImage: "url(/assets/images/background/page-title-5.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}><div className="auto-container"><h1 style={{ fontFamily: "'Cormorant',serif", color: "#fff" }}>My Profile</h1></div></div>
      <div className="bredcrumb-wrap"><div className="auto-container"><ul className="bredcrumb-list"><li><Link to="/">Home</Link></li><li>Profile</li></ul></div></div>
      <section className="section-padding"><div className="auto-container"><div className="row g-5">
        <div className="col-lg-4">
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.06)", border: "1px solid #f0e8e2" }}>
            <div style={{ background: "var(--theme-color)", padding: "32px 20px", textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
                {avatarSrc ? <img src={avatarSrc} alt="" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid #fff" }} onError={e => e.target.style.display = "none"}/> : <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant',serif", fontWeight: 700, fontSize: 36, color: "var(--theme-color)", margin: "0 auto" }}>{profile?.name?.charAt(0)?.toUpperCase()}</div>}
                <label htmlFor="av" style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "#1a1a2e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11, border: "2px solid #fff" }}>📷<input id="av" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)) } }}/></label>
              </div>
              <h4 style={{ color: "#fff", fontFamily: "'Cormorant',serif", fontWeight: 700, marginBottom: 2 }}>{profile?.name}</h4>
              <p style={{ color: "rgba(255,255,255,.8)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, margin: 0 }}>VenueBook Member</p>
            </div>
            <div style={{ padding: 20 }}>
              {[{ i: "fas fa-envelope", l: "Email", v: profile?.email }, { i: "fas fa-phone", l: "Phone", v: profile?.phone }, { i: "fas fa-map-marker-alt", l: "Address", v: profile?.address }].map(x => (<div key={x.l} style={{ display: "flex", gap: 10, marginBottom: 14 }}><i className={x.i} style={{ color: "var(--theme-color)", marginTop: 2, flexShrink: 0, width: 16 }}/><div><p style={{ color: "#aaa", fontSize: 11, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{x.l}</p><p style={{ color: "#1a1a1a", fontSize: 13, fontWeight: 600, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{x.v || "—"}</p></div></div>))}
              <Link to="/my-bookings" className="btn-1 btn-alt" style={{ display: "block", textAlign: "center", marginTop: 12 }}>My Bookings <span></span></Link>
              {imgFile && <button onClick={handleSave} disabled={saving} style={{ width: "100%", marginTop: 8, padding: "9px", background: "rgba(199,122,99,.08)", color: "var(--theme-color)", border: "1px solid rgba(199,122,99,.3)", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13 }}>{saving ? "Saving..." : "Save Photo"}</button>}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.06)", border: "1px solid #f0e8e2" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #f0e8e2" }}>
              {[{ k: "info", l: "Account Info" }, { k: "password", l: "Change Password" }].map(t => (<button key={t.k} onClick={() => setTab(t.k)} style={{ flex: 1, padding: "16px 20px", border: "none", background: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: tab === t.k ? 700 : 500, color: tab === t.k ? "var(--theme-color)" : "#888", borderBottom: tab === t.k ? "3px solid var(--theme-color)" : "3px solid transparent", fontSize: 14, transition: "all .2s" }}>{t.l}</button>))}
            </div>
            <div style={{ padding: 28 }}>
              {tab === "info" && (<form onSubmit={handleSave}><div className="row g-3"><div className="col-md-6"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Full Name</label><input type="text" style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></div><div className="col-md-6"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Phone</label><input type="tel" style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/></div><div className="col-12"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Address</label><textarea rows={2} style={{ ...inp, resize: "vertical" }} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}/></div><div className="col-12"><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Email <span style={{ color: "#aaa", fontWeight: 400, fontSize: 11 }}>(cannot change)</span></label><div style={{ ...inp, color: "#aaa", background: "#f9f6f4", cursor: "not-allowed" }}>{profile?.email}</div></div></div><button type="submit" className="btn-1 btn-alt" style={{ marginTop: 20 }} disabled={saving}>{saving ? "Saving..." : "Save Changes"} <span></span></button></form>)}
              {tab === "password" && (<form onSubmit={handlePass}><div style={{ background: "#fdf8f5", border: "1px solid rgba(199,122,99,.2)", borderRadius: 6, padding: 12, marginBottom: 20, fontSize: 13, color: "#8b5e4a", fontFamily: "'DM Sans',sans-serif" }}>⚠️ New password must be at least 6 characters.</div><div style={{ marginBottom: 14 }}><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>New Password *</label><input type="password" style={inp} value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} required minLength={6}/></div><div style={{ marginBottom: 24 }}><label style={{ color: "#1a1a1a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Confirm *</label><input type="password" style={inp} value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} required/>{passForm.confirm && <small style={{ color: passForm.newPassword === passForm.confirm ? "#16a34a" : "#dc2626", fontSize: 12, marginTop: 4, display: "block" }}>{passForm.newPassword === passForm.confirm ? "✓ Match" : "✗ Mismatch"}</small>}</div><button type="submit" className="btn-1 btn-alt" disabled={changing}>{changing ? "Updating..." : "Update Password"} <span></span></button></form>)}
            </div>
          </div>
        </div>
      </div></div></section>
    </div>
  )
}
