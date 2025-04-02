import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../Components/Navbar'

export const RootLayout = () => {
  return (
    <div className='home-layout'>
        <Navbar />
        <Outlet />
    </div >
  )
}
