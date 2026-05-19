import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import {
  getAdminCities,
  addCity,
  updateCity,
  deleteCity,
} from "../services/api";
export default function ManageCities({ setIsAuthenticated, adminName }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", status: "Active" });
  const [saving, setSaving] = useState(false);
  const fetch = async () => {
    setLoading(true);
    try {
      const r = await getAdminCities();
      setItems(r.data.data || []);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", status: "Active" });
    setModal(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, status: c.status || "Active" });
    setModal(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = editing
        ? await updateCity({
            id: editing._id,
            name: form.name,
            status: form.status,
          })
        : await addCity({ name: form.name });
      if (r.data.success) {
        toast.success(editing ? "Updated!" : "Added!");
        setModal(false);
        fetch();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this city?")) return;
    try {
      const r = await deleteCity(id);
      if (r.data.success) {
        toast.success("Deleted!");
        fetch();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    }
  };
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="mb-0">Manage Cities</h4>
        <p className="text-sm text-secondary mb-0">
          Add and manage city locations for venue filtering.
        </p>
      </div>
      <DataTable
        title="All Cities"
        columns={["Name", "Status", "Created", "Actions"]}
        data={items}
        loading={loading}
        searchKeys={["name", "status"]}
        emptyMessage="No cities yet."
        headerAction={
          <button className="btn btn-sm btn-primary mb-0" onClick={openAdd}>
            + Add City
          </button>
        }
        renderRow={(c, idx) => (
          <tr key={c._id}>
            <td className="ps-4">
              <p className="text-xs font-weight-bold mb-0">{idx}</p>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">{c.name}</p>
            </td>
            <td>
              <span
                className={`text-xs font-weight-bold mb-0${c.status === "Active" ? " text-success" : " text-danger"}`}
              >
                {c.status || "Active"}
              </span>
            </td>
            <td>
              <p className="text-xs text-secondary mb-0">
                {c.created_at
                  ? new Date(c.created_at).toLocaleDateString("en-IN")
                  : "—"}
              </p>
            </td>
            <td>
              <button
                className="btn btn-link btn-sm mb-0 text-primary p-0 me-2"
                onClick={() => openEdit(c)}
              >
                Edit
              </button>
              <button
                className="btn btn-link btn-sm mb-0 text-danger p-0"
                onClick={() => handleDelete(c._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        )}
      />
      {modal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? "Edit City" : "Add City"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModal(false)}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label font-weight-bold text-xs text-uppercase">
                      City Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. Ahmedabad"
                      required
                    />
                  </div>
                  {editing && (
                    <div className="mb-3">
                      <label className="form-label font-weight-bold text-xs text-uppercase">
                        Status
                      </label>
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : editing ? "Update" : "Add City"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
