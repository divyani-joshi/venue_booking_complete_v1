import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getAdminUsers, updateUserStatus } from "../services/api";
const BACKEND = "http://localhost:8000";
export default function ManageUsers({ setIsAuthenticated, adminName }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const fetch = async () => {
    setLoading(true);
    try {
      const r = await getAdminUsers();
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
  const toggleStatus = async (u) => {
    setToggling(u._id);
    try {
      const newStatus = u.status === "Active" ? "Inactive" : "Active";
      const r = await updateUserStatus({ user_id: u._id, status: newStatus });
      if (r.data.success) {
        toast.success(
          `User ${newStatus === "Active" ? "activated" : "deactivated"}!`,
        );
        fetch();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    } finally {
      setToggling(null);
    }
  };
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="mb-0">Manage Users</h4>
        <p className="text-sm text-secondary mb-0">
          View and manage registered user accounts.
        </p>
      </div>
      <DataTable
        title="All Users"
        columns={["User", "Phone", "Address", "Status", "Joined", "Actions"]}
        data={items}
        loading={loading}
        searchKeys={["name", "email", "phone", "status"]}
        emptyMessage="No users yet."
        renderRow={(u, idx) => (
          <tr key={u._id}>
            <td className="ps-4">
              <p className="text-xs font-weight-bold mb-0">{idx}</p>
            </td>
            <td>
              <div className="d-flex px-2 py-1 align-items-center">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    flexShrink: 0,
                    overflow: "hidden",
                    background: "linear-gradient(135deg,#C77A63,#a8634e)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {u.profile_image ? (
                    <img
                      src={`${BACKEND}${u.profile_image}`}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    u.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div className="ms-2">
                  <h6 className="mb-0 text-sm">{u.name}</h6>
                  <p className="text-xs text-secondary mb-0">{u.email}</p>
                </div>
              </div>
            </td>
            <td>
              <p className="text-xs mb-0">{u.phone || "—"}</p>
            </td>
            <td>
              <p
                className="text-xs mb-0"
                style={{
                  maxWidth: 160,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {u.address || "—"}
              </p>
            </td>
            <td>
              <span
                className={`text-xs font-weight-bold mb-0 ${u.status === "Active" ? "text-success" : "text-danger"}`}
              >
                {u.status || "Active"}
              </span>
            </td>
            <td>
              <p className="text-xs text-secondary mb-0">
                {u.created_at
                  ? new Date(u.created_at).toLocaleDateString("en-IN")
                  : "—"}
              </p>
            </td>
            <td>
              <button
                className={`btn btn-sm mb-0 py-1 px-2 ${u.status === "Active" ? "btn-outline-danger" : "btn-outline-success"}`}
                style={{ fontSize: 11 }}
                onClick={() => toggleStatus(u)}
                disabled={toggling === u._id}
              >
                {toggling === u._id
                  ? "..."
                  : u.status === "Active"
                    ? "Deactivate"
                    : "Activate"}
              </button>
            </td>
          </tr>
        )}
      />
    </AdminLayout>
  );
}
