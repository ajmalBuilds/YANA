"use client";
import React, { useEffect, useRef } from 'react';
import { Layout, MessageSquare, ShoppingBag, Users } from 'lucide-react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const features = [
  {
    icon: <Layout className="w-6 h-6 text-violet-600" />,
    title: "Yana Dashboard",
    description: "A central hub showing personalized activity, announcements, and community stats all in one place.",
    color: "bg-violet-100",
    delay: 0
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-teal-600" />,
    title: "Yana Bulletin",
    description: "Share events, important updates, and emergency alerts relevant to your local community.",
    color: "bg-teal-100",
    delay: 100
  },
  {
    icon: <ShoppingBag className="w-6 h-6 text-orange-600" />,
    title: "Yana Shelf",
    description: "An internal marketplace to buy and sell used products, similar to OLX, but only among trusted locals.",
    color: "bg-orange-100",
    delay: 200
  },
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: "Yana Circles",
    description: "Group spaces for clubs, interest groups, or local communities with built-in chat functionality.",
    color: "bg-blue-100",
    delay: 300
  }
];

function FeatureCard({ icon, title, description, color, delay }) {
  const ref = useRef(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <div 
      ref={ref}
      className={`border border-gray-100 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 
                 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        transitionProperty: 'opacity, transform'
      }}
    >
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Features() {
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const isHeadingVisible = useIntersectionObserver(headingRef, { threshold: 0.1 });
  const isTextVisible = useIntersectionObserver(textRef, { threshold: 0.1 });

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            ref={headingRef}
            className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 
                      ${isHeadingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            Everything You Need, In One Place
          </h2>
          <p 
            ref={textRef}
            className={`text-lg text-gray-600 transition-all duration-700 delay-100 
                      ${isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            YANA brings together essential social, marketplace, and communication tools, 
            eliminating the need for multiple apps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
