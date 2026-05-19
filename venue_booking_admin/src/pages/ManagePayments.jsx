import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getAdminPayments } from "../services/api";
export default function ManagePayments({ setIsAuthenticated, adminName }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getAdminPayments()
      .then((r) => setItems(r.data.data || []))
      .catch(() => toast.error("Failed"))
      .finally(() => setLoading(false));
  }, []);
  const totalRev = items
    .filter((p) => p.payment_status === "Done")
    .reduce((s, p) => s + (p.total_amount || 0), 0);
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="mb-0">Manage Payments</h4>
        <p className="text-sm text-secondary mb-0">
          Track all payment transactions for venue bookings.
        </p>
      </div>
      {!loading && (
        <div className="row g-3 mb-4">
          {[
            { l: "Total Transactions", v: items.length, c: "#7928CA" },
            {
              l: "Completed (Done)",
              v: items.filter((p) => p.payment_status === "Done").length,
              c: "#2dce89",
            },
            {
              l: "Total Revenue",
              v: `₹${totalRev.toLocaleString("en-IN")}`,
              c: "#C77A63",
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
        title="All Payments"
        columns={[
          "Customer",
          "Amount",
          "Transaction ID",
          "Mode",
          "Date",
          "Status",
        ]}
        data={items}
        loading={loading}
        searchKeys={[
          "user.name",
          "user.email",
          "transaction_id",
          "payment_status",
        ]}
        emptyMessage="No payments yet."
        renderRow={(p, idx) => (
          <tr key={p._id}>
            <td className="ps-4">
              <p className="text-xs font-weight-bold mb-0">{idx}</p>
            </td>
            <td>
              <div className="px-2 py-1">
                <h6 className="mb-0 text-sm">{p.user?.name || "—"}</h6>
                <p className="text-xs text-secondary mb-0">{p.user?.email}</p>
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
              <code className="text-xs">{p.transaction_id || "—"}</code>
            </td>
            <td>
              <p className="text-xs mb-0">{p.payment_mode || "Online"}</p>
            </td>
            <td>
              <p className="text-xs text-secondary mb-0">
                {p.date
                  ? new Date(p.date).toLocaleDateString("en-IN")
                  : p.created_at
                    ? new Date(p.created_at).toLocaleDateString("en-IN")
                    : "—"}
              </p>
            </td>
            <td>
              <span
                className={`text-xs font-weight-bold mb-0 ${p.payment_status === "Done" ? "text-success" : "text-warning"}`}
              >
                {p.payment_status || "—"}
              </span>
            </td>
          </tr>
        )}
      />
    </AdminLayout>
  );
}
