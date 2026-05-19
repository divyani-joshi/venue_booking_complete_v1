import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
const B = "http://localhost:8000"
export default function ForgotPassword() {
  const [step,setStep]=useState(1); const [email,setEmail]=useState(""); const [otp,setOtp]=useState(""); const [newPass,setNewPass]=useState(""); const [confirm,setConfirm]=useState(""); const [loading,setLoading]=useState(false); const navigate=useNavigate()
  const inp={width:"100%",padding:"11px 14px",border:"1px solid #e8e0dc",borderRadius:6,fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:"none"}
  const sendOtp=async(e)=>{e.preventDefault();setLoading(true);try{const r=await axios.post(`${B}/sendOtp`,{email});if(r.data.success){toast.success("OTP sent!");setStep(2)}else toast.error(r.data.message)}catch(err){toast.error(err.response?.data?.message||"Failed")}finally{setLoading(false)}}
  const verifyOtp=async(e)=>{e.preventDefault();setLoading(true);try{const r=await axios.post(`${B}/verifyOtp`,{email,otp});if(r.data.success){toast.success("Verified!");setStep(3)}else toast.error(r.data.message)}catch(err){toast.error(err.response?.data?.message||"Invalid OTP")}finally{setLoading(false)}}
  const resetPass=async(e)=>{e.preventDefault();if(newPass!==confirm){toast.error("Don't match!");return};setLoading(true);try{const r=await axios.post(`${B}/changePassword`,{email,newPassword:newPass});if(r.data.success){toast.success("Password reset!");navigate("/login")}else toast.error(r.data.message)}catch(err){toast.error(err.response?.data?.message||"Failed")}finally{setLoading(false)}}
  return (
    <div className="page-wrapper" style={{minHeight:"85vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f9f6f4",padding:"40px 20px"}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{background:"#fff",borderRadius:12,boxShadow:"0 8px 40px rgba(0,0,0,.08)",overflow:"hidden",border:"1px solid #f0e8e2"}}>
          <div style={{background:"var(--theme-color)",padding:"24px 32px"}}><div style={{fontFamily:"'Cormorant',serif",color:"#fff",fontWeight:700,fontSize:22,marginBottom:4}}>Reset Password</div><p style={{color:"rgba(255,255,255,.85)",fontFamily:"'DM Sans',sans-serif",fontSize:13,margin:0}}>Step {step} of 3</p></div>
          <div style={{padding:32}}>
            {step===1&&<form onSubmit={sendOtp}><label style={{color:"#1a1a1a",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,marginBottom:6,display:"block"}}>Email *</label><input type="email" style={inp} placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/><button type="submit" className="btn-1" style={{width:"100%",textAlign:"center",marginTop:16}} disabled={loading}>{loading?"Sending...":"Send OTP"} <span></span></button></form>}
            {step===2&&<form onSubmit={verifyOtp}><label style={{color:"#1a1a1a",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,marginBottom:6,display:"block"}}>OTP *</label><input type="text" style={inp} placeholder="6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} required maxLength={6}/><button type="submit" className="btn-1" style={{width:"100%",textAlign:"center",marginTop:16}} disabled={loading}>{loading?"Verifying...":"Verify OTP"} <span></span></button></form>}
            {step===3&&<form onSubmit={resetPass}><div style={{marginBottom:14}}><label style={{color:"#1a1a1a",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,marginBottom:6,display:"block"}}>New Password *</label><input type="password" style={inp} value={newPass} onChange={e=>setNewPass(e.target.value)} required minLength={6}/></div><div style={{marginBottom:20}}><label style={{color:"#1a1a1a",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,marginBottom:6,display:"block"}}>Confirm *</label><input type="password" style={inp} value={confirm} onChange={e=>setConfirm(e.target.value)} required/></div><button type="submit" className="btn-1" style={{width:"100%",textAlign:"center"}} disabled={loading}>{loading?"Resetting...":"Reset Password"} <span></span></button></form>}
            <p style={{textAlign:"center",marginTop:20,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}><Link to="/login" style={{color:"var(--theme-color)",fontWeight:700}}>← Back to Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
