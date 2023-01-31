import './scss/app.scss'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
import FullPiza from './pages/FullPiza'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="cart" element={<Cart />}></Route>
        <Route path="pizza/:id" element={<FullPiza />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  )
}

export default App
