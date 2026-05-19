import axios from "axios"
import { getHeaders } from "../auth/authService"
// const B = "http://localhost:8000"
const BASE = import.meta.env.VITE_API_URL
export const login = (d) => axios.post(`${B}/login`, d)
export const signup = (d) => axios.post(`${B}/signup`, d)
export const changePassword = (d) => axios.post(`${B}/changePassword`, d)
export const getCities = () => axios.get(`${B}/cities`)
export const getOccasions = () => axios.get(`${B}/occasions`)
export const getVenueTypes = () => axios.get(`${B}/venueTypes`)
export const getVenues = (p) => axios.get(`${B}/venues`, { params: p })
export const getVenueDetails = (id) => axios.get(`${B}/venues/${id}`)
export const getFeedbacks = (venue_id) => venue_id ? axios.get(`${B}/feedbacks/${venue_id}`) : axios.get(`${B}/feedbacks`)
export const getProfile = () => axios.get(`${B}/user/profile`, { headers: getHeaders() })
export const updateProfile = (d) => axios.post(`${B}/user/updateProfile`, d, { headers: getHeaders() })
export const bookVenue = (d) => axios.post(`${B}/user/bookVenue`, d, { headers: getHeaders() })
export const myBookings = () => axios.get(`${B}/user/myBookings`, { headers: getHeaders() })
export const cancelBooking = (d) => axios.post(`${B}/user/cancelBooking`, d, { headers: getHeaders() })
export const genOrderId = (d) => axios.post(`${B}/user/genOrderId`, d, { headers: getHeaders() })
export const verifyPayment = (d) => axios.post(`${B}/user/verifyPayment`, d, { headers: getHeaders() })
export const addFeedback = (d) => axios.post(`${B}/user/addFeedback`, d, { headers: getHeaders() })
