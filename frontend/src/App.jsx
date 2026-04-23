import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  const { accessToken } = useAuth()

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={accessToken ? "/dashboard": "/login"} />} />
        <Route path='/login' element={<Login /> } />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/*' element = {<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
