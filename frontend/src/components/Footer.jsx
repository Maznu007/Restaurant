import React, { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <footer>
      <div className="container">
        <div className="footer_grid">
          <div className="footer_brand">
            <h3>SAVOUR<span>&</span>STONE</h3>
            <p>
              Farm-sourced ingredients. Wood-fired cooking. 
              No freezers, no shortcuts, no compromises.
            </p>
            <p style={{ color: '#ff3b30', fontStyle: 'italic' }}>
              "Technique gets you to good. Patience gets you to great."
            </p>
          </div>
          
          <div className="footer_hours">
            <h4>Hours</h4>
            <p>Tue — Thu: 5pm – 10pm</p>
            <p>Fri — Sat: 5pm – 11pm</p>
            <p>Sun: 11am – 3pm, 5pm – 9pm</p>
            <p>Mon: Closed</p>
          </div>
          
          <div className="footer_contact">
            <h4>Contact</h4>
            <p>42 Harvest Lane</p>
            <p>Yorkshire YO1 8BB</p>
            <p style={{ marginTop: '15px' }}>
              <a href="tel:+441234567890">+44 1234 567890</a>
            </p>
            <p>
              <a href="mailto:hello@savourandstone.co.uk">
                hello@savourandstone.co.uk
              </a>
            </p>
          </div>
          
          <div className="footer_newsletter">
            <h4>Stay Updated</h4>
            <p>One email weekly — what's fresh and what's leaving.</p>
            <form onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        
        <div className="footer_bottom">
          <p>&copy; 2024 Savour & Stone. All rights reserved.</p>
          <div className="footer_social">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Reservations</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;