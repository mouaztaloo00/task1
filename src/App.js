import React from 'react';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Update from './Pages/Update';
import Delete from './Pages/Delete';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <Router> 
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<SignUp />} />
          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path='/update'
            element={
              <ProtectedRoute>
                <Update />
              </ProtectedRoute>
            }
          />
          <Route
            path='/delete'
            element={
              <ProtectedRoute>
                <Delete />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;