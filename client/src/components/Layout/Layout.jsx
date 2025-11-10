import React from 'react';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2025 SkillSwap. All rights reserved.</p>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
