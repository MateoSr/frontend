import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import Home from './pages/Home/home'
import Faq from './pages/Faq/faq'
import NotFound from './pages/NotFound/notfound'
import Aboutus from './pages/AboutUs/aboutUs'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/faq" element={<Faq />} />
        <Route path="/sobre-nosotros" element={<Aboutus />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer></Footer>
    </>
  )
}

export default App
