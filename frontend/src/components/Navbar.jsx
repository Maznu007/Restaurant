import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
    setShow(false);
  };

  const handleDashboard = () => {
    if (isAdmin()) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
    setShow(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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
          
          <div className="navActions">
            <button className="menuBtn" onClick={scrollToMenu}>
              View Menu
            </button>
            
            {user ? (
              <div className="userMenu">
                <button className="userBtn" onClick={handleDashboard}>
                  {user.firstName}
                </button>
                <button className="logoutBtn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <RouterLink to="/login" className="loginBtn" onClick={() => setShow(false)}>
                Login
              </RouterLink>
            )}
          </div>
        </div>
        
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;