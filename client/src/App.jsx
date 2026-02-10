import './App.css'
import { useState } from 'react'
import { BrowserRouter,Routes, Route ,Navigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'

function App() {
const [isAuthenticated,setIsAuthenticated] = useState(false)
  return (
    <BrowserRouter>
    <Navbar
    isAuthenticated={isAuthenticated}
    onLogout={()=>{
      localStorage.removeItem("token")
      setIsAuthenticated(false)
    
    }}
    />
    <Routes>
      <Route 
      path='/login'
      element={<Login onSuccess={()=>setIsAuthenticated(true)}/>}
      />
      <Route
      path='/register'
      element={<Register onSuccess={()=>setIsAuthenticated(true)}/>}/>
  
      <Route
      path='/dashboard'
      element={isAuthenticated ? <Dashboard /> : <Navigate to="/login"/>}
      />
    </Routes>
    </BrowserRouter>
  )
}

export default App
