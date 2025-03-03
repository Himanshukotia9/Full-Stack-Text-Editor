import React from 'react'
import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <>
      <h1>Navbar</h1>
      <main className='min-h-screen max-w-screen-2xl mx-auto px-8 md:px-20 py-6'>
          <Outlet />
      </main>
      <h1>Footer</h1>
    </>
  )
}
