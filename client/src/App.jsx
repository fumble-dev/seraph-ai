import React, { useState } from 'react'
import { Route, Routes, useLocation, } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Chatbox from './components/Chatbox'
import Credits from './pages/Credits'
import Login from './pages/Login'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'

const App = () => {

  const [iseMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading') return <Loading />
  
  return (
    <>
      {!iseMenuOpen && <img className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden' onClick={() => setIsMenuOpen(true)} src={assets.menu_icon} />}
      <div className='bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className='flex h-screen w-screen'>
          <Sidebar iseMenuOpen={iseMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path='/' element={<Chatbox />} />
            <Route path='/credits' element={<Credits />} />
            <Route path='/community' element={<Community />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
