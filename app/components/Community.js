"use client";
import React, { useRef } from 'react';
import { Heart, Share2, UserPlus, Shield } from 'lucide-react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const communityBenefits = [
  {
    icon: <Heart className="w-5 h-5 text-red-500" />,
    title: "Support Each Other",
    description: "Get help and offer assistance to those in your community when they need it most."
  },
  {
    icon: <Share2 className="w-5 h-5 text-teal-500" />,
    title: "Share Resources",
    description: "Exchange goods, services, and knowledge to maximize community resources."
  },
  {
    icon: <UserPlus className="w-5 h-5 text-blue-500" />,
    title: "Stay Connected",
    description: "Keep up with important events and updates relevant to your local area."
  },
  {
    icon: <Shield className="w-5 h-5 text-violet-500" />,
    title: "Build Trust",
    description: "Create a network of trusted neighbors and friends within your locality."
  }
];

const StatsItem = ({ value, label, delay }) => {
  const ref = useRef(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 transform 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-3xl md:text-4xl font-bold text-violet-700 mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

const BenefitItem = ({ icon, title, description, index }) => {
  const ref = useRef(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`flex items-start transition-all duration-700 transform 
        ${isVisible ? 'opacity-100 translate-x-0' : (index % 2 === 0 ? 'opacity-0 -translate-x-10' : 'opacity-0 translate-x-10')}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="mt-1 mr-4 p-2 rounded-lg bg-gray-100">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const Community = () => {
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  const isHeadingVisible = useIntersectionObserver(headingRef, { threshold: 0.1 });
  const isTextVisible = useIntersectionObserver(textRef, { threshold: 0.1 });
  const isImageVisible = useIntersectionObserver(imageRef, { threshold: 0.1 });

  return (
    <section id="community" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              ref={headingRef}
              className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 
                ${isHeadingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              Bringing Communities Together
            </h2>
            <p
              ref={textRef}
              className={`text-lg text-gray-600 mb-8 transition-all duration-700 delay-100 
                ${isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              In an age of disconnected digital spaces, YANA brings local communities online,
              making it easy for people to build meaningful connections.
            </p>

            <div className="space-y-6 mb-10">
              {communityBenefits.map((benefit, index) => (
                <BenefitItem
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div
            ref={imageRef}
            className={`relative transition-all duration-1000 
              ${isImageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
          >
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

              <img
                src="https://images.pexels.com/photos/7709213/pexels-photo-7709213.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Community gathering"
                className="relative z-10 rounded-lg shadow-lg object-cover h-96 w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <StatsItem value="50+" label="Communities" delay={100} />
              <StatsItem value="12k+" label="Users" delay={200} />
              <StatsItem value="94%" label="Satisfaction" delay={300} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
