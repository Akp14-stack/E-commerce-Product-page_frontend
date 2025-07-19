import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Components/Layout';
import Home from './Pages/Home';
import PrivateRoute from './Components/PrivateRoute';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PrivateRoute><Home /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
