import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { removeToken } from "../auth/authService";

const titles = {
  "/": "Dashboard",
  "/manage-cities": "Manage Cities",
  "/manage-occasions": "Manage Occasions",
  "/manage-venue-types": "Manage Venue Types",
  "/manage-venues": "Manage Venues",
  "/manage-bookings": "Manage Bookings",
  "/manage-payments": "Payments",
  "/manage-users": "Manage Users",
  "/manage-feedbacks": "Feedbacks",
  "/profile": "My Profile",
};

export default function Navbar({ setIsAuthenticated, adminName }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    toast.success("Logged out!");
    navigate("/login");
  };
  return (
    <nav
      className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
      id="navbarBlur"
    >
      <div className="container-fluid py-1 px-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
            <li className="breadcrumb-item text-sm">
              <Link className="opacity-5 text-dark" to="/">
                Admin
              </Link>
            </li>
            <li
              className="breadcrumb-item text-sm text-dark active"
              aria-current="page"
            >
              {titles[pathname] || "Page"}
            </li>
          </ol>
          <h6 className="font-weight-bolder mb-0">
            {titles[pathname] || "Page"}
          </h6>
        </nav>
        <div
          className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
          id="navbar"
        >
          <ul className="navbar-nav justify-content-end ms-auto">
            <li className="nav-item dropdown pe-2 d-flex align-items-center">
              <a
                href="#!"
                className="nav-link text-body font-weight-bold px-0"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("adminDrop").classList.toggle("show");
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#C77A63,#a8634e)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                    marginRight: 8,
                    display: "inline-flex",
                  }}
                >
                  {adminName ? adminName.charAt(0).toUpperCase() : "A"}
                </div>
                <span className="d-sm-inline d-none" style={{ fontSize: 13 }}>
                  {adminName || "Admin"}
                </span>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4"
                id="adminDrop"
              >
                <li>
                  <Link
                    className="dropdown-item border-radius-md"
                    to="/profile"
                  >
                    <i className="ni ni-single-02 me-2" />
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item border-radius-md text-danger"
                    onClick={handleLogout}
                  >
                    <i className="ni ni-button-power me-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
