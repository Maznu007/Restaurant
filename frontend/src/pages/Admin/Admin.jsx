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
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineChevronRight,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlinePlus
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
      const { data } = await axios.get("http://localhost:4000/api/v1/auth/admin/stats");
      setStats(data.stats);
    } catch (error) {
      console.error("Stats error:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/orders/admin/all");
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Orders error:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/reservation/admin/all");
      setReservations(data.reservations || []);
    } catch (error) {
      console.error("Reservations error:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/reviews/admin/all");
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Reviews error:", error);
    }
  };

  const fetchMenu = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/menu/admin/all");
      setMenuItems(data.menuItems || []);
    } catch (error) {
      console.error("Menu error:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/auth/admin/users");
      setUsers(data.users || []);
    } catch (error) {
      console.error("Users error:", error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/orders/admin/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const updateReservationStatus = async (resId, status) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/reservation/admin/${resId}/status`, { status });
      toast.success(`Reservation marked as ${status}`);
      fetchReservations();
      fetchStats();
    } catch (error) {
      toast.error("Failed to update reservation status");
    }
  };

  const updateReviewStatus = async (reviewId, isApproved) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/reviews/admin/${reviewId}/status`, { isApproved });
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
      await axios.delete(`http://localhost:4000/api/v1/reviews/admin/${reviewId}`);
      toast.success("Review deleted");
      fetchReviews();
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const toggleMenuAvailability = async (itemId, currentStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/menu/admin/${itemId}`, {
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
              onClick={() => setActiveTab("orders")}
            >
              <HiOutlineShoppingBag />
              <span>Orders ({pendingOrders.length} pending)</span>
            </button>
            <button 
              className={activeTab === "reservations" ? "active" : ""}
              onClick={() => setActiveTab("reservations")}
            >
              <HiOutlineCalendar />
              <span>Reservations ({pendingReservations.length} pending)</span>
            </button>
            <button 
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
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
                  {pendingOrders.slice(0, 3).map((order) => (
                    <div key={order._id} className="pendingCard order">
                      <div className="pendingIcon" style={{ background: getStatusColor(order.status) }}>
                        <HiOutlineShoppingBag />
                      </div>
                      <div className="pendingContent">
                        <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
                        <p>{order.items?.length || 0} items • ${order.totalAmount}</p>
                        <p className="customer">By: {order.user?.firstName} {order.user?.lastName}</p>
                      </div>
                      <div className="pendingActions">
                        <button onClick={() => updateOrderStatus(order._id, "confirmed")}>
                          <HiOutlineCheckCircle />
                        </button>
                        <button onClick={() => updateOrderStatus(order._id, "cancelled")} className="reject">
                          <HiOutlineXCircle />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingReservations.slice(0, 3).map((res) => (
                    <div key={res._id} className="pendingCard reservation">
                      <div className="pendingIcon" style={{ background: getStatusColor(res.status) }}>
                        <HiOutlineCalendar />
                      </div>
                      <div className="pendingContent">
                        <h4>Reservation for {res.firstName} {res.lastName}</h4>
                        <p>{res.date} at {res.time}</p>
                        <p className="customer">{res.partySize} guests • {res.phone}</p>
                      </div>
                      <div className="pendingActions">
                        <button onClick={() => updateReservationStatus(res._id, "confirmed")}>
                          <HiOutlineCheckCircle />
                        </button>
                        <button onClick={() => updateReservationStatus(res._id, "cancelled")} className="reject">
                          <HiOutlineXCircle />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingReviews.slice(0, 3).map((review) => (
                    <div key={review._id} className="pendingCard review">
                      <div className="pendingIcon">
                        <HiOutlineStar />
                      </div>
                      <div className="pendingContent">
                        <h4>Review for {review.dish?.name}</h4>
                        <p>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                        <p className="customer">By: {review.user?.firstName} {review.user?.lastName}</p>
                      </div>
                      <div className="pendingActions">
                        <button onClick={() => updateReviewStatus(review._id, true)}>
                          <HiOutlineCheckCircle />
                        </button>
                        <button onClick={() => updateReviewStatus(review._id, false)} className="reject">
                          <HiOutlineXCircle />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingOrders.length === 0 && pendingReservations.length === 0 && pendingReviews.length === 0 && (
                    <div className="emptyPending">
                      <p>No pending approvals. All caught up!</p>
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
                <div className="filterTabs">
                  <button onClick={fetchOrders}>All ({orders.length})</button>
                  <button onClick={() => setOrders(orders.filter(o => o.status === "pending"))}>
                    Pending ({pendingOrders.length})
                  </button>
                </div>
              </div>
              
              <div className="ordersList adminList">
                {orders.map((order) => (
                  <div key={order._id} className="detailCard adminCard">
                    <div className="cardHeader">
                      <div>
                        <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
                        <span className="timestamp">{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</span>
                        <p className="customerInfo">
                          By: <strong>{order.user?.firstName} {order.user?.lastName}</strong> • {order.user?.email} • {order.user?.phone}
                        </p>
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
                    <div className="cardFooter adminFooter">
                      <div className="meta">
                        <span>Type: {order.orderType}</span>
                        {order.pickupTime && <span>Pickup: {formatDate(order.pickupTime)} {formatTime(order.pickupTime)}</span>}
                      </div>
                      <div className="adminActions">
                        <span className="total">Total: <strong>${order.totalAmount?.toFixed(2)}</strong></span>
                        {order.status === "pending" && (
                          <>
                            <button className="approveBtn" onClick={() => updateOrderStatus(order._id, "confirmed")}>
                              Confirm
                            </button>
                            <button className="rejectBtn" onClick={() => updateOrderStatus(order._id, "cancelled")}>
                              Cancel
                            </button>
                          </>
                        )}
                        {order.status === "confirmed" && (
                          <button className="actionBtn" onClick={() => updateOrderStatus(order._id, "preparing")}>
                            Start Preparing
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button className="actionBtn" onClick={() => updateOrderStatus(order._id, "ready")}>
                            Mark Ready
                          </button>
                        )}
                        {order.status === "ready" && (
                          <button className="approveBtn" onClick={() => updateOrderStatus(order._id, "completed")}>
                            Complete
                          </button>
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
                <div className="filterTabs">
                  <button onClick={fetchReservations}>All ({reservations.length})</button>
                  <button onClick={() => setReservations(reservations.filter(r => r.status === "pending"))}>
                    Pending ({pendingReservations.length})
                  </button>
                </div>
              </div>
              
              <div className="reservationsList adminList">
                {reservations.map((res) => (
                  <div key={res._id} className="detailCard adminCard">
                    <div className="cardHeader">
                      <div>
                        <h4>Reservation for {res.firstName} {res.lastName}</h4>
                        <span className="timestamp">{res.date} at {res.time}</span>
                        <p className="customerInfo">
                          {res.email} • {res.phone}
                        </p>
                      </div>
                      <span className="statusBadge" style={{ background: getStatusColor(res.status || "pending") }}>
                        {res.status || "Pending"}
                      </span>
                    </div>
                    <div className="cardBody">
                      <div className="resDetails">
                        <p><strong>Party Size:</strong> {res.partySize || "Not specified"} guests</p>
                        {res.notes && <p><strong>Notes:</strong> {res.notes}</p>}
                        {res.user && <p><strong>Registered User:</strong> Yes</p>}
                      </div>
                    </div>
                    <div className="cardFooter adminFooter">
                      <span className="timestamp">Booked on {formatDate(res.createdAt)}</span>
                      <div className="adminActions">
                        {(res.status === "pending" || !res.status) && (
                          <>
                            <button className="approveBtn" onClick={() => updateReservationStatus(res._id, "confirmed")}>
                              Confirm
                            </button>
                            <button className="rejectBtn" onClick={() => updateReservationStatus(res._id, "cancelled")}>
                              Cancel
                            </button>
                          </>
                        )}
                        {res.status === "confirmed" && (
                          <button className="actionBtn" onClick={() => updateReservationStatus(res._id, "seated")}>
                            Mark Seated
                          </button>
                        )}
                        {res.status === "seated" && (
                          <button className="approveBtn" onClick={() => updateReservationStatus(res._id, "completed")}>
                            Complete
                          </button>
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
                <div className="filterTabs">
                  <button onClick={fetchReviews}>All ({reviews.length})</button>
                  <button onClick={() => setReviews(reviews.filter(r => !r.isApproved))}>
                    Pending ({pendingReviews.length})
                  </button>
                  <button onClick={() => setReviews(reviews.filter(r => r.isApproved))}>
                    Approved ({reviews.filter(r => r.isApproved).length})
                  </button>
                </div>
              </div>
              
              <div className="reviewsList adminList">
                {reviews.map((review) => (
                  <div key={review._id} className="detailCard adminCard reviewCard">
                    <div className="cardHeader">
                      <div className="reviewDish">
                        <img src={review.dish?.image || "/default-dish.png"} alt={review.dish?.name} />
                        <div>
                          <h4>{review.dish?.name}</h4>
                          <div className="stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                          <p className="customerInfo">
                            By: <strong>{review.user?.firstName} {review.user?.lastName}</strong> • {review.user?.email}
                          </p>
                        </div>
                      </div>
                      <span className={`statusBadge ${review.isApproved ? "approved" : "pending"}`}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <div className="cardBody">
                      <p className="reviewText">"{review.comment}"</p>
                    </div>
                    <div className="cardFooter adminFooter">
                      <span className="timestamp">Posted on {formatDate(review.createdAt)}</span>
                      <div className="adminActions">
                        {!review.isApproved ? (
                          <button className="approveBtn" onClick={() => updateReviewStatus(review._id, true)}>
                            Approve
                          </button>
                        ) : (
                          <button className="actionBtn" onClick={() => updateReviewStatus(review._id, false)}>
                            Unapprove
                          </button>
                        )}
                        <button className="rejectBtn" onClick={() => deleteReview(review._id)}>
                          <HiOutlineTrash /> Delete
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
                <button className="actionBtn" onClick={() => toast.info("Add menu item - implement modal or navigate to form")}>
                  <HiOutlinePlus /> Add Item
                </button>
              </div>
              
              <div className="menuList adminList">
                {menuItems.map((item) => (
                  <div key={item._id} className="detailCard adminCard menuCard">
                    <div className="cardHeader">
                      <div className="menuItemInfo">
                        <img src={item.image} alt={item.name} />
                        <div>
                          <h4>{item.name}</h4>
                          <p className="category">{item.category} {item.isSpecial && "• Special"}</p>
                          <p className="price">${item.price}</p>
                        </div>
                      </div>
                      <span className={`statusBadge ${item.isAvailable ? "approved" : "pending"}`}>
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="cardBody">
                      <p className="description">{item.description}</p>
                      <p className="ingredients"><strong>Ingredients:</strong> {item.ingredients?.join(", ")}</p>
                      {item.dietaryTags?.length > 0 && (
                        <p className="tags"><strong>Tags:</strong> {item.dietaryTags.join(", ")}</p>
                      )}
                      <p className="rating">★ {item.averageRating || 0} ({item.reviewCount || 0} reviews)</p>
                    </div>
                    <div className="cardFooter adminFooter">
                      <button 
                        className="actionBtn" 
                        onClick={() => toggleMenuAvailability(item._id, item.isAvailable)}
                      >
                        {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                      </button>
                      <button className="editBtn">
                        <HiOutlinePencil /> Edit
                      </button>
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
                <p>Total registered customers: {users.length}</p>
              </div>
              
              <div className="usersList adminList">
                {users.map((userItem) => (
                  <div key={userItem._id} className="detailCard adminCard userCard">
                    <div className="cardHeader">
                      <div className="userInfoDisplay">
                        <div className="userAvatarSmall">
                          {userItem.firstName[0]}{userItem.lastName[0]}
                        </div>
                        <div>
                          <h4>{userItem.firstName} {userItem.lastName}</h4>
                          <p>{userItem.email}</p>
                          <p>{userItem.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="cardFooter">
                      <span className="timestamp">Joined {formatDate(userItem.createdAt)}</span>
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