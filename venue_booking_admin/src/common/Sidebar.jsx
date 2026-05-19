import React from "react";
import { Link, useLocation } from "react-router-dom";

const groups = [
  { cap: "MAIN", items: [{ to: "/", icon: "ni ni-tv-2", label: "Dashboard" }] },
  {
    cap: "VENUE MANAGEMENT",
    items: [
      { to: "/manage-cities", icon: "ni ni-map-big", label: "Cities" },
      {
        to: "/manage-occasions",
        icon: "ni ni-calendar-grid-58",
        label: "Occasions",
      },
      { to: "/manage-venue-types", icon: "ni ni-app", label: "Venue Types" },
      { to: "/manage-venues", icon: "ni ni-building", label: "Venues" },
    ],
  },
  {
    cap: "BOOKINGS",
    items: [
      { to: "/manage-bookings", icon: "ni ni-check-bold", label: "Bookings" },
      { to: "/manage-payments", icon: "ni ni-credit-card", label: "Payments" },
    ],
  },
  {
    cap: "USERS & FEEDBACK",
    items: [
      { to: "/manage-users", icon: "ni ni-single-02", label: "Users" },
      { to: "/manage-feedbacks", icon: "ni ni-like-2", label: "Feedbacks" },
    ],
  },
  {
    cap: "ACCOUNT",
    items: [{ to: "/profile", icon: "ni ni-single-02", label: "My Profile" }],
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside
      className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3"
      id="sidenav-main"
      style={{ background: "linear-gradient(195deg,#42424a,#191919)" }}
    >
      <div className="sidenav-header">
        <i
          className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
          id="iconSidenav"
        />
        <Link
          className="navbar-brand m-0 d-flex align-items-center gap-2 px-3 py-2"
          to="/"
        >
          <span style={{ fontSize: 22 }}>🏛️</span>
          <span
            className="ms-1 font-weight-bold text-white"
            style={{ fontFamily: "'Open Sans',sans-serif", fontSize: 14 }}
          >
            VenueBook Admin
          </span>
        </Link>
      </div>
      <hr className="horizontal light mt-0 mb-2" />
      <div
        className="collapse navbar-collapse w-auto h-auto"
        id="sidenav-collapse-main"
      >
        <ul className="navbar-nav">
          {groups.map((g) => (
            <React.Fragment key={g.cap}>
              <li className="nav-item mt-3">
                <h6 className="ps-4 ms-2 text-uppercase text-xs text-white font-weight-bolder opacity-6">
                  {g.cap}
                </h6>
              </li>
              {g.items.map((item) => (
                <li key={item.to} className="nav-item">
                  <Link
                    to={item.to}
                    className={`nav-link text-white${pathname === item.to ? " active bg-gradient-primary" : ""}`}
                  >
                    <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                      <i className={`${item.icon} text-sm opacity-10`} />
                    </div>
                    <span
                      className="nav-link-text ms-1"
                      style={{ fontSize: 13 }}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </aside>
  );
}
