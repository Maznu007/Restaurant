import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiOutlineCalendar, HiOutlineShoppingBag, HiOutlineStar, HiOutlineClock } from "react-icons/hi";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch orders
      const ordersRes = await axios.get("http://localhost:4000/api/v1/orders/my-orders");
      setOrders(ordersRes.data.orders);

      // For now, reservations are not user-linked in original schema
      // We'll fetch all and filter by email as temporary solution
      // In production, reservation schema should have userId reference
      
      setReservations([]); // Placeholder until reservation schema updated

      // Fetch reviews
      const reviewsRes = await axios.get("http://localhost:4000/api/v1/reviews/my-reviews");
      setReviews(reviewsRes.data.reviews);

    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#d4af37",
      confirmed: "#4CAF50",
      preparing: "#ff9800",
      ready: "#2196F3",
      completed: "#4CAF50",
      cancelled: "#f44336",
    };
    return colors[status] || "#888";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="dashboardPage">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboardPage">
      <div className="dashboardContainer">
        {/* Sidebar */}
        <aside className="dashboardSidebar">
          <div className="userInfo">
            <div className="userAvatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <h3>{user?.firstName} {user?.lastName}</h3>
            <p>{user?.email}</p>
          </div>

          <nav className="dashboardNav">
            <button 
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              <HiOutlineCalendar /> Overview
            </button>
            <button 
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              <HiOutlineShoppingBag /> My Orders ({orders.length})
            </button>
            <button 
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              <HiOutlineStar /> My Reviews ({reviews.length})
            </button>
            <button 
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              Profile Settings
            </button>
          </nav>

          <button className="logoutBtn" onClick={() => { logout(); navigate("/"); }}>
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="dashboardMain">
          {activeTab === "overview" && (
            <div className="dashboardOverview">
              <h1>Welcome back, {user?.firstName}!</h1>
              
              <div className="statsGrid">
                <div className="statCard">
                  <HiOutlineShoppingBag />
                  <div>
                    <h4>{orders.length}</h4>
                    <p>Total Orders</p>
                  </div>
                </div>
                <div className="statCard">
                  <HiOutlineCalendar />
                  <div>
                    <h4>{reservations.length}</h4>
                    <p>Reservations</p>
                  </div>
                </div>
                <div className="statCard">
                  <HiOutlineStar />
                  <div>
                    <h4>{reviews.length}</h4>
                    <p>Reviews Given</p>
                  </div>
                </div>
              </div>

              <div className="recentActivity">
                <h3>Recent Orders</h3>
                {orders.slice(0, 3).map((order) => (
                  <div key={order._id} className="activityItem">
                    <div className="activityIcon" style={{ background: getStatusColor(order.status) }}>
                      <HiOutlineShoppingBag />
                    </div>
                    <div className="activityDetails">
                      <h4>Order #{order._id.slice(-6)}</h4>
                      <p>{order.items.length} items • ${order.totalAmount}</p>
                      <span style={{ color: getStatusColor(order.status) }}>
                        {order.status}
                      </span>
                    </div>
                    <div className="activityDate">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="noData">No orders yet. <button onClick={() => navigate("/#menu")}>Order now</button></p>}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="dashboardOrders">
              <h1>My Orders</h1>
              {orders.length === 0 ? (
                <div className="emptyState">
                  <p>You haven't placed any orders yet.</p>
                  <button onClick={() => navigate("/#menu")}>Browse Menu</button>
                </div>
              ) : (
                <div className="ordersList">
                  {orders.map((order) => (
                    <div key={order._id} className="orderCard">
                      <div className="orderHeader">
                        <div>
                          <h4>Order #{order._id.slice(-6)}</h4>
                          <p>{formatDate(order.createdAt)}</p>
                        </div>
                        <span className="orderStatus" style={{ background: getStatusColor(order.status) }}>
                          {order.status}
                        </span>
                      </div>
                      <div className="orderItems">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="orderItem">
                            <span>{item.quantity}x</span>
                            <span>{item.name}</span>
                            <span>${item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="orderTotal">
                        <strong>Total: ${order.totalAmount}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="dashboardReviews">
              <h1>My Reviews</h1>
              {reviews.length === 0 ? (
                <div className="emptyState">
                  <p>You haven't reviewed any dishes yet.</p>
                  <button onClick={() => navigate("/#menu")}>Order & Review</button>
                </div>
              ) : (
                <div className="reviewsList">
                  {reviews.map((review) => (
                    <div key={review._id} className="reviewCard">
                      <div className="reviewHeader">
                        <img src={review.dish?.image || "/default-dish.png"} alt={review.dish?.name} />
                        <div>
                          <h4>{review.dish?.name}</h4>
                          <div className="stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                        </div>
                        <span className={review.isApproved ? "approved" : "pending"}>
                          {review.isApproved ? "Approved" : "Pending"}
                        </span>
                      </div>
                      <p>{review.comment}</p>
                      <small>{formatDate(review.createdAt)}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="dashboardProfile">
              <h1>Profile Settings</h1>
              <div className="profileInfo">
                <div className="infoRow">
                  <label>Name</label>
                  <p>{user?.firstName} {user?.lastName}</p>
                </div>
                <div className="infoRow">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className="infoRow">
                  <label>Phone</label>
                  <p>{user?.phone}</p>
                </div>
                <div className="infoRow">
                  <label>Member Since</label>
                  <p>{formatDate(user?.createdAt)}</p>
                </div>
              </div>
              <p className="note">Profile editing coming soon. Contact support to update information.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;