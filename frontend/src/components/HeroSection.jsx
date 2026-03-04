import React from "react";
import Navbar from "./Navbar";

const HeroSection = () => {
  const scrollToReservation = () => {
    const resSection = document.getElementById('reservation');
    if (resSection) {
      resSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="heroSection" id="heroSection">
      <Navbar />
      <div className="container">
        <div className="banner">
          <h1 className="title">
            Food with <span>roots.</span>
          </h1>
          <p className="subtitle">
            Farm-sourced ingredients. Wood-fired cooking. 
            No freezers, no compromises.
          </p>
          <button className="heroCta" onClick={scrollToReservation}>
            Book a Table →
          </button>
        </div>
        <div className="banner">
          <div className="imageBox">
            <img src="./hero1.png" alt="Signature dish" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;