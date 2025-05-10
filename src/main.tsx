import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './index.css'


import Login from './Pages/Login'
import Personal from './Pages/personal'
import Employees from './Pages/employees'
import Clients from './Pages/clients'
import Attendance from './Pages/attendance'
import Monthly from './Pages/monthly'


function ProtectedRoute() {
  const token = localStorage.getItem('accessToken')
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Personal />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/montly" element={<Monthly />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
