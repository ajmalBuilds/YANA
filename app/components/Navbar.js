"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Menu, X, Users } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-[100vw] z-50 transition-all duration-300 overflow-hidden ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center text-violet-700">
              <Users className="h-8 w-8 mr-2" />
              <span className="font-bold text-2xl">YANA</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-violet-700 transition-colors duration-200">Features</a>
            <a href="#community" className="text-gray-700 hover:text-violet-700 transition-colors duration-200">Community</a>
            <a href="#testimonials" className="text-gray-700 hover:text-violet-700 transition-colors duration-200">Testimonials</a>
            <button  onClick={() => router.push("/dashboard")} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105">
              Join Now
            </button>
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-violet-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg absolute top-full left-0 right-0 mx-4 transition-all duration-300 transform origin-top">
            <div className="flex flex-col space-y-4 px-4">
              <a 
                href="#features" 
                className="text-gray-700 hover:text-violet-700 py-2 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a 
                href="#community" 
                className="text-gray-700 hover:text-violet-700 py-2 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Community
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-700 hover:text-violet-700 py-2 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Testimonials
              </a>
              <button  onClick={() => router.push("/dashboard")} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 w-full">
                Join Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
