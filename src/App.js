import React from 'react';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import Hometest from './Pages/Hometest';

function App() {
  return (
    <Router> 
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<SignUp />} />
          <Route path='/hometest' element={<Hometest/>} />

          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;