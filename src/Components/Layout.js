// src/Components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ allProducts, setAllProducts, filteredProducts, setFilteredProducts }) => {
  return (
    <>
      {/* Pass product state to Header (for search) */}
      <Header
        allProducts={allProducts}
        setFilteredProducts={setFilteredProducts}
      />

      {/* Pass state to child routes */}
      <Outlet
        context={{
          allProducts,
          setAllProducts,
          filteredProducts,
          setFilteredProducts,
        }}
      />

      <Footer />
    </>
  );
};

export default Layout;
