import React, { useState, useEffect } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Reservation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleReservation = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        date,
        time,
        partySize,
        notes
      };

      // Add user ID if logged in
      if (user) {
        payload.userId = user.id;
      }

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/reservation/send",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(data.message);

      // Reset form
      if (!user) {
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
      }
      setTime("");
      setDate("");
      setPartySize(2);
      setNotes("");

      // Redirect to dashboard if logged in, otherwise success page
      if (user) {
        navigate("/dashboard", { state: { activeTab: "reservations" } });
      } else {
        navigate("/success");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="reservation" id="reservation">
      <div className="container">
        <div className="banner">
          <div className="imageWrapper">
            <img src="/reservation.png" alt="Dining table" />
          </div>
        </div>

        <div className="banner">
          <div className="reservation_form_box">
            <h1>RESERVE <span>A TABLE</span></h1>
            <p>{user ? `Welcome back, ${user.firstName}` : "We hold tables for 15 minutes. Please call if you're running late."}</p>

            <form onSubmit={handleReservation}>
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  readOnly={!!user}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  readOnly={!!user}
                />
              </div>

              <div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  readOnly={!!user}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  readOnly={!!user}
                />
              </div>

              <div>
                <select 
                  value={partySize} 
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="partySizeSelect"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>

              <div>
                <textarea
                  placeholder="Special requests or notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="2"
                />
              </div>

              <button type="submit">
                CONFIRM RESERVATION
                <span>
                  <HiOutlineArrowNarrowRight />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;