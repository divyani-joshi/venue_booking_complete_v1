import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import checkSession from "./auth/authService";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Home from "./pages/Home";
import Venues from "./pages/Venues";
import VenueDetail from "./pages/VenueDetail";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Feedbacks from "./pages/Feedbacks";
import About from "./pages/About";
import Contact from "./pages/Contact";

const Spin = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 48,
          height: 48,
          border: "4px solid rgba(199,122,99,.2)",
          borderTopColor: "#C77A63",
          borderRadius: "50%",
          animation: "spin .8s linear infinite",
          margin: "0 auto 12px",
        }}
      />
      <p
        style={{
          color: "#C77A63",
          fontWeight: 600,
          fontSize: 14,
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        Loading...
      </p>
    </div>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession()
      .then(({ isAuth, session }) => {
        setIsAuthenticated(isAuth);
        setUserData(session);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin />;

  return (
    <BrowserRouter>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userData={userData}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<Venues />} />
        <Route
          path="/venues/:id"
          element={<VenueDetail isAuthenticated={isAuthenticated} />}
        />
        <Route path="/feedbacks" element={<Feedbacks />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setUserData={setUserData}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/my-bookings"
          element={isAuthenticated ? <MyBookings /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Profile userData={userData} setUserData={setUserData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
