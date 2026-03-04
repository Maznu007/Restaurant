import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
    setShow(false);
  };

  return (
    <>
      <nav>
        <div className="logo">SAVOUR<span>&</span>STONE</div>
        
        <div className={show ? "navRight showmenu" : "navRight"}>
          <div className="navLinks">
            <div className="links">
              {data[0].navbarLinks.map((element) => (
                <Link
                  to={element.link}
                  spy={true}
                  smooth={true}
                  duration={500}
                  key={element.id}
                  onClick={() => setShow(false)}
                >
                  {element.title}
                </Link>
              ))}
            </div>
          </div>
          <button className="menuBtn" onClick={scrollToMenu}>
            View Menu
          </button>
        </div>
        
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;