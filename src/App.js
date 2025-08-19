import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Components/Layout';
import AdminLayout from './Components/AdminLayout';
import Home from './Pages/Home';
import Login from './Pages/LogIn';
import SignUp from './Pages/SignUp';
import Products from './Pages/Products';
import AddProduct from './Pages/Addproduct';
import ProductList from './Pages/ProductList';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Orders from './Pages/Orders';
import OrderHistory from './Pages/orderHistory';
import ProductDetails from './Pages/ProductDetails';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  // 🔹 Top-level product state for search
  const [allProducts, setAllProducts] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState([]);

  // 🔹 Check if user is logged in
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root ("/") to login if no token, otherwise go to dashboard */}
        <Route
          path="/"
          element={
            token ? (
              role === 'admin' ? (
                <Navigate to="/admin/products" replace />
              ) : (
                <Navigate to="/home" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* User Layout + Protected Pages */}
        <Route
          path="/"
          element={
            <Layout
              allProducts={allProducts}
              setFilteredProducts={setFilteredProducts}
            />
          }
        >
          <Route
            path="home"
            element={
              <PrivateRoute role="user">
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="product/:id" element={<ProductDetails />} />

          <Route
            path="products"
            element={
              <PrivateRoute role="user">
                <Products
                  allProducts={allProducts}
                  setAllProducts={setAllProducts}
                  filteredProducts={filteredProducts}
                  setFilteredProducts={setFilteredProducts}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="cart"
            element={
              <PrivateRoute role="user">
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <PrivateRoute role="user">
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="my-orders"
            element={
              <PrivateRoute role="user">
                <OrderHistory />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Admin Layout + Protected Pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="add-product"
            element={
              <PrivateRoute role="admin">
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="edit-product/:id"
            element={
              <PrivateRoute role="admin">
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="products"
            element={
              <PrivateRoute role="admin">
                <ProductList />
              </PrivateRoute>
            }
          />
          <Route
            path="orders"
            element={
              <PrivateRoute role="admin">
                <Orders />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Fallback - if no route matches */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
