import React from 'react';

import './Layout.css';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-main">
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
