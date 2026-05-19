import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getAdminBookings, updateBooking } from "../services/api";

const BACKEND = "http://localhost:8000";

export default function ManageBookings({ setIsAuthenticated, adminName }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [detailModal, setDetailModal] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await getAdminBookings();
      setItems(r.data.data || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  const openStatus = (b) => {
    setStatusModal(b);
    setNewStatus(b.booking_status);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const r = await updateBooking({
        id: statusModal._id,
        booking_status: newStatus,
      });
      if (r.data.success) {
        toast.success("Status updated!");
        setStatusModal(null);
        fetch();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    } finally {
      setUpdating(false);
    }
  };

  const bkBadge = (s) => {
    const m = {
      Pending: { bg: "#fef9c3", c: "#a16207" },
      Approved: { bg: "#dcfce7", c: "#15803d" },
      Cancelled: { bg: "#fee2e2", c: "#dc2626" },
    };
    const st = m[s] || { bg: "#f3f4f6", c: "#374151" };
    return (
      <span
        style={{
          background: st.bg,
          color: st.c,
          fontSize: 10,
          fontWeight: 700,
          padding: "3px 8px",
          borderRadius: 20,
          whiteSpace: "nowrap",
        }}
      >
        {s}
      </span>
    );
  };
  const payBadge = (s) => {
    const m = {
      Done: { bg: "#dcfce7", c: "#15803d" },
      Pending: { bg: "#fef9c3", c: "#a16207" },
      Cancelled: { bg: "#fee2e2", c: "#dc2626" },
    };
    const st = m[s] || { bg: "#fef9c3", c: "#a16207" };
    return (
      <span
        style={{
          background: st.bg,
          color: st.c,
          fontSize: 10,
          fontWeight: 700,
          padding: "3px 8px",
          borderRadius: 20,
        }}
      >
        {s || "Pending"}
      </span>
    );
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="mb-0">Manage Bookings</h4>
        <p className="text-sm text-secondary mb-0">
          Review and approve or cancel venue reservation requests.
        </p>
      </div>

      {/* Summary chips */}
      {!loading && (
        <div className="row g-3 mb-4">
          {[
            { label: "Total", value: items.length, color: "#7928CA" },
            {
              label: "Pending",
              value: items.filter((b) => b.booking_status === "Pending").length,
              color: "#fb6340",
            },
            {
              label: "Approved",
              value: items.filter((b) => b.booking_status === "Approved")
                .length,
              color: "#2dce89",
            },
            {
              label: "Cancelled",
              value: items.filter((b) => b.booking_status === "Cancelled")
                .length,
              color: "#f5365c",
            },
            {
              label: "Paid",
              value: items.filter((b) => b.payment_status === "Done").length,
              color: "#C77A63",
            },
          ].map((s) => (
            <div key={s.label} className="col-auto">
              <div
                style={{
                  background: "#fff",
                  border: `2px solid ${s.color}20`,
                  borderRadius: 8,
                  padding: "8px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: s.color, fontWeight: 700, fontSize: 20 }}>
                  {s.value}
                </span>
                <span
                  style={{
                    color: "#888",
                    fontSize: 12,
                    fontFamily: "'Open Sans',sans-serif",
                  }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <DataTable
        title="All Bookings"
        columns={[
          "Customer",
          "Venue",
          "Dates",
          "Amount",
          "Booking Status",
          "Payment",
          "Actions",
        ]}
        data={items}
        loading={loading}
        searchKeys={[
          "user.name",
          "user.email",
          "booking_status",
          "payment_status",
        ]}
        emptyMessage="No bookings yet."
        renderRow={(b, idx) => (
          <tr key={b._id}>
            <td className="ps-4">
              <p className="text-xs font-weight-bold mb-0">{idx}</p>
            </td>
            <td>
              <div className="d-flex px-2 py-1">
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#C77A63,#a8634e)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  {b.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="d-flex flex-column justify-content-center ms-2">
                  <h6 className="mb-0 text-sm">{b.user?.name || "—"}</h6>
                  <p className="text-xs text-secondary mb-0">{b.user?.email}</p>
                </div>
              </div>
            </td>
            <td>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingLeft: 8,
                }}
              >
                {b.venue?.image && (
                  <img
                    src={`${BACKEND}${b.venue.image}`}
                    alt=""
                    style={{
                      width: 36,
                      height: 28,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <div>
                  <p className="text-xs font-weight-bold mb-0">
                    {b.venue?.venue_type?.name || "Venue"}
                  </p>
                  <p className="text-xs text-secondary mb-0">
                    {b.venue?.city?.name || "—"}
                  </p>
                </div>
              </div>
            </td>
            <td>
              <p className="text-xs mb-0">
                {b.booking_start_date
                  ? new Date(b.booking_start_date).toLocaleDateString("en-IN")
                  : "—"}
              </p>
              <p className="text-xs text-secondary mb-0">
                →{" "}
                {b.booking_end_date
                  ? new Date(b.booking_end_date).toLocaleDateString("en-IN")
                  : "—"}{" "}
                · {b.booking_time}
              </p>
              <p className="text-xs text-secondary mb-0">
                {b.rental_days} day(s)
              </p>
            </td>
            <td>
              <p
                className="text-xs font-weight-bold mb-0"
                style={{ color: "#C77A63" }}
              >
                ₹{b.total_amount?.toLocaleString("en-IN")}
              </p>
            </td>
            <td>{bkBadge(b.booking_status)}</td>
            <td>{payBadge(b.booking_status=="Cancelled" ? "Cancelled" :b.payment_status )}</td>
            <td>
              <button
                className="btn btn-link btn-sm mb-0 p-0 me-2"
                style={{ color: "#C77A63" }}
                onClick={() => openStatus(b)}
              >
                Status
              </button>
              <button
                className="btn btn-link btn-sm mb-0 text-info p-0"
                onClick={() => setDetailModal(b)}
              >
                View
              </button>
            </td>
          </tr>
        )}
      />

      {/* Status Modal */}
      {statusModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Booking Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setStatusModal(null)}
                />
              </div>
              <form onSubmit={handleUpdateStatus}>
                <div className="modal-body">
                  <div className="mb-3">
                    <p className="text-sm text-secondary mb-2">
                      Booking by: <strong>{statusModal.user?.name}</strong>
                    </p>
                    <p className="text-sm text-secondary mb-3">
                      Current: {bkBadge(statusModal.booking_status)}
                    </p>
                    <label className="form-label font-weight-bold text-xs text-uppercase">
                      New Status *
                    </label>
                    <select
                      className="form-select"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {newStatus === "Approved" && (
                      <div className="alert alert-success alert-dismissible mt-3 p-2 text-sm">
                        <i className="ni ni-check-bold me-1" /> Approving
                        enables the user to pay!
                      </div>
                    )}
                    {newStatus === "Cancelled" && (
                      <div className="alert alert-danger alert-dismissible mt-3 p-2 text-sm">
                        <i className="ni ni-fat-remove me-1" /> This will cancel
                        the booking.
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setStatusModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDetailModal(null)}
                />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {[
                    ["Customer", detailModal.user?.name],
                    ["Email", detailModal.user?.email],
                    ["Phone", detailModal.user?.phone],
                    ["Venue Type", detailModal.venue?.venue_type?.name || "—"],
                    ["City", detailModal.venue?.city?.name || "—"],
                    ["Occasion", detailModal.venue?.occasion?.name || "—"],
                    [
                      "Start Date",
                      detailModal.booking_start_date
                        ? new Date(
                            detailModal.booking_start_date,
                          ).toLocaleDateString("en-IN")
                        : "—",
                    ],
                    [
                      "End Date",
                      detailModal.booking_end_date
                        ? new Date(
                            detailModal.booking_end_date,
                          ).toLocaleDateString("en-IN")
                        : "—",
                    ],
                    ["Time", detailModal.booking_time],
                    ["Duration", `${detailModal.rental_days} day(s)`],
                    [
                      "Total Amount",
                      `₹${detailModal.total_amount?.toLocaleString("en-IN")}`,
                    ],
                    ["Booking Status", detailModal.booking_status],
                    ["Payment Status", detailModal.payment_status || "Pending"],
                    ["Payment Mode", detailModal.payment_mode],
                  ].map(([label, value]) => (
                    <div key={label} className="col-md-6">
                      <p className="text-xs text-uppercase text-secondary font-weight-bolder mb-1">
                        {label}
                      </p>
                      <p className="text-sm font-weight-bold mb-0">
                        {value || "—"}
                      </p>
                    </div>
                  ))}
                  {detailModal.venue?.description && (
                    <div className="col-12">
                      <p className="text-xs text-uppercase text-secondary font-weight-bolder mb-1">
                        Venue Description
                      </p>
                      <p className="text-sm mb-0">
                        {detailModal.venue.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setDetailModal(null)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setDetailModal(null);
                    openStatus(detailModal);
                  }}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
