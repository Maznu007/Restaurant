import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  HiOutlineCalendar, 
  HiOutlineShoppingBag, 
  HiOutlineStar, 
  HiOutlineLogout,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlinePlus,
  HiOutlineFilter,
  HiOutlineEye
} from "react-icons/hi";
import toast from "react-hot-toast";

const Admin = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalReservations: 0,
    totalReviews: 0,
    pendingOrders: 0,
    pendingReservations: 0,
    pendingReviews: 0,
    todayOrders: 0,
    totalRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchOrders(),
        fetchReservations(),
        fetchReviews(),
        fetchMenu(),
        fetchUsers()
      ]);
    } catch (error) {
      console.error("Admin data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/admin/stats");
      setStats(data.stats);
    } catch (error) {
      console.error("Stats error:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/orders/admin/all");
      setOrders(data.orders || []);
      setFilterStatus("all");
    } catch (error) {
      console.error("Orders error:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const { data } = await axios.get("/api/v1/reservation/admin/all");
      setReservations(data.reservations || []);
      setFilterStatus("all");
    } catch (error) {
      console.error("Reservations error:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get("/api/v1/reviews/admin/all");
      setReviews(data.reviews || []);
      setFilterStatus("all");
    } catch (error) {
      console.error("Reviews error:", error);
    }
  };

  const fetchMenu = async () => {
    try {
      const { data } = await axios.get("http:///api/v1/menu/admin/all");
      setMenuItems(data.menuItems || []);
    } catch (error) {
      console.error("Menu error:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/admin/users");
      setUsers(data.users || []);
    } catch (error) {
      console.error("Users error:", error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/v1/orders/admin/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const updateReservationStatus = async (resId, status) => {
    try {
      await axios.put(`/api/v1/reservation/admin/${resId}/status`, { status });
      toast.success(`Reservation marked as ${status}`);
      fetchReservations();
      fetchStats();
    } catch (error) {
      toast.error("Failed to update reservation status");
    }
  };

  const updateReviewStatus = async (reviewId, isApproved) => {
    try {
      await axios.put(`/api/v1/reviews/admin/${reviewId}/status`, { isApproved });
      toast.success(isApproved ? "Review approved" : "Review rejected");
      fetchReviews();
      fetchStats();
    } catch (error) {
      toast.error("Failed to update review status");
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`/api/v1/reviews/admin/${reviewId}`);
      toast.success("Review deleted");
      fetchReviews();
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const toggleMenuAvailability = async (itemId, currentStatus) => {
    try {
      await axios.put(`/api/v1/menu/admin/${itemId}`, {
        isAvailable: !currentStatus
      });
      toast.success("Menu item updated");
      fetchMenu();
    } catch (error) {
      toast.error("Failed to update menu item");
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

  const getFilteredOrders = () => {
    if (filterStatus === "all") return orders;
    return orders.filter(o => o.status === filterStatus);
  };

  const getFilteredReservations = () => {
    if (filterStatus === "all") return reservations;
    return reservations.filter(r => r.status === filterStatus);
  };

  const getFilteredReviews = () => {
    if (filterStatus === "all") return reviews;
    if (filterStatus === "pending") return reviews.filter(r => !r.isApproved);
    if (filterStatus === "approved") return reviews.filter(r => r.isApproved);
    return reviews;
  };

  const pendingOrders = orders.filter(o => o.status === "pending");
  const pendingReservations = reservations.filter(r => r.status === "pending");
  const pendingReviews = reviews.filter(r => !r.isApproved);

  if (loading) {
    return (
      <div className="dashboardPage">
        <div className="dashboardLoading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboardPage adminPage">
      <div className="dashboardContainer">
        {/* Sidebar */}
        <aside className="dashboardSidebar">
          <div className="sidebarHeader">
            <div className="userAvatar admin">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="userInfo">
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>Administrator</p>
            </div>
          </div>

          <nav className="dashboardNav">
            <button 
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              <HiOutlineClipboardList />
              <span>Overview</span>
            </button>
            <button 
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => { setActiveTab("orders"); setFilterStatus("all"); }}
            >
              <HiOutlineShoppingBag />
              <span>Orders ({pendingOrders.length} pending)</span>
            </button>
            <button 
              className={activeTab === "reservations" ? "active" : ""}
              onClick={() => { setActiveTab("reservations"); setFilterStatus("all"); }}
            >
              <HiOutlineCalendar />
              <span>Reservations ({pendingReservations.length} pending)</span>
            </button>
            <button 
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => { setActiveTab("reviews"); setFilterStatus("all"); }}
            >
              <HiOutlineStar />
              <span>Reviews ({pendingReviews.length} pending)</span>
            </button>
            <button 
              className={activeTab === "menu" ? "active" : ""}
              onClick={() => setActiveTab("menu")}
            >
              <HiOutlineClipboardList />
              <span>Menu ({menuItems.length})</span>
            </button>
            <button 
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              <HiOutlineUsers />
              <span>Users ({users.length})</span>
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
                <h1>Admin Dashboard</h1>
                <p>Welcome back, {user?.firstName}! Here's what's happening today.</p>
              </div>
              
              <div className="statsGrid adminStats">
                <div className="statCard" onClick={() => setActiveTab("orders")}>
                  <div className="statIcon orders">
                    <HiOutlineShoppingBag />
                  </div>
                  <div className="statInfo">
                    <h4>{stats.totalOrders}</h4>
                    <p>Total Orders</p>
                  </div>
                  {stats.pendingOrders > 0 && (
                    <span className="badge pending">{stats.pendingOrders} pending</span>
                  )}
                </div>
                
                <div className="statCard" onClick={() => setActiveTab("reservations")}>
                  <div className="statIcon reservations">
                    <HiOutlineCalendar />
                  </div>
                  <div className="statInfo">
                    <h4>{stats.totalReservations}</h4>
                    <p>Reservations</p>
                  </div>
                  {stats.pendingReservations > 0 && (
                    <span className="badge pending">{stats.pendingReservations} pending</span>
                  )}
                </div>
                
                <div className="statCard" onClick={() => setActiveTab("reviews")}>
                  <div className="statIcon reviews">
                    <HiOutlineStar />
                  </div>
                  <div className="statInfo">
                    <h4>{stats.totalReviews}</h4>
                    <p>Reviews</p>
                  </div>
                  {stats.pendingReviews > 0 && (
                    <span className="badge pending">{stats.pendingReviews} pending</span>
                  )}
                </div>
                
                <div className="statCard">
                  <div className="statIcon users">
                    <HiOutlineUsers />
                  </div>
                  <div className="statInfo">
                    <h4>{stats.totalUsers}</h4>
                    <p>Customers</p>
                  </div>
                </div>
                
                <div className="statCard">
                  <div className="statIcon revenue">
                    <HiOutlineCurrencyDollar />
                  </div>
                  <div className="statInfo">
                    <h4>${stats.totalRevenue.toFixed(2)}</h4>
                    <p>Total Revenue</p>
                  </div>
                </div>
                
                <div className="statCard">
                  <div className="statIcon today">
                    <HiOutlineCalendar />
                  </div>
                  <div className="statInfo">
                    <h4>{stats.todayOrders}</h4>
                    <p>Today's Orders</p>
                  </div>
                </div>
              </div>

              <div className="recentSection">
                <h3>Pending Approvals</h3>
                <div className="pendingGrid">
                  {pendingOrders.slice(0, 2).map((order) => (
                    <div key={order._id} className="pendingCard order">
                      <div className="pendingCardHeader">
                        <div className="pendingIcon" style={{ background: getStatusColor(order.status) }}>
                          <HiOutlineShoppingBag />
                        </div>
                        <span className="pendingType">Order</span>
                      </div>
                      <div className="pendingContent">
                        <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
                        <p className="pendingDetail">{order.items?.length || 0} items • ${order.totalAmount}</p>
                        <p className="pendingCustomer">{order.user?.firstName} {order.user?.lastName}</p>
                      </div>
                      <div className="pendingActions">
                        <button className="btn-icon btn-approve" onClick={() => updateOrderStatus(order._id, "confirmed")}>
                          <HiOutlineCheck />
                        </button>
                        <button className="btn-icon btn-reject" onClick={() => updateOrderStatus(order._id, "cancelled")}>
                          <HiOutlineX />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingReservations.slice(0, 2).map((res) => (
                    <div key={res._id} className="pendingCard reservation">
                      <div className="pendingCardHeader">
                        <div className="pendingIcon" style={{ background: getStatusColor(res.status) }}>
                          <HiOutlineCalendar />
                        </div>
                        <span className="pendingType">Reservation</span>
                      </div>
                      <div className="pendingContent">
                        <h4>{res.firstName} {res.lastName}</h4>
                        <p className="pendingDetail">{res.date} at {res.time}</p>
                        <p className="pendingCustomer">{res.partySize} guests • {res.phone}</p>
                      </div>
                      <div className="pendingActions">
                        <button className="btn-icon btn-approve" onClick={() => updateReservationStatus(res._id, "confirmed")}>
                          <HiOutlineCheck />
                        </button>
                        <button className="btn-icon btn-reject" onClick={() => updateReservationStatus(res._id, "cancelled")}>
                          <HiOutlineX />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingReviews.slice(0, 2).map((review) => (
                    <div key={review._id} className="pendingCard review">
                      <div className="pendingCardHeader">
                        <div className="pendingIcon" style={{ background: "var(--color-gold)" }}>
                          <HiOutlineStar />
                        </div>
                        <span className="pendingType">Review</span>
                      </div>
                      <div className="pendingContent">
                        <h4>{review.dish?.name}</h4>
                        <p className="pendingDetail stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                        <p className="pendingCustomer">{review.user?.firstName} {review.user?.lastName}</p>
                      </div>
                      <div className="pendingActions">
                        <button className="btn-icon btn-approve" onClick={() => updateReviewStatus(review._id, true)}>
                          <HiOutlineCheck />
                        </button>
                        <button className="btn-icon btn-reject" onClick={() => updateReviewStatus(review._id, false)}>
                          <HiOutlineX />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingOrders.length === 0 && pendingReservations.length === 0 && pendingReviews.length === 0 && (
                    <div className="emptyPending">
                      <div className="emptyIcon">✓</div>
                      <p>All caught up! No pending approvals.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="dashboardSection">
              <div className="sectionHeader">
                <h1>All Orders</h1>
                <div className="filterBar">
                  <HiOutlineFilter className="filterIcon" />
                  <div className="filterTabs">
                    <button 
                      className={filterStatus === "all" ? "active" : ""} 
                      onClick={() => setFilterStatus("all")}
                    >
                      All <span className="count">{orders.length}</span>
                    </button>
                    <button 
                      className={filterStatus === "pending" ? "active" : ""} 
                      onClick={() => setFilterStatus("pending")}
                    >
                      Pending <span className="count">{orders.filter(o => o.status === "pending").length}</span>
                    </button>
                    <button 
                      className={filterStatus === "confirmed" ? "active" : ""} 
                      onClick={() => setFilterStatus("confirmed")}
                    >
                      Confirmed <span className="count">{orders.filter(o => o.status === "confirmed").length}</span>
                    </button>
                    <button 
                      className={filterStatus === "preparing" ? "active" : ""} 
                      onClick={() => setFilterStatus("preparing")}
                    >
                      Preparing <span className="count">{orders.filter(o => o.status === "preparing").length}</span>
                    </button>
                    <button 
                      className={filterStatus === "ready" ? "active" : ""} 
                      onClick={() => setFilterStatus("ready")}
                    >
                      Ready <span className="count">{orders.filter(o => o.status === "ready").length}</span>
                    </button>
                    <button 
                      className={filterStatus === "completed" ? "active" : ""} 
                      onClick={() => setFilterStatus("completed")}
                    >
                      Completed <span className="count">{orders.filter(o => o.status === "completed").length}</span>
                    </button>
                    <button 
                      className={filterStatus === "cancelled" ? "active" : ""} 
                      onClick={() => setFilterStatus("cancelled")}
                    >
                      Cancelled <span className="count">{orders.filter(o => o.status === "cancelled").length}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="adminList">
                {getFilteredOrders().map((order) => (
                  <div key={order._id} className="adminCard">
                    <div className="cardHeader">
                      <div className="orderInfo">
                        <div className="orderId">
                          <span className="label">Order</span>
                          <h4>#{order._id.slice(-6).toUpperCase()}</h4>
                        </div>
                        <div className="orderMeta">
                          <span className="date">{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</span>
                          <span className="customer">{order.user?.firstName} {order.user?.lastName}</span>
                          <span className="contact">{order.user?.email} • {order.user?.phone}</span>
                        </div>
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
                          <strong>Note:</strong> {order.specialInstructions}
                        </div>
                      )}
                    </div>
                    
                    <div className="cardFooter">
                      <div className="orderDetails">
                        <span className="detail"><strong>Type:</strong> {order.orderType}</span>
                        {order.pickupTime && (
                          <span className="detail"><strong>Pickup:</strong> {formatDate(order.pickupTime)} {formatTime(order.pickupTime)}</span>
                        )}
                      </div>
                      <div className="actionButtons">
                        <span className="totalAmount">${order.totalAmount?.toFixed(2)}</span>
                        {order.status === "pending" && (
                          <>
                            <button className="btn btn-primary" onClick={() => updateOrderStatus(order._id, "confirmed")}>
                              Confirm
                            </button>
                            <button className="btn btn-danger" onClick={() => updateOrderStatus(order._id, "cancelled")}>
                              Cancel
                            </button>
                          </>
                        )}
                        {order.status === "confirmed" && (
                          <button className="btn btn-primary" onClick={() => updateOrderStatus(order._id, "preparing")}>
                            Start Preparing
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button className="btn btn-primary" onClick={() => updateOrderStatus(order._id, "ready")}>
                            Mark Ready
                          </button>
                        )}
                        {order.status === "ready" && (
                          <button className="btn btn-success" onClick={() => updateOrderStatus(order._id, "completed")}>
                            Complete
                          </button>
                        )}
                        {order.status === "completed" && (
                          <span className="completedBadge">✓ Completed</span>
                        )}
                        {order.status === "cancelled" && (
                          <span className="cancelledBadge">✗ Cancelled</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reservations" && (
            <div className="dashboardSection">
              <div className="sectionHeader">
                <h1>All Reservations</h1>
                <div className="filterBar">
                  <HiOutlineFilter className="filterIcon" />
                  <div className="filterTabs">
                    <button 
                      className={filterStatus === "all" ? "active" : ""} 
                      onClick={() => setFilterStatus("all")}
                    >
                      All <span className="count">{reservations.length}</span>
                    </button>
                    <button 
                      className={filterStatus === "pending" ? "active" : ""} 
                      onClick={() => setFilterStatus("pending")}
                    >
                      Pending <span className="count">{reservations.filter(r => r.status === "pending").length}</span>
                    </button>
                    <button 
                      className={filterStatus === "confirmed" ? "active" : ""} 
                      onClick={() => setFilterStatus("confirmed")}
                    >
                      Confirmed <span className="count">{reservations.filter(r => r.status === "confirmed").length}</span>
                    </button>
                    <button 
                      className={filterStatus === "seated" ? "active" : ""} 
                      onClick={() => setFilterStatus("seated")}
                    >
                      Seated <span className="count">{reservations.filter(r => r.status === "seated").length}</span>
                    </button>
                    <button 
                      className={filterStatus === "completed" ? "active" : ""} 
                      onClick={() => setFilterStatus("completed")}
                    >
                      Completed <span className="count">{reservations.filter(r => r.status === "completed").length}</span>
                    </button>
                    <button 
                      className={filterStatus === "cancelled" ? "active" : ""} 
                      onClick={() => setFilterStatus("cancelled")}
                    >
                      Cancelled <span className="count">{reservations.filter(r => r.status === "cancelled").length}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="adminList">
                {getFilteredReservations().map((res) => (
                  <div key={res._id} className="adminCard">
                    <div className="cardHeader">
                      <div className="reservationInfo">
                        <div className="reservationName">
                          <span className="label">Reservation</span>
                          <h4>{res.firstName} {res.lastName}</h4>
                        </div>
                        <div className="reservationMeta">
                          <span className="dateTime">{res.date} at {res.time}</span>
                          <span className="contact">{res.email} • {res.phone}</span>
                        </div>
                      </div>
                      <span className="statusBadge" style={{ background: getStatusColor(res.status || "pending") }}>
                        {res.status || "Pending"}
                      </span>
                    </div>
                    
                    <div className="cardBody">
                      <div className="reservationDetails">
                        <div className="detailItem">
                          <span className="detailLabel">Party Size</span>
                          <span className="detailValue">{res.partySize || "Not specified"} guests</span>
                        </div>
                        {res.notes && (
                          <div className="detailItem full">
                            <span className="detailLabel">Special Requests</span>
                            <span className="detailValue">{res.notes}</span>
                          </div>
                        )}
                        {res.user && (
                          <div className="detailItem">
                            <span className="detailLabel">User Type</span>
                            <span className="detailValue registered">Registered Member</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="cardFooter">
                      <span className="bookedDate">Booked on {formatDate(res.createdAt)}</span>
                      <div className="actionButtons">
                        {(res.status === "pending" || !res.status) && (
                          <>
                            <button className="btn btn-primary" onClick={() => updateReservationStatus(res._id, "confirmed")}>
                              Confirm
                            </button>
                            <button className="btn btn-danger" onClick={() => updateReservationStatus(res._id, "cancelled")}>
                              Cancel
                            </button>
                          </>
                        )}
                        {res.status === "confirmed" && (
                          <button className="btn btn-primary" onClick={() => updateReservationStatus(res._id, "seated")}>
                            Mark Seated
                          </button>
                        )}
                        {res.status === "seated" && (
                          <button className="btn btn-success" onClick={() => updateReservationStatus(res._id, "completed")}>
                            Complete
                          </button>
                        )}
                        {res.status === "completed" && (
                          <span className="completedBadge">✓ Completed</span>
                        )}
                        {res.status === "cancelled" && (
                          <span className="cancelledBadge">✗ Cancelled</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="dashboardSection">
              <div className="sectionHeader">
                <h1>All Reviews</h1>
                <div className="filterBar">
                  <HiOutlineFilter className="filterIcon" />
                  <div className="filterTabs">
                    <button 
                      className={filterStatus === "all" ? "active" : ""} 
                      onClick={() => setFilterStatus("all")}
                    >
                      All <span className="count">{reviews.length}</span>
                    </button>
                    <button 
                      className={filterStatus === "pending" ? "active" : ""} 
                      onClick={() => setFilterStatus("pending")}
                    >
                      Pending <span className="count">{pendingReviews.length}</span>
                    </button>
                    <button 
                      className={filterStatus === "approved" ? "active" : ""} 
                      onClick={() => setFilterStatus("approved")}
                    >
                      Approved <span className="count">{reviews.filter(r => r.isApproved).length}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="adminList">
                {getFilteredReviews().map((review) => (
                  <div key={review._id} className="adminCard reviewCard">
                    <div className="cardHeader">
                      <div className="reviewInfo">
                        <img src={review.dish?.image || "/default-dish.png"} alt={review.dish?.name} />
                        <div className="reviewMeta">
                          <h4>{review.dish?.name}</h4>
                          <div className="stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                          <span className="reviewer">By {review.user?.firstName} {review.user?.lastName} • {review.user?.email}</span>
                        </div>
                      </div>
                      <span className={`statusBadge ${review.isApproved ? "approved" : "pending"}`}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    
                    <div className="cardBody">
                      <p className="reviewText">"{review.comment}"</p>
                    </div>
                    
                    <div className="cardFooter">
                      <span className="postedDate">Posted on {formatDate(review.createdAt)}</span>
                      <div className="actionButtons">
                        {!review.isApproved ? (
                          <button className="btn btn-success" onClick={() => updateReviewStatus(review._id, true)}>
                            Approve
                          </button>
                        ) : (
                          <button className="btn btn-secondary" onClick={() => updateReviewStatus(review._id, false)}>
                            Unapprove
                          </button>
                        )}
                        <button className="btn btn-danger btn-icon-only" onClick={() => deleteReview(review._id)}>
                          <HiOutlineX />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "menu" && (
            <div className="dashboardSection">
              <div className="sectionHeader">
                <h1>Menu Management</h1>
                <button className="btn btn-primary btn-with-icon" onClick={() => toast.info("Add menu item feature coming soon")}>
                  <HiOutlinePlus /> Add New Item
                </button>
              </div>
              
              <div className="adminList menuList">
                {menuItems.map((item) => (
                  <div key={item._id} className="adminCard menuCard">
                    <div className="cardHeader">
                      <div className="menuItemHeader">
                        <img src={item.image} alt={item.name} />
                        <div className="menuItemDetails">
                          <div className="menuItemTitle">
                            <h4>{item.name}</h4>
                            {item.isSpecial && <span className="specialBadge">Special</span>}
                          </div>
                          <span className="category">{item.category}</span>
                          <span className="price">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <span className={`statusBadge ${item.isAvailable ? "available" : "unavailable"}`}>
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    
                    <div className="cardBody">
                      <p className="description">{item.description}</p>
                      <div className="menuMeta">
                        <span><strong>Ingredients:</strong> {item.ingredients?.join(", ")}</span>
                        {item.dietaryTags?.length > 0 && (
                          <span><strong>Dietary:</strong> {item.dietaryTags.join(", ")}</span>
                        )}
                        <span className="rating">★ {item.averageRating?.toFixed(1) || 0} ({item.reviewCount || 0} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="cardFooter">
                      <button 
                        className={`btn ${item.isAvailable ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => toggleMenuAvailability(item._id, item.isAvailable)}
                      >
                        {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                      </button>
                      <div className="actionButtons">
                        <button className="btn btn-secondary btn-icon-only">
                          <HiOutlineEye />
                        </button>
                        <button className="btn btn-secondary btn-icon-only">
                          <HiOutlineFilter />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="dashboardSection">
              <div className="sectionHeader">
                <h1>Customer Management</h1>
                <p className="subtitle">Total registered customers: {users.length}</p>
              </div>
              
              <div className="adminList usersList">
                {users.map((userItem) => (
                  <div key={userItem._id} className="adminCard userCard">
                    <div className="userContent">
                      <div className="userAvatarSmall">
                        {userItem.firstName[0]}{userItem.lastName[0]}
                      </div>
                      <div className="userDetails">
                        <h4>{userItem.firstName} {userItem.lastName}</h4>
                        <p className="userEmail">{userItem.email}</p>
                        <p className="userPhone">{userItem.phone}</p>
                      </div>
                    </div>
                    <div className="userMeta">
                      <span className="joinedDate">Joined {formatDate(userItem.createdAt)}</span>
                      <button className="btn btn-secondary btn-sm">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;