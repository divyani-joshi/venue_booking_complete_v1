import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../common/AdminLayout";
import { getDashboardStats } from "../services/api";

export default function Dashboard({ setIsAuthenticated, adminName }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((r) => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
      {
        label: "Total Users",
        value: stats.totalUsers,
        icon: "ni ni-single-02",
        color: "#7928CA",
        bg: "linear-gradient(195deg,#7928CA,#FF0080)",
      },
      {
        label: "Cities",
        value: stats.totalCities,
        icon: "ni ni-map-big",
        color: "#17c1e8",
        bg: "linear-gradient(195deg,#17c1e8,#0075de)",
      },
      {
        label: "Occasions",
        value: stats.totalOccasions,
        icon: "ni ni-calendar-grid-58",
        color: "#e14eca",
        bg: "linear-gradient(195deg,#e14eca,#c679ff)",
      },
      {
        label: "Venue Types",
        value: stats.totalVenueTypes,
        icon: "ni ni-app",
        color: "#fb6340",
        bg: "linear-gradient(195deg,#fb6340,#fbb140)",
      },
      {
        label: "Total Venues",
        value: stats.totalVenues,
        icon: "ni ni-building",
        color: "#2dce89",
        bg: "linear-gradient(195deg,#2dce89,#2dcecc)",
      },
      {
        label: "Active Venues",
        value: stats.activeVenues,
        icon: "ni ni-check-bold",
        color: "#2dce89",
        bg: "linear-gradient(195deg,#2dce89,#2dcecc)",
      },
      {
        label: "Total Bookings",
        value: stats.totalBookings,
        icon: "ni ni-calendar-grid-58",
        color: "#C77A63",
        bg: "linear-gradient(195deg,#C77A63,#a8634e)",
      },
      {
        label: "Pending",
        value: stats.pendingBookings,
        icon: "ni ni-time-alarm",
        color: "#fb6340",
        bg: "linear-gradient(195deg,#fb6340,#fbb140)",
      },
      {
        label: "Approved",
        value: stats.approvedBookings,
        icon: "ni ni-like-2",
        color: "#2dce89",
        bg: "linear-gradient(195deg,#2dce89,#2dcecc)",
      },
      {
        label: "Cancelled",
        value: stats.cancelledBookings,
        icon: "ni ni-fat-remove",
        color: "#f5365c",
        bg: "linear-gradient(195deg,#f5365c,#f56036)",
      },
      {
        label: "Revenue",
        value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
        icon: "ni ni-money-coins",
        color: "#7928CA",
        bg: "linear-gradient(195deg,#7928CA,#FF0080)",
      },
      {
        label: "Avg Rating",
        value: `${stats.avgRating}/5`,
        icon: "ni ni-like-2",
        color: "#fb6340",
        bg: "linear-gradient(195deg,#fb6340,#fbb140)",
      },
    ]
    : [];

  const bkBadge = (s) => {
    const m = {
      Pending: "text-warning",
      Approved: "text-success",
      Cancelled: "text-danger",
    };
    return (
      <span
        className={`text-xs font-weight-bold mb-0 ${m[s] || "badge-secondary"}`}
      >
        {s}
      </span>
    );
  };
  const payBadge = (s) => {
    const m = {
      Success: "text-success",
      Done: "text-success",
      Pending: "text-warning",
      Failed: "text-danger",
    };
    return (
      <span
        className={`text-xs font-weight-bold mb-0 ${m[s] || "text-warning"}`}
      >
        {s || "Pending"}
      </span>
    );
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
            <div>
              <h4 className="mb-0">Dashboard 🏛️</h4>
              <p className="text-sm mb-0">
                Welcome back, <strong>{adminName}</strong>! Here's your venue
                platform overview.
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/manage-venues" className="btn btn-sm btn-primary mb-0">
                + Add Venue
              </Link>
              <Link
                to="/manage-bookings"
                className="btn btn-sm btn-outline-primary mb-0"
              >
                Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3 text-secondary">Loading stats...</p>
        </div>
      ) : (
        <>
          <div className="row">
            {cards.map((c, i) => (
              <div key={i} className="col-xl-3 col-sm-6 mb-4">
                <div className="card">
                  <div className="card-header p-3 pt-2">
                    <div
                      className="icon icon-lg icon-shape shadow text-center border-radius-xl mt-n4 position-absolute"
                      style={{
                        background: c.bg,
                        width: 56,
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className={`${c.icon} text-white text-xl`}
                        style={{ position: "static", top: "auto" }}
                      />
                    </div>
                    <div className="text-end pt-1">
                      <p className="text-sm mb-0 text-capitalize">{c.label}</p>
                      <h4 className="mb-0">{c.value}</h4>
                    </div>
                  </div>
                  <hr className="dark horizontal my-0" />
                  <div className="card-footer p-3"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="row mt-2">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Recent Bookings</h6>
                  <Link
                    to="/manage-bookings"
                    className="btn btn-sm btn-outline-primary mb-0"
                  >
                    View All
                  </Link>
                </div>
                <div className="card-body px-0 pt-0 pb-2">
                  <div className="table-responsive p-0">
                    <table className="table align-items-center justify-content-center mb-0">
                      <thead>
                        <tr>
                          {[
                            "Customer",
                            "Venue",
                            "Dates",
                            "Time",
                            "Amount",
                            "Status",
                            "Payment",
                          ].map((h) => (
                            <th
                              key={h}
                              className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {!stats?.recentBookings?.length ? (
                          <tr>
                            <td
                              colSpan="7"
                              className="text-center py-4 text-secondary text-sm"
                            >
                              No bookings yet
                            </td>
                          </tr>
                        ) : (
                          stats.recentBookings.map((b, i) => (
                            <tr key={b._id || i}>
                              <td>
                                <div className="d-flex px-2 py-1">
                                  <div
                                    style={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: "50%",
                                      background:
                                        "linear-gradient(195deg,#C77A63,#a8634e)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#fff",
                                      fontWeight: 700,
                                      fontSize: 13,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {b.user?.name?.charAt(0)?.toUpperCase() ||
                                      "U"}
                                  </div>
                                  <div className="d-flex flex-column justify-content-center ms-2">
                                    <h6 className="mb-0 text-sm">
                                      {b.user?.name || "—"}
                                    </h6>
                                    <p className="text-xs text-secondary mb-0">
                                      {b.user?.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <p className="text-xs font-weight-bold mb-0">
                                  {b.venue?.venue_type?.name ||
                                    b.venue?.description?.slice(0, 25) ||
                                    "—"}
                                </p>
                              </td>
                              <td>
                                <p className="text-xs mb-0">
                                  {b.booking_start_date
                                    ? new Date(
                                      b.booking_start_date,
                                    ).toLocaleDateString("en-IN")
                                    : "—"}
                                </p>
                                <p className="text-xs text-secondary mb-0">
                                  →{" "}
                                  {b.booking_end_date
                                    ? new Date(
                                      b.booking_end_date,
                                    ).toLocaleDateString("en-IN")
                                    : "—"}
                                </p>
                              </td>
                              <td>
                                <p className="text-xs mb-0">
                                  {b.booking_time || "—"}
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
                              <td className="text-xs font-weight-bold mb-0">
                                {bkBadge(b.booking_status)}
                              </td>
                              <td>{payBadge(b.booking_status == "Cancelled" ? "Cancelled" : b.payment_status)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Recent Payments</h6>
                  <Link
                    to="/manage-payments"
                    className="btn btn-sm btn-outline-primary mb-0"
                  >
                    View All
                  </Link>
                </div>
                <div className="card-body px-0 pt-0 pb-2">
                  <div className="table-responsive p-0">
                    <table className="table align-items-center justify-content-center mb-0">
                      <thead>
                        <tr>
                          {[
                            "Customer",
                            "Amount",
                            "Transaction ID",
                            "Date",
                            "Status",
                          ].map((h) => (
                            <th
                              key={h}
                              className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {!stats?.recentPayments?.length ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-4 text-secondary text-sm"
                            >
                              No payments yet
                            </td>
                          </tr>
                        ) : (
                          stats.recentPayments.map((p, i) => (
                            <tr key={p._id || i}>
                              <td>
                                <div className="px-2 py-1">
                                  <h6 className="mb-0 text-sm">
                                    {p.user?.name || "—"}
                                  </h6>
                                  <p className="text-xs text-secondary mb-0">
                                    {p.user?.email}
                                  </p>
                                </div>
                              </td>
                              <td>
                                <p
                                  className="text-xs font-weight-bold mb-0"
                                  style={{ color: "#C77A63" }}
                                >
                                  ₹{p.total_amount?.toLocaleString("en-IN")}
                                </p>
                              </td>
                              <td>
                                <code className="text-xs">
                                  {p.transaction_id?.slice(0, 16) || "—"}
                                </code>
                              </td>
                              <td>
                                <p className="text-xs text-secondary mb-0">
                                  {p.date
                                    ? new Date(p.date).toLocaleDateString(
                                      "en-IN",
                                    )
                                    : "—"}
                                </p>
                              </td>
                              <td>{payBadge(p.payment_status)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
