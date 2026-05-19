import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getAdminFeedbacks } from "../services/api";
export default function ManageFeedbacks({ setIsAuthenticated, adminName }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  useEffect(() => {
    setLoading(true);
    getAdminFeedbacks()
      .then((r) => setItems(r.data.data || []))
      .catch(() => toast.error("Failed"))
      .finally(() => setLoading(false));
  }, []);
  const avg = items.length
    ? (items.reduce((s, f) => s + f.rating, 0) / items.length).toFixed(1)
    : 0;
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="mb-0">Manage Feedbacks</h4>
        <p className="text-sm text-secondary mb-0">
          Review customer feedback and ratings for venues.
        </p>
      </div>
      {!loading && items.length > 0 && (
        <div className="row g-3 mb-4">
          {[
            { l: "Total Reviews", v: items.length, c: "#7928CA" },
            { l: "Average Rating", v: `${avg} / 5 ★`, c: "#C77A63" },
            {
              l: "5 Star Reviews",
              v: items.filter((f) => f.rating === 5).length,
              c: "#2dce89",
            },
          ].map((s) => (
            <div key={s.l} className="col-md-4">
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="text-end pt-1">
                    <p className="text-sm mb-0">{s.l}</p>
                    <h5 className="mb-0" style={{ color: s.c }}>
                      {s.v}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <DataTable
        title="All Feedbacks"
        columns={[
          "User",
          "Venue",
          "Rating",
          "Review",
          "Message",
          "Date",
          "Actions",
        ]}
        data={items}
        loading={loading}
        searchKeys={["user.name", "review", "message"]}
        emptyMessage="No feedbacks yet."
        renderRow={(f, idx) => (
          <tr key={f._id}>
            <td className="ps-4">
              <p className="text-xs font-weight-bold mb-0">{idx}</p>
            </td>
            <td>
              <div className="px-2">
                <h6 className="mb-0 text-sm">{f.user?.name || "Guest"}</h6>
                <p className="text-xs text-secondary mb-0">{f.user?.email}</p>
              </div>
            </td>
            <td>
              <p className="text-xs mb-0">
                {f.venue?.venue_type?.name ||
                  f.venue?.description?.slice(0, 20) ||
                  "—"}
              </p>
            </td>
            <td>
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <i
                    key={s}
                    className="fas fa-star"
                    style={{
                      color: s <= f.rating ? "#C77A63" : "#e2e2e2",
                      fontSize: 10,
                    }}
                  />
                ))}
              </div>
              <p
                className="text-xs font-weight-bold mb-0 mt-1"
                style={{ color: "#C77A63" }}
              >
                {f.rating}/5
              </p>
            </td>
            <td>
              <p className="text-xs mb-0">{f.review || "—"}</p>
            </td>
            <td>
              <p
                className="text-xs text-secondary mb-0"
                style={{
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {f.message}
              </p>
            </td>
            <td>
              <p className="text-xs text-secondary mb-0">
                {f.created_at
                  ? new Date(f.created_at).toLocaleDateString("en-IN")
                  : "—"}
              </p>
            </td>
            <td>
              <button
                className="btn btn-link btn-sm mb-0 text-info p-0"
                onClick={() => setDetail(f)}
              >
                View
              </button>
            </td>
          </tr>
        )}
      />
      {detail && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Feedback Detail</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDetail(null)}
                />
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#C77A63,#a8634e)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 20,
                    }}
                  >
                    {detail.user?.name?.charAt(0)?.toUpperCase() || "G"}
                  </div>
                  <div>
                    <h6 className="mb-0">{detail.user?.name || "Guest"}</h6>
                    <p className="text-xs text-secondary mb-0">
                      {detail.user?.email}
                    </p>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-xs text-uppercase font-weight-bolder text-secondary">
                    Venue
                  </label>
                  <p className="text-sm mb-0">
                    {detail.venue?.venue_type?.name || "—"}
                  </p>
                </div>
                <div className="mb-3">
                  <label className="form-label text-xs text-uppercase font-weight-bolder text-secondary">
                    Rating
                  </label>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i
                        key={s}
                        className="fas fa-star"
                        style={{
                          color: s <= detail.rating ? "#C77A63" : "#e2e2e2",
                          fontSize: 18,
                        }}
                      />
                    ))}
                    <span
                      className="ms-2 text-sm font-weight-bold"
                      style={{ color: "#C77A63" }}
                    >
                      {detail.rating}/5
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-xs text-uppercase font-weight-bolder text-secondary">
                    Short Review
                  </label>
                  <p className="text-sm mb-0 font-weight-bold">
                    {detail.review || "—"}
                  </p>
                </div>
                <div className="mb-3">
                  <label className="form-label text-xs text-uppercase font-weight-bolder text-secondary">
                    Full Message
                  </label>
                  <p
                    className="text-sm mb-0"
                    style={{ fontStyle: "italic", color: "#555" }}
                  >
                    "{detail.message}"
                  </p>
                </div>
                <div>
                  <label className="form-label text-xs text-uppercase font-weight-bolder text-secondary">
                    Date
                  </label>
                  <p className="text-sm mb-0">
                    {detail.created_at
                      ? new Date(detail.created_at).toLocaleDateString("en-IN")
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setDetail(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
