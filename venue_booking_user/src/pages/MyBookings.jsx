import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  myBookings,
  cancelBooking,
  genOrderId,
  verifyPayment,
  addFeedback,
} from "../services/api";

const BACKEND = "http://localhost:8000";
const RAZORPAY_KEY = "rzp_test_VQhEfe2NCXbbwI";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [fbForm, setFbForm] = useState({ rating: 5, message: "", review: "" });
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await myBookings();
      setBookings(r.data.data || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const r = await cancelBooking({ booking_id: cancelModal._id });
      if (r.data.success) {
        toast.success("Booking cancelled!");
        setCancelModal(null);
        fetch();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed!");
    } finally {
      setCancelling(false);
    }
  };

  const handlePay = async (b) => {
    setPaying(b._id);
    try {
      const oRes = await genOrderId({ booking_id: b._id });
      if (!oRes.data.success) {
        toast.error(oRes.data.message);
        return;
      }
      const { order_id, amount, booking_id } = oRes.data.data;
      const options = {
        key: RAZORPAY_KEY,
        amount,
        currency: "INR",
        name: "VenueBook",
        description: `${b.venue?.venue_type?.name || "Venue"} – ${b.rental_days} day(s)`,
        order_id,
        handler: async (response) => {
          try {
            const vRes = await verifyPayment({
              booking_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (vRes.data.success) {
              toast.success("Payment successful! 🏛️");
              fetch();
            }
          } catch {
            toast.error("Payment verification failed.");
          }
        },
        theme: { color: "#C77A63" },
      };
      if (!window.Razorpay) {
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(s);
        await new Promise((r) => (s.onload = r));
      }
      new window.Razorpay(options).open();
    } catch {
      toast.error("Payment failed");
    } finally {
      setPaying(null);
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await addFeedback({
        venue_id: feedbackModal.venue_id,
        message: fbForm.message,
        review: fbForm.review,
        rating: fbForm.rating,
      });
      if (r.data.success) {
        toast.success("Review submitted!");
        setFeedbackModal(null);
        setFbForm({ rating: 5, message: "", review: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (s) => {
    const m = {
      Pending: { bg: "#fef9c3", c: "#a16207" },
      Approved: { bg: "#dcfce7", c: "#15803d" },
      Cancelled: { bg: "#fee2e2", c: "#dc2626" },
    };
    const st = m[s] || { bg: "#f3f4f6", c: "#374151" };
    return (
      <span
        style={{
          background: st.bg,
          color: st.c,
          fontSize: 11,
          fontWeight: 700,
          padding: "3px 10px",
          borderRadius: 20,
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {s}
      </span>
    );
  };
  const payBadge = (s) => {
    const m = {
      Done: { bg: "#dcfce7", c: "#15803d" },
      Pending: { bg: "#fef9c3", c: "#a16207" },
      Failed: { bg: "#fee2e2", c: "#dc2626" },
    };
    const st = m[s] || { bg: "#fef9c3", c: "#a16207" };
    return (
      <span
        style={{
          background: st.bg,
          color: st.c,
          fontSize: 11,
          fontWeight: 700,
          padding: "3px 10px",
          borderRadius: 20,
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {s || "Pending"}
      </span>
    );
  };

  const inp = {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #e8e0dc",
    borderRadius: 6,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    outline: "none",
  };

  return (
    <div className="page-wrapper">
      <div
        className="page-title"
        style={{
          backgroundImage: "url(/assets/images/background/page-title-5.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="auto-container">
          <h1 style={{ fontFamily: "'Cormorant',serif", color: "#fff" }}>
            My Bookings
          </h1>
        </div>
      </div>
      <div className="bredcrumb-wrap">
        <div className="auto-container">
          <ul className="bredcrumb-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>My Bookings</li>
          </ul>
        </div>
      </div>

      <section className="section-padding">
        <div className="auto-container">
          {/* Info Banner */}
          <div
            style={{
              background: "#fdf8f5",
              border: "1px solid rgba(199,122,99,.3)",
              borderRadius: 8,
              padding: "12px 18px",
              marginBottom: 28,
              fontSize: 13,
              color: "#8b5e4a",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <i
              className="fas fa-info-circle me-2"
              style={{ color: "var(--theme-color)" }}
            />
            <strong>Booking Flow:</strong> Submit → Admin approves → Pay via
            Razorpay → Enjoy your event!
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div
                style={{
                  width: 44,
                  height: 44,
                  border: "4px solid rgba(199,122,99,.2)",
                  borderTopColor: "#C77A63",
                  borderRadius: "50%",
                  animation: "spin .8s linear infinite",
                  margin: "0 auto",
                }}
              />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
              <h4 style={{ fontFamily: "'Cormorant',serif" }}>
                No bookings yet
              </h4>
              <p
                style={{
                  color: "#888",
                  fontFamily: "'DM Sans',sans-serif",
                  marginBottom: 24,
                }}
              >
                Start exploring venues!
              </p>
              <Link to="/venues" className="btn-1">
                Browse Venues <span></span>
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {bookings.map((b) => (
                <div
                  key={b._id}
                  style={{
                    background: "#fff",
                    border: "1px solid #f0e8e2",
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: "0 4px 16px rgba(0,0,0,.05)",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(199,122,99,.12)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(0,0,0,.05)")
                  }
                >
                  <div className="row g-4 align-items-start">
                    {/* Image */}
                    <div className="col-md-2 col-4">
                      <div
                        style={{
                          borderRadius: 8,
                          overflow: "hidden",
                          height: 90,
                        }}
                      >
                        {b.venue?.image ? (
                          <img
                            src={`${BACKEND}${b.venue.image}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background:
                                "linear-gradient(135deg,#f8f0ec,#f0e8e2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 32,
                            }}
                          >
                            🏛️
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Details */}
                    <div className="col-md-5">
                      <h5
                        style={{
                          fontFamily: "'Cormorant',serif",
                          fontWeight: 700,
                          fontSize: 18,
                          color: "#1a1a1a",
                          marginBottom: 8,
                        }}
                      >
                        {b.venue?.venue_type?.name ||
                          b.venue?.description?.slice(0, 30) ||
                          "Venue"}
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            color: "#888",
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 13,
                          }}
                        >
                          <i
                            className="fas fa-map-marker-alt me-1"
                            style={{ color: "var(--theme-color)" }}
                          />
                          {b.city?.name || "—"}
                        </span>
                        <span
                          style={{
                            color: "#888",
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 13,
                          }}
                        >
                          <i
                            className="fas fa-calendar me-1"
                            style={{ color: "var(--theme-color)" }}
                          />
                          {b.booking_start_date
                            ? new Date(b.booking_start_date).toLocaleDateString(
                                "en-IN",
                              )
                            : "—"}{" "}
                          →{" "}
                          {b.booking_end_date
                            ? new Date(b.booking_end_date).toLocaleDateString(
                                "en-IN",
                              )
                            : "—"}
                        </span>
                        <span
                          style={{
                            color: "#888",
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 13,
                          }}
                        >
                          <i
                            className="fas fa-clock me-1"
                            style={{ color: "var(--theme-color)" }}
                          />
                          {b.booking_time || "—"} · {b.rental_days} day
                          {b.rental_days > 1 ? "s" : ""}
                        </span>
                        {b.occasion?.name && (
                          <span
                            style={{
                              color: "#888",
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 13,
                            }}
                          >
                            <i
                              className="fas fa-star me-1"
                              style={{ color: "var(--theme-color)" }}
                            />
                            {b.occasion.name}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Status + Actions */}
                    <div className="col-md-5">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          {statusBadge(b.booking_status)}
                          {payBadge(b.payment_status)}
                          <span
                            style={{
                              color: "var(--theme-color)",
                              fontFamily: "'Cormorant',serif",
                              fontWeight: 700,
                              fontSize: 22,
                              marginLeft: "auto",
                            }}
                          >
                            ₹{b.total_amount?.toLocaleString("en-IN")}
                          </span>
                        </div>
                        {b.booking_status === "Pending" && (
                          <p
                            style={{
                              color: "#a16207",
                              fontSize: 12,
                              background: "#fef9c3",
                              borderRadius: 4,
                              padding: "4px 8px",
                              margin: 0,
                              fontFamily: "'DM Sans',sans-serif",
                            }}
                          >
                            ⏳ Awaiting admin approval before payment
                          </p>
                        )}
                        <div
                          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                        >
                          {b.booking_status === "Approved" &&
                            b.payment_status !== "Success" && (
                              <button
                                className="btn-1 btn-alt"
                                style={{
                                  padding: "7px 14px",
                                  fontSize: 12,
                                  opacity: paying === b._id ? 0.7 : 1,
                                }}
                                onClick={() => handlePay(b)}
                                disabled={paying === b._id}
                              >
                                {paying === b._id ? "..." : "💳 Pay Now"}{" "}
                                <span></span>
                              </button>
                            )}
                          {(b.booking_status === "Pending" ||
                            b.booking_status === "Approved") &&
                            b.payment_status !== "Success" && (
                              <button
                                onClick={() => setCancelModal(b)}
                                style={{
                                  padding: "7px 14px",
                                  fontSize: 12,
                                  background: "#fee2e2",
                                  color: "#dc2626",
                                  border: "1px solid #fca5a5",
                                  borderRadius: 4,
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  fontFamily: "'DM Sans',sans-serif",
                                }}
                              >
                                ✕ Cancel
                              </button>
                            )}
                          {b.booking_status === "Approved" &&
                            b.payment_status === "Success" && (
                              <button
                                onClick={() => {
                                  setFeedbackModal(b);
                                  setFbForm({
                                    rating: 5,
                                    message: "",
                                    review: "",
                                  });
                                }}
                                style={{
                                  padding: "7px 14px",
                                  fontSize: 12,
                                  background: "#fdf8f5",
                                  color: "var(--theme-color)",
                                  border: "1px solid rgba(199,122,99,.3)",
                                  borderRadius: 4,
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  fontFamily: "'DM Sans',sans-serif",
                                }}
                              >
                                ⭐ Write Review
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cancel Modal */}
      {cancelModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,.2)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h4
              style={{
                fontFamily: "'Cormorant',serif",
                color: "#1a1a1a",
                marginBottom: 8,
              }}
            >
              Cancel Booking?
            </h4>
            <p
              style={{
                color: "#888",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                marginBottom: 24,
              }}
            >
              This will cancel your reservation for{" "}
              <strong>
                {cancelModal.venue?.venue_type?.name || "the venue"}
              </strong>
              .
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setCancelModal(null)}
                style={{
                  flex: 1,
                  padding: 12,
                  background: "#f9f6f4",
                  border: "1px solid #e8e0dc",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600,
                  color: "#555",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Keep It
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  flex: 1,
                  padding: 12,
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "1px solid #fca5a5",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,.2)",
            }}
          >
            <h4
              style={{
                fontFamily: "'Cormorant',serif",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 4,
              }}
            >
              Leave a Review
            </h4>
            <p
              style={{
                color: "#888",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                marginBottom: 22,
              }}
            >
              Share your experience with{" "}
              <strong style={{ color: "var(--theme-color)" }}>
                {feedbackModal.venue?.venue_type?.name || "this venue"}
              </strong>
            </p>
            <form onSubmit={handleFeedback}>
              {/* Rating */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    color: "#1a1a1a",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 8,
                    display: "block",
                  }}
                >
                  Rating *
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFbForm((f) => ({ ...f, rating: s }))}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 6,
                        border:
                          s <= fbForm.rating
                            ? "2px solid var(--theme-color)"
                            : "1px solid #e8e0dc",
                        background:
                          s <= fbForm.rating ? "rgba(199,122,99,.1)" : "#fff",
                        color:
                          s <= fbForm.rating ? "var(--theme-color)" : "#ccc",
                        fontSize: 22,
                        cursor: "pointer",
                      }}
                    >
                      ★
                    </button>
                  ))}
                  <span
                    style={{
                      color: "var(--theme-color)",
                      fontFamily: "'Cormorant',serif",
                      fontWeight: 700,
                      fontSize: 18,
                      alignSelf: "center",
                      marginLeft: 6,
                    }}
                  >
                    {fbForm.rating}/5
                  </span>
                </div>
              </div>
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
                  Your Message *
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your experience..."
                  value={fbForm.message}
                  onChange={(e) =>
                    setFbForm((f) => ({ ...f, message: e.target.value }))
                  }
                  required
                  style={{ ...inp, resize: "vertical" }}
                />
              </div>
              <div style={{ marginBottom: 22 }}>
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
                  Short Review *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excellent, Good, Average..."
                  value={fbForm.review}
                  onChange={(e) =>
                    setFbForm((f) => ({ ...f, review: e.target.value }))
                  }
                  required
                  style={inp}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setFeedbackModal(null)}
                  style={{
                    flex: 1,
                    padding: 12,
                    background: "#f9f6f4",
                    border: "1px solid #e8e0dc",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 600,
                    color: "#555",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-1"
                  style={{ flex: 2, textAlign: "center" }}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Review"} <span></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
