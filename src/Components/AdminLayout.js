// src/Components/Layout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  const [filteredProducts, setFilteredProducts] = useState([]);

  return (
    <>
      <Header setFilteredProducts={setFilteredProducts} />
      <Outlet context={{ filteredProducts, setFilteredProducts }} />
    </>
  );
}

export default Layout;
