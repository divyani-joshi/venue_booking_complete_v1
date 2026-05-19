import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { login } from "../services/api"
import { setToken } from "../auth/authService"
export default function Login({ setIsAuthenticated, setAdminName }) {
  const [form, setForm] = useState({ email: "", password: "" }); const [loading, setLoading] = useState(false); const [showPass, setShowPass] = useState(false); const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await login(form)
      if (res.data.success) {
        if (res.data.userData?.session?.role !== "Admin") { toast.error("Admin accounts only!"); return }
        setToken(res.data.token); setIsAuthenticated(true); setAdminName(res.data.userData?.session?.name || "Admin")
        toast.success("Welcome, Admin! 🏛️"); navigate("/")
      }
    } catch (err) { toast.error(err.response?.data?.message || "Login failed!") }
    finally { setLoading(false) }
  }
  return (
    <div className="container position-sticky z-index-sticky top-0">
      <div className="row">
        <div className="col-12">
          <nav className="navbar navbar-expand-lg blur border-radius-xl top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4">
            <div className="container-fluid ps-2 pe-0">
              <a className="navbar-brand font-weight-bolder ms-lg-0 ms-3 d-flex align-items-center gap-2">
                <span style={{fontSize:20}}>🏛️</span> VenueBook Admin
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>,
    <main className="main-content mt-0">
      <div className="page-header align-items-start min-vh-100" style={{backgroundImage:"url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920)",backgroundSize:"cover",backgroundPosition:"center"}}>
        <span className="mask bg-gradient-dark opacity-6" />
        <div className="container my-auto">
          <div className="row">
            <div className="col-lg-4 col-md-8 col-12 mx-auto">
              <div className="card z-index-0 fadeIn3 fadeInBottom mt-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1" style={{background:"linear-gradient(195deg,#C77A63,#a8634e)"}}>
                    <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">🏛️ VenueBook Admin</h4>
                    <p className="text-white text-sm text-center mb-3">Sign in to manage venues & bookings</p>
                  </div>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit} role="form" className="text-start">
                    <div className="my-3">
                      <label className="form-label">Email</label>
                      <br />
                      <input type="email" className="form-control" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
                    </div>
                    <div className="mb-3" style={{position:"relative"}}>
                      <label className="form-label">Password</label>
                      <br />
                      <input type={showPass?"text":"password"} className="form-control" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
                      <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-10%)",background:"none",border:"none",cursor:"pointer",color:"#aaa",zIndex:5}}><i className={`fas fa-eye${showPass?"-slash":""}`}/></button>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn w-100 my-4 mb-2 text-white" style={{background:"linear-gradient(195deg,#C77A63,#a8634e)"}} disabled={loading}>
                        {loading?<><span className="spinner-border spinner-border-sm me-1"/>Signing in...</>:"Sign In"}
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-center text-secondary">Admin access only.</p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
