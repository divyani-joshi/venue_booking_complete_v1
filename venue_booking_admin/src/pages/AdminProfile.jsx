import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import { getProfile, updateProfile, changePassword } from "../services/api"
const BACKEND = "http://localhost:8000"
export default function AdminProfile({ setIsAuthenticated, adminName }) {
  const [profile, setProfile] = useState(null); const [loading, setLoading] = useState(true); const [tab, setTab] = useState("info"); const [saving, setSaving] = useState(false); const [changing, setChanging] = useState(false); const [imgFile, setImgFile] = useState(null); const [preview, setPreview] = useState(null); const [form, setForm] = useState({ name: "", phone: "", address: "" }); const [passForm, setPassForm] = useState({ newPassword: "", confirm: "" })
  const fetch = async () => { try { const r = await getProfile(); const d = r.data.data; setProfile(d); setForm({ name: d.name || "", phone: d.phone || "", address: d.address || "" }) } catch { toast.error("Failed") } finally { setLoading(false) } }
  useEffect(() => { fetch() }, [])
  const handleSave = async (e) => { e?.preventDefault(); setSaving(true); try { const fd = new FormData(); fd.append("name", form.name); fd.append("phone", form.phone); fd.append("address", form.address); if (imgFile) fd.append("profile_image", imgFile); const r = await updateProfile(fd); if (r.data.success) { toast.success("Profile updated!"); setImgFile(null); setPreview(null); fetch() } } catch (err) { toast.error(err.response?.data?.message || "Failed!") } finally { setSaving(false) } }
  const handlePass = async (e) => { e.preventDefault(); if (passForm.newPassword !== passForm.confirm) { toast.error("Don't match!"); return }; setChanging(true); try { const r = await changePassword({ email: profile.email, newPassword: passForm.newPassword }); if (r.data.success) { toast.success("Password changed!"); setPassForm({ newPassword: "", confirm: "" }) } } catch (err) { toast.error(err.response?.data?.message || "Failed!") } finally { setChanging(false) } }
  if (loading) return <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}><div className="text-center py-5"><div className="spinner-border text-primary" /></div></AdminLayout>
  const avatarSrc = preview ? preview : profile?.profile_image ? `${BACKEND}${profile.profile_image}` : null
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4"><h4 className="mb-0">My Profile</h4><p className="text-sm text-secondary mb-0">Manage your admin account details and password.</p></div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body text-center p-4">
              <div className="position-relative d-inline-block mb-3">
                {avatarSrc ? <img src={avatarSrc} alt="" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "3px solid #C77A63" }} onError={e => e.target.style.display = "none"}/> : <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#C77A63,#a8634e)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 36, margin: "0 auto" }}>{profile?.name?.charAt(0)?.toUpperCase()}</div>}
                <label htmlFor="admAv" style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#1a1a2e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, border: "2px solid #fff" }}>📷<input id="admAv" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)) } }}/></label>
              </div>
              <h5 className="font-weight-bolder mb-1">{profile?.name}</h5>
              <p className="text-sm text-secondary mb-0">Platform Administrator</p>
              <hr className="horizontal dark my-3"/>
              {[{ i: "ni ni-email-83", v: profile?.email }, { i: "ni ni-mobile-button", v: profile?.phone || "—" }, { i: "ni ni-pin-3", v: profile?.address || "—" }].map((x, i) => (<div key={i} className="d-flex align-items-center gap-2 mb-2 text-start"><i className={`${x.i} text-secondary text-sm`}/><p className="text-sm mb-0 text-secondary">{x.v}</p></div>))}
              {imgFile && <button onClick={handleSave} disabled={saving} className="btn btn-sm btn-outline-primary mt-3 w-100">{saving ? "Saving..." : "💾 Save Photo"}</button>}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header pb-0 d-flex gap-3">
              {[{ k: "info", l: "Account Info" }, { k: "password", l: "Change Password" }].map(t => (<button key={t.k} onClick={() => setTab(t.k)} className={`btn btn-sm mb-0 ${tab === t.k ? "btn-primary" : "btn-outline-secondary"}`}>{t.l}</button>))}
            </div>
            <div className="card-body">
              {tab === "info" && (<form onSubmit={handleSave}><div className="row g-3"><div className="col-md-6"><label className="form-label font-weight-bold text-xs text-uppercase">Full Name</label><input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></div><div className="col-md-6"><label className="form-label font-weight-bold text-xs text-uppercase">Phone</label><input type="tel" className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/></div><div className="col-12"><label className="form-label font-weight-bold text-xs text-uppercase">Address</label><textarea className="form-control" rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}/></div><div className="col-12"><label className="form-label font-weight-bold text-xs text-uppercase">Email <small className="text-secondary text-xs">(cannot change)</small></label><input type="email" className="form-control" value={profile?.email || ""} disabled style={{ background: "#f8f9fa" }}/></div></div><button type="submit" className="btn btn-primary btn-sm mt-3" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button></form>)}
              {tab === "password" && (<form onSubmit={handlePass}><div className="alert alert-info p-2 text-sm mb-3">New password must be at least 6 characters.</div><div className="mb-3"><label className="form-label font-weight-bold text-xs text-uppercase">New Password *</label><input type="password" className="form-control" value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} required minLength={6}/></div><div className="mb-3"><label className="form-label font-weight-bold text-xs text-uppercase">Confirm *</label><input type="password" className="form-control" value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} required/>{passForm.confirm && <small className={passForm.newPassword === passForm.confirm ? "text-success" : "text-danger"}>{passForm.newPassword === passForm.confirm ? "✓ Match" : "✗ Mismatch"}</small>}</div><button type="submit" className="btn btn-primary btn-sm" disabled={changing}>{changing ? "Updating..." : "Update Password"}</button></form>)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
