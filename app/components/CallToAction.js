"use client";
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const CallToAction = () => {
  const router = useRouter();
  const sectionRef = useRef(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  return (
    <section 
      ref={sectionRef}
      className={`py-20 transition-all duration-1000 overflow-hidden
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="container mx-auto px-4 md:px-6 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 rounded-l-full overflow-hidden"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to connect with your community?
              </h2>
              <p className="text-violet-100 text-lg mb-8">
                Join thousands of people who are already building stronger, more connected communities with YANA.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button  onClick={() => router.push("/signup")} className="bg-white text-violet-700 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-all duration-200 flex items-center justify-center">
                  Request a Demo
                </button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-4">
                Join your community in 3 simple steps:
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-violet-800 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Sign up with your email</h4>
                    <p className="text-violet-100">Create your account in less than a minute</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-violet-800 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Verify your locality</h4>
                    <p className="text-violet-100">Connect with your specific community</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-violet-800 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Start connecting</h4>
                    <p className="text-violet-100">Explore features and meet your community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
