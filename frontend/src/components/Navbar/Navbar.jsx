import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("menu");
  const [menuOpen, setMenuOpen] = useState(false);

  const { getTotalCartAmount, token, logout } = useContext(StoreContext); // FIXED: Use logout from context

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Use context logout
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.sk_logo} alt="" className='logo' /></Link>

      {/* Collapsible Menu */}
      <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
        <Link to='/' onClick={() => { setMenu("home"); setMenuOpen(false); }} className={menu === "home" ? "active" : ""}>Home</Link>
        <Link to='/#explore-menu' onClick={() => { setMenu("menu"); setMenuOpen(false); }} className={menu === "menu" ? "active" : ""}>Menu</Link>
        <a href='#contact' onClick={() => { setMenu("contact"); setMenuOpen(false); }} className={menu === "contact" ? "active" : ""}>Contact</a>
        <a href='#contact' onClick={() => { setMenu("about"); setMenuOpen(false); }} className={menu === "about" ? "active" : ""}>About Us</a>

        {/* Cart inside hamburger */}
        <div className="navbar-search-icon mobile-only">
          <Link to='/cart' onClick={() => setMenuOpen(false)}>
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {/* Profile inside hamburger */}
        {!token ? (
          <button className="mobile-only" onClick={() => { setShowLogin(true); setMenuOpen(false); }}>Sign In</button>
        ) : (
          <div className='navbar-profile mobile-only'>
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => { navigate('/profile'); setMenuOpen(false); }}>
                <img src={assets.profile_icon} alt="" /><p>Profile</p>
              </li>
              <hr />
              <li onClick={() => { navigate('/myorders'); setMenuOpen(false); }}>
                <img src={assets.bag} alt="" /><p>Orders</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="" /><p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className='navbar-right'>
        <img src={assets.search_icon} alt="" />

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Cart (desktop only) */}
        <div className="navbar-search-icon desktop-only">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {/* Profile (desktop only) */}
        {!token ? (
          <button className="desktop-only" onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className='navbar-profile desktop-only'>
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/profile')}>
                <img src={assets.profile_icon} alt="" /><p>Profile</p>
              </li>
              <hr />
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag} alt="" /><p>Orders</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="" /><p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar;