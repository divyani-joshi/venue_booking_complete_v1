import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../services/api";
import { setToken } from "../auth/authService";
export default function Login({ setIsAuthenticated, setUserData }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const inp = {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #e8e0dc",
    borderRadius: 6,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    outline: "none",
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await login(form);
      if (r.data.success) {
        if (r.data.userData?.session?.role !== "User") {
          toast.error("Admin must use admin panel!");
          return;
        }
        setToken(r.data.token);
        setIsAuthenticated(true);
        setUserData(r.data.userData?.session);
        toast.success(
          `Welcome back, ${r.data.userData?.session?.name?.split(" ")[0]}! 🏛️`,
        );
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="page-wrapper"
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9f6f4",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 40px rgba(0,0,0,.08)",
            overflow: "hidden",
            border: "1px solid #f0e8e2",
          }}
        >
          <div
            style={{ background: "var(--theme-color)", padding: "28px 32px" }}
          >
            <div
              style={{
                fontFamily: "'Cormorant',serif",
                color: "#fff",
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 4,
              }}
            >
              🏛️ Welcome Back
            </div>
            <p
              style={{
                color: "rgba(255,255,255,.85)",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                margin: 0,
              }}
            >
              Sign in to your VenueBook account
            </p>
          </div>
          <div style={{ padding: 32 }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    color: "#1a1a1a",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  style={inp}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div style={{ marginBottom: 20, position: "relative" }}>
                <label
                  style={{
                    color: "#1a1a1a",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Password *
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  style={{ ...inp, paddingRight: 40 }}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 34,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#aaa",
                  }}
                >
                  <i className={`fas fa-eye${showPass ? "-slash" : ""}`} />
                </button>
              </div>
              <button
                type="submit"
                className="btn-1"
                style={{ width: "100%", textAlign: "center" }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"} <span></span>
              </button>
            </form>
            <p
              style={{
                color: "#888",
                textAlign: "center",
                marginTop: 20,
                fontSize: 14,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              New?{" "}
              <Link
                to="/register"
                style={{ color: "var(--theme-color)", fontWeight: 700 }}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
