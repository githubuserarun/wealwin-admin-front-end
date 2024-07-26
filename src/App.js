import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLoginPage from './Components/AdminLoginPage'
import AdminHandleuserPage from './Components/AdminHandleuserPage';
import AdminDash from './Components/AdminDash';
import AdminAddProducts from './Components/AdminAddProducts'
import AdminViewProducts from './Components/AdminViewProducts';
import AdminCatogory from './Components/AdminCatogory'
import AdminSubCategories from './Components/AdminSubCategory';
import ProtectedRoute from './Components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div >
      <Router>
        <Routes>
          <Route exact path="/" element={ <ProtectedRoute element={<AdminDash />} /> } />
          <Route exact path="/admin-login" element={<AdminLoginPage />} />
          <Route exact path="/admin-handle-users" element={ <ProtectedRoute element={<AdminHandleuserPage />} /> } />
          <Route exact path="/admin-add-products" element={ <ProtectedRoute element={<AdminAddProducts/>} /> } />
          <Route exact path="/admin-products" element={ <ProtectedRoute element={<AdminViewProducts />} /> } />
          <Route exact path="/admin-catogory" element={ <ProtectedRoute element={<AdminCatogory />} /> } />
          <Route exact path="/admin-subCatogory" element={ <ProtectedRoute element={<AdminSubCategories />} /> } />
        </Routes>
      </Router>
      <ToastContainer />
    </div>

  );
}

export default App;
