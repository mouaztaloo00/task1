import Navbar from './Components/Navbar'
import Home from './Pages/Home'
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
      <Route path='/update' element={<Update/>}/>
      <Route path='/delete' element={<Delete/>}/>
    </Routes>
   </div>
   </>
  );
}

export default App;
