import React from 'react';
import './styles/globals.css';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Farm Marketplace</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Farm Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;