<<<<<<< HEAD
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import Hometest from './Pages/Hometest'

import Update from './Pages/Update'
import Delete from './Pages/Delete'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import { Routes , Route } from 'react-router-dom'

function App() {
  return (
   <>
   <Navbar/>
   <div className='container'>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/Sign-Up' element={<SignUp/>}/> 
      <Route path='/Home' element={<Home/>}/>
      <Route path='/Hometest' element={<Hometest/>}/>

      <Route path='/update' element={<Update/>}/>
      <Route path='/delete' element={<Delete/>}/>
    </Routes>
   </div>
   </>
=======
import React from 'react';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
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
        </Routes>
      </div>
    </Router>
>>>>>>> 992d90bfd6f2f538920dd2cf08e7d4e3c7d7e97c
  );
}

export default App;