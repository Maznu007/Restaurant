import React from "react";
import { HiOutlineArrowRight } from "react-icons/hi";

const About = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="about" id="about">
        <div className="container">
          <div className="banner">
            <div className="heading">
              OUR <span>STORY</span>
            </div>
            <p className="mid">
              Started with a wood-fired oven and a list of farmers we trusted. 
              No investors, no shortcuts — just a commitment to ingredients that 
              actually taste like something. We built this place because we 
              couldn't find food that respected the produce enough to get out 
              of its way.
            </p>
            <div className="aboutCta" onClick={scrollToMenu}>
              See What We're Cooking <HiOutlineArrowRight />
            </div>
          </div>
          <div className="banner">
            <div className="imageWrapper">
              <img src="about.png" alt="Kitchen scene" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;