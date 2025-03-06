import React from 'react'
import Hero from '../components/landing/Hero'
import About from '../components/landing/About'
import Features from '../components/landing/Features'
import Story from '../components/landing/Story'
import Contact from '../components/landing/Contact'
import Footer from '../components/landing/Footer'

const Landing = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
    <Hero />
    <About/>
    <Features />
    <Story />
    <Contact />
    <Footer />
  </main>
  )
}

export default Landing