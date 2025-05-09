"use client";
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const testimonials = [
  {
    quote: "YANA has completely transformed how our campus community interacts. I've met incredible people and found resources I never knew existed.",
    author: "Sarah Johnson",
    role: "College Student",
    avatar: "https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    quote: "As a small business owner, the Yana Shelf marketplace has given me a direct channel to my local community. It's authentic and trustworthy.",
    author: "Michael Rodriguez",
    role: "Local Entrepreneur",
    avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    quote: "The Circles feature helped our neighborhood organize during a difficult time. We coordinated meal deliveries for elderly residents during the pandemic.",
    author: "Emma Williams",
    role: "Community Organizer",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className={`py-20 bg-gradient-to-b from-violet-50 to-white transition-all duration-1000 
                ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Are Saying</h2>
          <p className="text-lg text-gray-600">
            Hear from people who have transformed their communities with YANA.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <div className="absolute -top-6 -left-6">
              <div className="bg-violet-100 p-4 rounded-full">
                <Quote className="w-6 h-6 text-violet-600" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="mb-6 text-lg md:text-xl text-gray-700 italic">
                "{testimonials[currentIndex].quote}"
              </div>
              
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{testimonials[currentIndex].author}</h4>
                  <p className="text-gray-600">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-violet-600 w-8' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-8">
            <button 
              onClick={goToPrevious}
              className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-8">
            <button 
              onClick={goToNext}
              className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
