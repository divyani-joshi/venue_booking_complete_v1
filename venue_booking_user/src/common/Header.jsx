import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { removeToken } from "../auth/authService";
import { toast } from "react-toastify";

export default function Header({
  isAuthenticated,
  setIsAuthenticated,
  userData,
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDrop, setUserDrop] = useState(false);

  useEffect(() => {
    const fn = () => setSticky(window.scrollY > 100);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserDrop(false);
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/venues", label: "Venues" },
    { to: "/feedbacks", label: "Reviews" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        .main-header.header-style-one { position: relative; z-index: 999; }
        .main-header.header-style-one .header-upper { background: #fff; padding: 0; box-shadow: 0 2px 20px rgba(0,0,0,.08); }
        .main-header .inner-container { padding: 0 20px; min-height: 80px; }
        .main-header .logo-box .logo-text { font-family: 'Cormorant', serif; font-weight: 700; font-size: 26px; text-decoration: none; color: #1a1a1a; line-height: 1; }
        .main-header .logo-text .theme-color { color: var(--theme-color); }
        .main-header nav.main-menu ul.navigation { display: flex; gap: 4px; list-style: none; margin: 0; padding: 0; }
        .main-header nav.main-menu ul.navigation > li > a { font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 14px; color: #1a1a1a; padding: 10px 16px; border-radius: 4px; text-decoration: none; transition: all .3s; letter-spacing: .3px; display: block; }
        .main-header nav.main-menu ul.navigation > li > a:hover,
        .main-header nav.main-menu ul.navigation > li.active > a { color: var(--theme-color); background: rgba(199,122,99,.06); }
        .main-header .header-link-btn .btn-1.btn-alt { font-family: 'DM Sans', sans-serif; font-size: 13px; padding: 10px 22px; }
        .main-header.sticky { position: fixed; top: 0; left: 0; width: 100%; animation: slideDown .4s ease; z-index: 9999; }
        @keyframes slideDown { from { transform: translateY(-100%); } to { transform: none; } }
        .mobile-nav-toggler-btn { display: none; background: none; border: 1px solid #eee; border-radius: 4px; padding: 6px 10px; cursor: pointer; }
        @media (max-width: 991px) {
          .main-header nav.main-menu { display: none; }
          .mobile-nav-toggler-btn { display: block; }
        }
        .mobile-menu-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 9998; }
        .mobile-menu-drawer { display: none; position: fixed; top: 0; right: 0; width: 280px; height: 100vh; background: #fff; z-index: 9999; padding: 24px; overflow-y: auto; transform: translateX(100%); transition: transform .3s; }
        .mobile-menu-drawer.open { transform: none; }
        .mobile-menu-overlay.open { display: block; }
        .mobile-menu-drawer { display: block; }
        .mob-nav a { display: block; padding: 12px 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #f5f5f5; font-weight: 500; }
        .mob-nav a:hover, .mob-nav a.active { color: var(--theme-color); }
        .user-drop-wrap { position: relative; }
        .user-drop-menu { position: absolute; top: calc(100% + 8px); right: 0; width: 200px; background: #fff; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,.1); padding: 6px 0; z-index: 9999; animation: fadeIn .2s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        .user-drop-menu a, .user-drop-menu button { display: block; width: 100%; text-align: left; padding: 10px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #555; background: none; border: none; cursor: pointer; text-decoration: none; transition: all .2s; }
        .user-drop-menu a:hover { color: var(--theme-color); background: rgba(199,122,99,.05); }
        .user-drop-menu button:hover { color: #e74c3c; background: rgba(231,76,60,.05); }
        .user-drop-menu hr { margin: 4px 0; border-color: #f0f0f0; }
      `}</style>

      <header
        className={`main-header header-style-one${sticky ? " sticky" : ""}`}
      >
        <div className="header-upper">
          <div className="auto-container">
            <div className="inner-container d-flex align-items-center justify-content-between">
              {/* Logo */}
              <div className="logo-box">
                <div className="logo">
                  <Link to="/" className="logo-text">
                    <span style={{ fontSize: 22, marginRight: 8 }}>🏛️</span>
                    Venue<span className="theme-color">Book</span>
                  </Link>
                </div>
              </div>

              {/* Desktop Nav */}
              <div className="middle-column">
                <div className="nav-outer">
                  <button
                    className="mobile-nav-toggler-btn"
                    onClick={() => setMobileOpen(true)}
                  >
                    <i className="fas fa-bars" style={{ color: "#1a1a1a" }} />
                  </button>
                  <nav className="main-menu navbar-expand-md">
                    <div className="collapse navbar-collapse show clearfix">
                      <ul className="navigation">
                        {navLinks.map((l) => (
                          <li
                            key={l.to}
                            className={pathname === l.to ? "active" : ""}
                          >
                            <Link to={l.to}>{l.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>

              {/* Right */}
              <div
                className="right-column d-flex align-items-center"
                style={{ gap: 12 }}
              >
                {isAuthenticated && (
                  <div className="header-link-btn">
                    <Link to="/venues" className="btn-1 btn-small btn-alt">
                      Book Venue <span></span>
                    </Link>
                  </div>
                )}
                {isAuthenticated ? (
                  <div className="user-drop-wrap">
                    <button
                      onClick={() => setUserDrop((o) => !o)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "rgba(199,122,99,.08)",
                        border: "1px solid rgba(199,122,99,.25)",
                        borderRadius: 6,
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: "#1a1a1a",
                        fontWeight: 500,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "var(--theme-color)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      {userData?.name?.split(" ")[0]}{" "}
                      <i
                        className="fas fa-chevron-down"
                        style={{ fontSize: 10 }}
                      />
                    </button>
                    {userDrop && (
                      <div className="user-drop-menu">
                        <div
                          style={{
                            padding: "10px 18px 14px",
                            borderBottom: "1px solid #f0f0f0",
                            marginBottom: 4,
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 700,
                              fontSize: 13,
                              color: "#1a1a1a",
                              fontFamily: "'DM Sans',sans-serif",
                            }}
                          >
                            {userData?.name}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, color: "#999" }}>
                            Registered Member
                          </p>
                        </div>
                        <Link to="/my-bookings">
                          <i
                            className="fas fa-calendar-check me-2"
                            style={{ color: "var(--theme-color)" }}
                          />
                          My Bookings
                        </Link>
                        <Link to="/profile">
                          <i
                            className="fas fa-user me-2"
                            style={{ color: "var(--theme-color)" }}
                          />
                          My Profile
                        </Link>
                        <hr />
                        <button onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt me-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 14,
                        color: "#555",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      Login
                    </Link>
                    <div className="header-link-btn">
                      <Link to="/register" className="btn-1 btn-small btn-alt">
                        Register <span></span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`mobile-menu-overlay${mobileOpen ? " open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`mobile-menu-drawer${mobileOpen ? " open" : ""}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant',serif",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            Venue<span style={{ color: "var(--theme-color)" }}>Book</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#555",
            }}
          >
            ✕
          </button>
        </div>
        <nav className="mob-nav">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={pathname === l.to ? "active" : ""}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" onClick={() => setMobileOpen(false)}>
                My Bookings
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)}>
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 0",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 15,
                  color: "#e74c3c",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid #f5f5f5",
                  textAlign: "left",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Close user dropdown on outside click */}
      {userDrop && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100 }}
          onClick={() => setUserDrop(false)}
        />
      )}
    </>
  );
}
