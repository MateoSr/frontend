import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import Home from './pages/home/home'
import Faq from './pages/faq/faq'
import NotFound from './pages/notFound/notfound'
import Login from './pages/login/login'
import Register from './pages/register/register'
import Software from './pages/software/software'
import Profile from './pages/profile/profile'
import Aboutus from './pages/aboutUs/aboutUs'
import OlvideContra from './pages/olvidePassword/olvideContra'
import ResetPassword from './pages/resetPassword/resetPassword'
import Complejos from './pages/complejos/complejos'
import ConfirmarReserva from './pages/confirmarReserva/confirmarReserva'
import DetalleComplejo from './pages/detalleComplejo/detalleComplejo'
import MenuAdmin from './pages/menuAdmin/menuAdmin'
import AdministrarComplejos from './pages/administrarComplejos/administrarComplejos'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/login" element={<Login endpoint="/api/login" redirectTo="/" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/software" element={<Software />} />
        <Route path="/sobre-nosotros" element={<Aboutus />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/forgot" element={<OlvideContra />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/complejos" element={<Complejos />} />
        <Route path="/confirmar-reserva" element={<ConfirmarReserva />} />
        <Route path="/detalle-complejo/:id" element={<DetalleComplejo />} />
        <Route path="/loginAdmin" element={<Login endpoint="/api/loginAdmin" redirectTo="/menuAdmin" />} />
        <Route path="/menuAdmin" element={<MenuAdmin />} />
        <Route path="/administrar-complejos" element={<AdministrarComplejos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer></Footer>
    </>
  )
}

export default App
