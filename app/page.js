import React from "react";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Community from './components/Community';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Community />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
