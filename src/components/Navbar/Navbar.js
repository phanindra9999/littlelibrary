import React from "react";
import "../Navbar/Navbar.css";
import { Link } from "react-router-dom";
import logoImage from "../../assets/lllogo.jpeg"

const Navbar = () => {
  return (
    <nav className="navbar">

      <div className="logo-container">
        <img src={logoImage} alt="Little Library Logo" className="logo" />
      </div>

      <div className="nav-links">
        <Link to="/Home">Home</Link>
        <Link to="/Browse">Browse</Link>
        <Link to="/Account">Account</Link>
      </div>

      <div className="login">
      <Link to="/">Login</Link>
      </div>
      
    </nav>
  );
};

export default Navbar;
