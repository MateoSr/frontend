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
import CrearComplejo from './pages/crearComplejo/crearComplejo'
import MenuDueño from './pages/menuDueño/menuDueño'
import MenuEncargado from './pages/menuEncargado/menuEncargado'
import { RutaProtegida, BloqueoPorRol } from './components/rutaProtegida/rutaProtegida'
import AdministrarUsuarios from './pages/administrarUsuarios/administrarUsuarios'
import CrearUsuario from './pages/crearUsuario/crearUsuario'
import ComplejoDueño from './pages/complejoDueño/complejoDueño'


function App() {
  return (
    <>
      <Header></Header>
      <BloqueoPorRol>
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
        <Route path="/complejo/:id" element={<RutaProtegida rol="Dueño">
            <ComplejoDueño />
          </RutaProtegida>} />
        <Route path="/confirmar-reserva" element={<ConfirmarReserva />} />
        <Route path="/detalle-complejo/:id" element={<DetalleComplejo />} />
        <Route path="/loginAdmin" element={<Login endpoint="/api/loginAdmin" redirectTo="/menuAdmin" />} />
        <Route path="/menuAdmin" element={<RutaProtegida rol="Administrador">
            <MenuAdmin />
          </RutaProtegida>} />
        <Route path="/administrar-complejos" element={<RutaProtegida rol="Administrador">
            <AdministrarComplejos />
          </RutaProtegida>} />
        <Route path="/administrar-usuarios" element={<RutaProtegida rol="Administrador">
            <AdministrarUsuarios />
          </RutaProtegida>} />
        <Route path="/crear-complejo" element={<RutaProtegida rol="Administrador">
            <CrearComplejo />
          </RutaProtegida>} />
        <Route path="/menuDueño" element={
          <RutaProtegida rol="Dueño">
            <MenuDueño />
          </RutaProtegida>} />
        <Route path="/menuEncargado" element={
          <RutaProtegida rol="Encargado">
            <MenuEncargado />
          </RutaProtegida>
        } />
        <Route path="/crear-usuario" element={<RutaProtegida rol="Administrador">
            <CrearUsuario />
          </RutaProtegida>} />
        <Route path="*" element={<NotFound />} />
      </Routes >
      </BloqueoPorRol>
      <Footer></Footer>
    </>
  )
}

export default App
