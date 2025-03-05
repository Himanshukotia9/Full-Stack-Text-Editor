import React from 'react'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <AuthProvider>
        <Navbar/>
          <main className='min-h-screen max-w-screen-2xl mx-auto px-8 md:px-20 py-6'>
              <Outlet />
          </main>
        <Footer/>
      </AuthProvider>
    </>
  )
}
