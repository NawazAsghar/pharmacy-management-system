import React from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

// This is our warrper or template fro all the pages 
export default function MainLayout() {
  return (
    <>
        {/* show nav compponent at the top of every page  */}
        <Nav /> 
        <section>
          {/* 
          outlet = 'placeholder' where child pages will appear. its like an empty frame.
          React Router will put the current page here
          ie: if the user goes to '/home' the <Home> page loads here. if '/about' then the about page laods here.
          */}
            <Outlet />
        </section>
        <Footer />
    </>
  )
}
