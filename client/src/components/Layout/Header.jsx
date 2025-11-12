import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          {/* <span className="logo-icon">🔄</span> */}
          <span className="logo-text">SkillSwap</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {/* Public Links */}
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>
            Home
          </Link>
          
          <Link to="/skills" className="nav-link" onClick={closeMobileMenu}>
            Browse Skills
          </Link>

          {/* Authenticated Links */}
          {isAuthenticated() && (
            <>
              <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
                Dashboard
              </Link>
              
              <Link to={`/profile/${user?.id}`} className="nav-link" onClick={closeMobileMenu}>
                My Profile
              </Link>

              <Link to="/manage-skills" className="nav-link" onClick={closeMobileMenu}>
                My Skills
              </Link>
            </>
          )}

          {/* Auth Buttons */}
          <div className="nav-auth">
            {isAuthenticated() ? (
              <div className="user-menu">
                {/* <span className="user-name">Hi, {user?.name?.split(' ')[0]}</span> */}
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMobileMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
