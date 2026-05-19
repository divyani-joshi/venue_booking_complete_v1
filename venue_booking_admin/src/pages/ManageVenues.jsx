import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import {
  getAdminVenues,
  addVenue,
  updateVenue,
  deleteVenue,
  getAdminCities,
  getAdminOccasions,
  getAdminVenueTypes,
} from "../services/api";

const BACKEND = "http://localhost:8000";

export default function ManageVenues({ setIsAuthenticated, adminName }) {
  const [items, setItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    occasion_id: "",
    venue_type_id: "",
    city_id: "",
    description: "",
    price: "",
    status: "Active",
  });
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [vR, cR, oR, tR] = await Promise.all([
        getAdminVenues(),
        getAdminCities(),
        getAdminOccasions(),
        getAdminVenueTypes(),
      ]);
      setItems(vR.data.data || []);
      setCities(cR.data.data || []);
      setOccasions(oR.data.data || []);
      setTypes(tR.data.data || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      occasion_id: "",
      venue_type_id: "",
      city_id: "",
      description: "",
      price: "",
      status: "Active",
    });
    setImgFile(null);
    setPreview(null);
    setModal(true);
  };
  const openEdit = (v) => {
    setEditing(v);
    setForm({
      occasion_id: v.occasion_id || "",
      venue_type_id: v.venue_type_id || "",
      city_id: v.city_id || "",
      description: v.description || "",
      price: v.price || "",
      status: v.status || "Active",
    });
    setImgFile(null);
    setPreview(null);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.occasion_id || !form.venue_type_id || !form.city_id) {
      toast.error("Select city, occasion & type");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form.price || isNaN(form.price)) {
      toast.error("Valid price required");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      if (editing) fd.append("id", editing._id);
      fd.append("occasion_id", form.occasion_id);
      fd.append("venue_type_id", form.venue_type_id);
      fd.append("city_id", form.city_id);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("status", form.status);
      if (imgFile) fd.append("image", imgFile);
      const r = editing ? await updateVenue(fd) : await addVenue(fd);
      if (r.data.success) {
        toast.success(editing ? "Venue updated!" : "Venue added!");
        setModal(false);
        fetchAll();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this venue?")) return;
    try {
      const r = await deleteVenue(id);
      if (r.data.success) {
        toast.success("Deleted!");
        fetchAll();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    }
  };

  const sel = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #d2d6da",
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "'Open Sans',sans-serif",
    outline: "none",
    background: "#fff",
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="mb-0">Manage Venues</h4>
        <p className="text-sm text-secondary mb-0">
          Add, edit or remove venue listings with images and details.
        </p>
      </div>

      <DataTable
        title="All Venues"
        columns={[
          "Image",
          "Type",
          "City",
          "Occasion",
          "Price/Day",
          "Status",
          "Actions",
        ]}
        data={items}
        loading={loading}
        searchKeys={[
          "description",
          "city.name",
          "occasion.name",
          "venue_type.name",
        ]}
        emptyMessage="No venues yet. Add one!"
        headerAction={
          <button className="btn btn-sm btn-primary mb-0" onClick={openAdd}>
            + Add Venue
          </button>
        }
        renderRow={(v, idx) => (
          <tr key={v._id}>
            <td className="ps-4">
              <p className="text-xs font-weight-bold mb-0">{idx}</p>
            </td>
            <td>
              <div
                style={{
                  width: 52,
                  height: 40,
                  borderRadius: 6,
                  overflow: "hidden",
                  background: "#f8f0ec",
                }}
              >
                {v.image ? (
                  <img
                    src={`${BACKEND}${v.image}`}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    🏛️
                  </div>
                )}
              </div>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">
                {v.venue_type?.name || "—"}
              </p>
              <p
                className="text-xs text-secondary mb-0"
                style={{
                  maxWidth: 160,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {v.description}
              </p>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">
                {v.city?.name || "—"}
              </p>
            </td>
            <td>
              <p className="text-xs mb-0">{v.occasion?.name || "—"}</p>
            </td>
            <td>
              <p
                className="text-xs font-weight-bold mb-0"
                style={{ color: "#C77A63" }}
              >
                ₹{v.price?.toLocaleString("en-IN")}
              </p>
            </td>
            <td>
              <span
                className={`text-xs font-weight-bold mb-0 ${v.status === "Active" ? "text-success" : "text-danger"}`}
              >
                {v.status}
              </span>
            </td>
            <td>
              <button
                className="btn btn-link btn-sm mb-0 text-primary p-0 me-2"
                onClick={() => openEdit(v)}
              >
                Edit
              </button>
              <button
                className="btn btn-link btn-sm mb-0 text-danger p-0"
                onClick={() => handleDelete(v._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        )}
      />

      {/* Modal */}
      {modal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? "Edit Venue" : "Add New Venue"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModal(false)}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Selects */}
                    <div className="col-md-4">
                      <label className="form-label font-weight-bold text-xs text-uppercase">
                        City *
                      </label>
                      <select
                        style={sel}
                        value={form.city_id}
                        onChange={(e) =>
                          setForm({ ...form, city_id: e.target.value })
                        }
                        required
                      >
                        <option value="">Select City</option>
                        {cities
                          .filter((c) => c.status === "Active" || !c.status)
                          .map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label font-weight-bold text-xs text-uppercase">
                        Occasion *
                      </label>
                      <select
                        style={sel}
                        value={form.occasion_id}
                        onChange={(e) =>
                          setForm({ ...form, occasion_id: e.target.value })
                        }
                        required
                      >
                        <option value="">Select Occasion</option>
                        {occasions.map((o) => (
                          <option key={o._id} value={o._id}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label font-weight-bold text-xs text-uppercase">
                        Venue Type *
                      </label>
                      <select
                        style={sel}
                        value={form.venue_type_id}
                        onChange={(e) =>
                          setForm({ ...form, venue_type_id: e.target.value })
                        }
                        required
                      >
                        <option value="">Select Type</option>
                        {types.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label font-weight-bold text-xs text-uppercase">
                        Price per Day (₹) *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        placeholder="e.g. 25000"
                        required
                        min={1}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label font-weight-bold text-xs text-uppercase">
                        Status
                      </label>
                      <select
                        style={sel}
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label font-weight-bold text-xs text-uppercase">
                        Description *
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Describe this venue — location details, capacity, amenities, etc."
                        required
                      />
                    </div>
                    {/* Image */}
                    <div className="col-12">
                      <label className="form-label font-weight-bold text-xs text-uppercase">
                        Venue Image
                        {editing ? " (leave blank to keep current)" : " *"}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (f) {
                            setImgFile(f);
                            setPreview(URL.createObjectURL(f));
                          }
                        }}
                      />
                      {preview && (
                        <img
                          src={preview}
                          alt=""
                          style={{
                            marginTop: 10,
                            height: 120,
                            borderRadius: 6,
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {!preview && editing?.image && (
                        <div style={{ marginTop: 10 }}>
                          <img
                            src={`${BACKEND}${editing.image}`}
                            alt=""
                            style={{
                              height: 100,
                              borderRadius: 6,
                              objectFit: "cover",
                            }}
                            onError={(e) => (e.target.style.display = "none")}
                          />
                          <p className="text-xs text-secondary mt-1">
                            Current image
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
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
                    {saving
                      ? "Saving..."
                      : editing
                        ? "Update Venue"
                        : "Add Venue"}
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
