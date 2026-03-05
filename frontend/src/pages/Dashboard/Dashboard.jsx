import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  HiOutlineCalendar, 
  HiOutlineShoppingBag, 
  HiOutlineStar, 
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineChevronRight
} from "react-icons/hi";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "overview");
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

  // Update active tab when location state changes
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const fetchUserData = async () => {
    try {
      // Fetch orders
      const ordersRes = await axios.get("http://localhost:4000/api/v1/orders/my-orders");
      const ordersData = ordersRes.data.orders || [];
      setOrders(ordersData);

      // Fetch reservations by email
      let reservationsData = [];
      try {
        const resRes = await axios.get(`http://localhost:4000/api/v1/reservation/my-reservations?email=${user.email}`);
        reservationsData = resRes.data.reservations || [];
        setReservations(reservationsData);
      } catch (e) {
        setReservations([]);
      }

      // Fetch reviews
      const reviewsRes = await axios.get("http://localhost:4000/api/v1/reviews/my-reviews");
      const reviewsData = reviewsRes.data.reviews || [];
      setReviews(reviewsData);

    } catch (error) {
      console.error("Dashboard data error:", error);
      toast.error("Failed to load some dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from actual data
  const stats = {
    orders: orders.length,
    reservations: reservations.length,
    reviews: reviews.length
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#d4af37",
      confirmed: "#4CAF50",
      preparing: "#ff9800",
      ready: "#2196F3",
      completed: "#4CAF50",
      cancelled: "#f44336",
      seated: "#4CAF50",
      "no-show": "#f44336"
    };
    return colors[status] || "#888";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="dashboardPage">
        <div className="dashboardLoading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboardPage">
      <div className="dashboardContainer">
        {/* Sidebar */}
        <aside className="dashboardSidebar">
          <div className="sidebarHeader">
            <div className="userAvatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="userInfo">
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <nav className="dashboardNav">
            <button 
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              <HiOutlineCalendar />
              <span>Overview</span>
            </button>
            <button 
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              <HiOutlineShoppingBag />
              <span>My Orders ({stats.orders})</span>
            </button>
            <button 
              className={activeTab === "reservations" ? "active" : ""}
              onClick={() => setActiveTab("reservations")}
            >
              <HiOutlineCalendar />
              <span>My Reservations ({stats.reservations})</span>
            </button>
            <button 
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              <HiOutlineStar />
              <span>My Reviews ({stats.reviews})</span>
            </button>
            <button 
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              <HiOutlineUser />
              <span>Profile</span>
            </button>
          </nav>

          <button className="sidebarLogout" onClick={() => { logout(); navigate("/"); }}>
            <HiOutlineLogout />
            <span>Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="dashboardMain">
          {activeTab === "overview" && (
            <div className="dashboardSection">
              <div className="sectionHeader">
                <h1>Welcome back, {user?.firstName}!</h1>
                <p>Here's what's happening with your account</p>
              </div>
              
              <div className="statsGrid">
                <div className="statCard" onClick={() => setActiveTab("orders")}>
                  <div className="statIcon orders">
                    <HiOutlineShoppingBag />
                  </div>
                  <div className="statInfo">
                    <h4>{stats.orders}</h4>
                    <p>Total Orders</p>
                  </div>
                  <HiOutlineChevronRight className="statArrow" />
                </div>
                <div className="statCard" onClick={() => setActiveTab("reservations")}>
                  <div className="statIcon reservations">
                    <HiOutlineCalendar />
                  </div>
                  <div className="statInfo">
                    <h4>{stats.reservations}</h4>
                    <p>Reservations</p>
                  </div>
                  <HiOutlineChevronRight className="statArrow" />
                </div>
                <div className="statCard" onClick={() => setActiveTab("reviews")}>
                  <div className="statIcon reviews">
                    <HiOutlineStar />
                  </div>
                  <div className="statInfo">
                    <h4>{stats.reviews}</h4>
                    <p>Reviews Given</p>
                  </div>
                  <HiOutlineChevronRight className="statArrow" />
                </div>
              </div>

              <div className="recentSection">
                <h3>Recent Activity</h3>
                <div className="activityList">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="activityItem">
                      <div className="activityIcon" style={{ background: getStatusColor(order.status) }}>
                        <HiOutlineShoppingBag />
                      </div>
                      <div className="activityContent">
                        <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
                        <p>{order.items?.length || 0} items • ${order.totalAmount}</p>
                      </div>
                      <div className="activityMeta">
                        <span className="status" style={{ color: getStatusColor(order.status) }}>
                          {order.status}
                        </span>
                        <span className="date">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="emptyActivity">
                      <p>No orders yet. <button onClick={() => navigate("/#menu")}>Browse menu</button></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="dashboardSection">
              <div className="sectionHeader">
                <h1>My Orders</h1>
                <button className="actionBtn" onClick={() => navigate("/#menu")}>+ New Order</button>
              </div>
              {orders.length === 0 ? (
                <div className="emptyState">
                  <HiOutlineShoppingBag className="emptyIcon" />
                  <h3>No orders yet</h3>
                  <p>Start ordering delicious food from our menu</p>
                  <button onClick={() => navigate("/#menu")}>Browse Menu</button>
                </div>
              ) : (
                <div className="ordersList">
                  {orders.map((order) => (
                    <div key={order._id} className="detailCard">
                      <div className="cardHeader">
                        <div>
                          <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
                          <span className="timestamp">{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</span>
                        </div>
                        <span className="statusBadge" style={{ background: getStatusColor(order.status) }}>
                          {order.status}
                        </span>
                      </div>
                      <div className="cardBody">
                        <div className="itemsList">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="itemRow">
                              <span className="qty">{item.quantity}x</span>
                              <span className="name">{item.name}</span>
                              <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        {order.specialInstructions && (
                          <div className="specialNotes">
                            <strong>Special Instructions:</strong> {order.specialInstructions}
                          </div>
                        )}
                      </div>
                      <div className="cardFooter">
                        <div className="meta">
                          <span>Type: {order.orderType}</span>
                          {order.pickupTime && <span>Pickup: {formatDate(order.pickupTime)} {formatTime(order.pickupTime)}</span>}
                        </div>
                        <div className="total">Total: <strong>${order.totalAmount?.toFixed(2)}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "reservations" && (
            <div className="dashboardSection">
              <div className="sectionHeader">
                <h1>My Reservations</h1>
                <button className="actionBtn" onClick={() => navigate("/#reservation")}>+ New Reservation</button>
              </div>
              {reservations.length === 0 ? (
                <div className="emptyState">
                  <HiOutlineCalendar className="emptyIcon" />
                  <h3>No reservations</h3>
                  <p>Book a table for your next dining experience</p>
                  <button onClick={() => navigate("/#reservation")}>Make Reservation</button>
                </div>
              ) : (
                <div className="reservationsList">
                  {reservations.map((res) => (
                    <div key={res._id} className="detailCard">
                      <div className="cardHeader">
                        <div>
                          <h4>Reservation for {res.firstName} {res.lastName}</h4>
                          <span className="timestamp">{res.date} at {res.time}</span>
                        </div>
                        <span className="statusBadge" style={{ background: getStatusColor(res.status || "pending") }}>
                          {res.status || "Pending"}
                        </span>
                      </div>
                      <div className="cardBody">
                        <div className="resDetails">
                          <p><strong>Party Size:</strong> {res.partySize || "Not specified"} guests</p>
                          <p><strong>Phone:</strong> {res.phone}</p>
                          <p><strong>Email:</strong> {res.email}</p>
                          {res.notes && <p><strong>Notes:</strong> {res.notes}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="dashboardSection">
              <div className="sectionHeader">
                <h1>My Reviews</h1>
                <button className="actionBtn" onClick={() => navigate("/#menu")}>+ Write Review</button>
              </div>
              {reviews.length === 0 ? (
                <div className="emptyState">
                  <HiOutlineStar className="emptyIcon" />
                  <h3>No reviews yet</h3>
                  <p>Share your thoughts on dishes you've tried</p>
                  <button onClick={() => navigate("/#menu")}>Order & Review</button>
                </div>
              ) : (
                <div className="reviewsList">
                  {reviews.map((review) => (
                    <div key={review._id} className="detailCard reviewCard">
                      <div className="cardHeader">
                        <div className="reviewDish">
                          <img src={review.dish?.image || "/default-dish.png"} alt={review.dish?.name} />
                          <div>
                            <h4>{review.dish?.name}</h4>
                            <div className="stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                          </div>
                        </div>
                        <span className={`statusBadge ${review.isApproved ? "approved" : "pending"}`}>
                          {review.isApproved ? "Approved" : "Pending Approval"}
                        </span>
                      </div>
                      <div className="cardBody">
                        <p className="reviewText">"{review.comment}"</p>
                      </div>
                      <div className="cardFooter">
                        <span className="timestamp">Posted on {formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="dashboardSection">
              <div className="sectionHeader">
                <h1>Profile Settings</h1>
              </div>
              <div className="profileCard">
                <div className="profileAvatarLarge">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="profileDetails">
                  <div className="detailRow">
                    <label>Full Name</label>
                    <p>{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div className="detailRow">
                    <label>Email Address</label>
                    <p>{user?.email}</p>
                  </div>
                  <div className="detailRow">
                    <label>Phone Number</label>
                    <p>{user?.phone}</p>
                  </div>
                  <div className="detailRow">
                    <label>Account Type</label>
                    <p className="capitalize">{user?.role}</p>
                  </div>
                  <div className="detailRow">
                    <label>Member Since</label>
                    <p>{formatDate(user?.createdAt)}</p>
                  </div>
                </div>
                <p className="profileNote">To update your information, please contact support.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;