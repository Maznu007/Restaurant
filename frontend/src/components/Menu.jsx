import React, { useState, useEffect } from 'react';
import { data } from '../restApi.json';
import { HiOutlineArrowNarrowRight, HiX, HiOutlineShoppingCart, HiOutlineStar } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Menu = () => {
  const [selectedDish, setSelectedDish] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const { data: response } = await axios.get("http://localhost:4000/api/v1/menu/all");
      setMenuItems(response.menuItems || data[0].dishes);
    } catch (error) {
      setMenuItems(data[0].dishes);
    } finally {
      setLoading(false);
    }
  };

  const openRecipe = (dish) => {
    setSelectedDish(dish);
    document.body.style.overflow = 'hidden';
  };

  const closeRecipe = () => {
    setSelectedDish(null);
    setReviewModal(false);
    setOrderModal(false);
    setQuantity(1);
    setRating(5);
    setComment("");
    setSpecialInstructions("");
    document.body.style.overflow = 'unset';
  };

  const handleOrder = async () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/#menu" } } });
      return;
    }

    if (!pickupTime) {
      toast.error("Please select a pickup time");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/v1/orders/create", {
        items: [{
          dishId: selectedDish._id || selectedDish.id,
          name: selectedDish.name || selectedDish.title,
          price: selectedDish.price || 25,
          quantity: quantity
        }],
        totalAmount: (selectedDish.price || 25) * quantity,
        orderType: "pickup",
        pickupTime: new Date(pickupTime),
        specialInstructions
      });

      toast.success("Order placed successfully!");
      closeRecipe();
      navigate("/dashboard", { state: { activeTab: "orders" } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  const handleReview = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (comment.length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/v1/reviews/create", {
        dishId: selectedDish._id || selectedDish.id,
        rating,
        comment
      });

      toast.success("Review submitted for approval!");
      closeRecipe();
      navigate("/dashboard", { state: { activeTab: "reviews" } });
    } catch (error) {
      if (error.response?.data?.message?.includes("already reviewed")) {
        toast.error("You have already reviewed this dish");
      } else {
        toast.error(error.response?.data?.message || "Failed to submit review");
      }
    }
  };

  const getDishPrice = (dish) => dish.price || 25;

  return (
    <>
      <section className='menu' id='menu'>
        <div className="container">
          <div className="heading_section">
            <div>
              <h1 className="heading">SEASONAL <span>OFFERINGS</span></h1>
              <p>Our menu changes with what's growing. These dishes represent what our farmers brought us this week.</p>
            </div>
          </div>
          
          <div className="dishes_container">
            {menuItems.map(element => (
              <div 
                className="card" 
                key={element._id || element.id}
                onClick={() => openRecipe(element)}
              >
                <div className="cardImage">
                  <img src={element.image} alt={element.name || element.title} />
                  {element.isSpecial && <span className="specialTag">Chef's Special</span>}
                </div>
                
                <div className="cardInfo">
                  <div className="cardCategory">{element.category}</div>
                  <div className="cardTitle">{element.name || element.title}</div>
                  <div className="cardPrice">${getDishPrice(element)}</div>
                </div>
                
                <div className="cardHover">
                  <p className="cardDescription">{element.description}</p>
                  <div className="cardActions">
                    <span className="view_recipe">
                      View Details <HiOutlineArrowNarrowRight />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe/Order/Review Modal */}
      <div className={`recipe_modal ${selectedDish ? 'active' : ''}`} onClick={closeRecipe}>
        {selectedDish && (
          <div className="recipe_modal_content" onClick={(e) => e.stopPropagation()}>
            <button className="recipe_modal_close" onClick={closeRecipe}>
              <HiX />
            </button>
            
            <img 
              src={selectedDish.image} 
              alt={selectedDish.name || selectedDish.title} 
              className="recipe_modal_image" 
            />
            
            <div className="recipe_modal_body">
              {!reviewModal && !orderModal ? (
                <>
                  <div className="recipe_modal_header">
                    <h2>{selectedDish.name || selectedDish.title}</h2>
                    <div className="recipe_modal_meta">
                      <span>{selectedDish.category}</span>
                      <span>•</span>
                      <span>${getDishPrice(selectedDish)}</span>
                      {selectedDish.averageRating > 0 && (
                        <>
                          <span>•</span>
                          <span>★ {selectedDish.averageRating}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <p className="recipe_modal_description">{selectedDish.description}</p>
                  
                  <div className="recipe_modal_grid">
                    <div className="recipe_modal_section">
                      <h4>Ingredients</h4>
                      <ul className="recipe_ingredients">
                        {(selectedDish.ingredients || ["Fresh local ingredients"]).map((ing, idx) => (
                          <li key={idx}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {selectedDish.chefNote && (
                      <div className="recipe_modal_section">
                        <h4>Chef's Note</h4>
                        <p className="recipe_note">"{selectedDish.chefNote}"</p>
                      </div>
                    )}
                  </div>

                  {user && (
                    <div className="modalActions">
                      <button className="actionBtn primary" onClick={() => setOrderModal(true)}>
                        <HiOutlineShoppingCart /> Order Now
                      </button>
                      <button className="actionBtn secondary" onClick={() => setReviewModal(true)}>
                        <HiOutlineStar /> Write Review
                      </button>
                    </div>
                  )}
                  
                  {!user && (
                    <div className="modalActions">
                      <p className="loginPrompt">
                        <button onClick={() => navigate("/login")}>Login</button> to order or review
                      </p>
                    </div>
                  )}
                </>
              ) : orderModal ? (
                <>
                  <div className="recipe_modal_header">
                    <h2>Order {selectedDish.name || selectedDish.title}</h2>
                  </div>
                  
                  <div className="orderForm">
                    <div className="formGroup">
                      <label>Quantity</label>
                      <div className="quantitySelector">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                      </div>
                    </div>
                    
                    <div className="formGroup">
                      <label>Pickup Time</label>
                      <input 
                        type="datetime-local" 
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                    
                    <div className="formGroup">
                      <label>Special Instructions (Optional)</label>
                      <textarea 
                        value={specialInstructions}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Any allergies or special requests..."
                        rows="3"
                      />
                    </div>
                    
                    <div className="orderTotal">
                      <span>Total:</span>
                      <strong>${(getDishPrice(selectedDish) * quantity).toFixed(2)}</strong>
                    </div>
                    
                    <div className="modalActions">
                      <button className="actionBtn primary" onClick={handleOrder}>
                        Place Order
                      </button>
                      <button className="actionBtn text" onClick={() => setOrderModal(false)}>
                        Back to Details
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="recipe_modal_header">
                    <h2>Review {selectedDish.name || selectedDish.title}</h2>
                  </div>
                  
                  <div className="reviewForm">
                    <div className="formGroup">
                      <label>Rating</label>
                      <div className="starSelector">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className={star <= rating ? "active" : ""}
                            onClick={() => setRating(star)}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="formGroup">
                      <label>Your Review</label>
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this dish..."
                        rows="4"
                        minLength="10"
                      />
                    </div>
                    
                    <div className="modalActions">
                      <button className="actionBtn primary" onClick={handleReview}>
                        Submit Review
                      </button>
                      <button className="actionBtn text" onClick={() => setReviewModal(false)}>
                        Back to Details
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Menu;