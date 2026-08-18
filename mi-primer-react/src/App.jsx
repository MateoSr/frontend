import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import Home from './pages/Home/home'
import Faq from './pages/Faq/faq'
import NotFound from './pages/NotFound/notfound'
import Login from './pages/Login/login'
import Register from './pages/Register/register'
import Software from './pages/Software/software'
import Profile from './pages/profile/profile'
import Aboutus from './pages/AboutUs/aboutUs'
import OlvideContra from './pages/olvidePassword/olvideContra'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/faq" element={<Faq />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/software" element={<Software/>}/>
        <Route path="/sobre-nosotros" element={<Aboutus />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/forgot" element={<OlvideContra />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer></Footer>
    </>
  )
}

export default App
