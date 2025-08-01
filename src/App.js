import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* User Layout + Protected Pages */}
        <Route path="/" element={<Layout />}>
          <Route
            index
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
                <Products />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
