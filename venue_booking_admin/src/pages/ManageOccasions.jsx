import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminOccasions, addOccasion, updateOccasion, deleteOccasion } from "../services/api"
export default function ManageOccasions({ setIsAuthenticated, adminName }) {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [modal, setModal] = useState(false); const [editing, setEditing] = useState(null); const [name, setName] = useState(""); const [saving, setSaving] = useState(false)
  const fetch = async () => { setLoading(true); try { const r = await getAdminOccasions(); setItems(r.data.data || []) } catch { toast.error("Failed") } finally { setLoading(false) } }
  useEffect(() => { fetch() }, [])
  const openAdd = () => { setEditing(null); setName(""); setModal(true) }
  const openEdit = (o) => { setEditing(o); setName(o.name); setModal(true) }
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { const r = editing ? await updateOccasion({ id: editing._id, name }) : await addOccasion({ name }); if (r.data.success) { toast.success(editing ? "Updated!" : "Added!"); setModal(false); fetch() } } catch (err) { toast.error(err.response?.data?.message || "Failed!") } finally { setSaving(false) } }
  const handleDelete = async (id) => { if (!window.confirm("Delete?")) return; try { const r = await deleteOccasion(id); if (r.data.success) { toast.success("Deleted!"); fetch() } } catch (err) { toast.error(err.response?.data?.message || "Failed!") } }
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4"><h4 className="mb-0">Manage Occasions</h4><p className="text-sm text-secondary mb-0">Add occasion types like Wedding, Conference, Birthday, etc.</p></div>
      <DataTable title="All Occasions" columns={["Name", "Created", "Actions"]} data={items} loading={loading} searchKeys={["name"]} emptyMessage="No occasions yet."
        headerAction={<button className="btn btn-sm btn-primary mb-0" onClick={openAdd}>+ Add Occasion</button>}
        renderRow={(o, idx) => (<tr key={o._id}><td className="ps-4"><p className="text-xs font-weight-bold mb-0">{idx}</p></td><td><p className="text-xs font-weight-bold mb-0">{o.name}</p></td><td><p className="text-xs text-secondary mb-0">{o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN") : "—"}</p></td><td><button className="btn btn-link btn-sm mb-0 text-primary p-0 me-2" onClick={() => openEdit(o)}>Edit</button><button className="btn btn-link btn-sm mb-0 text-danger p-0" onClick={() => handleDelete(o._id)}>Delete</button></td></tr>)}
      />
      {modal && (<div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}><div className="modal-dialog modal-dialog-centered modal-sm"><div className="modal-content"><div className="modal-header"><h5 className="modal-title">{editing ? "Edit Occasion" : "Add Occasion"}</h5><button type="button" className="btn-close" onClick={() => setModal(false)} /></div><form onSubmit={handleSubmit}><div className="modal-body"><div className="mb-3"><label className="form-label font-weight-bold text-xs text-uppercase">Occasion Name *</label><input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Wedding, Conference..." required /></div></div><div className="modal-footer"><button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setModal(false)}>Cancel</button><button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add"}</button></div></form></div></div></div>)}
    </AdminLayout>
  )
}
