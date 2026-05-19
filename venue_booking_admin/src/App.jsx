import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import checkSession from "./auth/authService"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ManageCities from "./pages/ManageCities"
import ManageOccasions from "./pages/ManageOccasions"
import ManageVenueTypes from "./pages/ManageVenueTypes"
import ManageVenues from "./pages/ManageVenues"
import ManageBookings from "./pages/ManageBookings"
import ManageUsers from "./pages/ManageUsers"
import ManagePayments from "./pages/ManagePayments"
import ManageFeedbacks from "./pages/ManageFeedbacks"
import AdminProfile from "./pages/AdminProfile"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminName, setAdminName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession().then(({ isAuth, session }) => {
      setIsAuthenticated(isAuth)
      if (session?.name) setAdminName(session.name)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{minHeight:"100vh"}}><div className="spinner-border text-primary"/></div>

  const p = { setIsAuthenticated, adminName }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} setAdminName={setAdminName} /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-cities" element={isAuthenticated ? <ManageCities {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-occasions" element={isAuthenticated ? <ManageOccasions {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-venue-types" element={isAuthenticated ? <ManageVenueTypes {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-venues" element={isAuthenticated ? <ManageVenues {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-bookings" element={isAuthenticated ? <ManageBookings {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-users" element={isAuthenticated ? <ManageUsers {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-payments" element={isAuthenticated ? <ManagePayments {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-feedbacks" element={isAuthenticated ? <ManageFeedbacks {...p} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <AdminProfile {...p} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  )
}
