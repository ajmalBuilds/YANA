"use client";
import React from "react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Users,
  MessageCircle,
  ShoppingBag,
  Layout,
} from "lucide-react";

const Hero = () => {
  const router = useRouter();
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const buttons = buttonsRef.current;
    const image = imageRef.current;

    if (title) title.classList.add("animate-fadeIn");
    if (subtitle) {
      setTimeout(() => {
        subtitle.classList.add("animate-fadeIn");
      }, 200);
    }
    if (buttons) {
      setTimeout(() => {
        buttons.classList.add("animate-fadeIn");
      }, 400);
    }
    if (image) {
      setTimeout(() => {
        image.classList.add("animate-slideInRight");
      }, 600);
    }
  }, []);

  return (
    <section className="pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 ">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-8 ">
          <div className="md:w-1/2 space-y-6 ">
            <h1
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight opacity-0 transition-opacity duration-700"
            >
              You Are <span className="text-violet-700">Not Alone</span> in Your
              Community
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl text-gray-600 opacity-0 transition-opacity duration-700 delay-200"
            >
              Connect, support, and empower each other within your local
              community. All the tools you need, in one place.
            </p>
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-4 pt-4 opacity-0 transition-opacity duration-700 delay-400"
            >
              <button  onClick={() => router.push("/dashboard")} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Join Your Community
              </button>
              <button className="border-2 border-violet-600 text-violet-700 hover:bg-violet-50 px-8 py-3 rounded-full font-medium transition-all duration-300">
                Learn More
              </button>
            </div>

            <div className="pt-8 flex items-center space-x-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundImage: `url(https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=800)`,
                      backgroundPosition: `${i * 25}% 50%`,
                      backgroundSize: "cover",
                    }}
                  />
                ))}
              </div>
              <p className="text-gray-600">
                <span className="font-bold text-violet-700">5,000+</span> people
                already joined
              </p>
            </div>
          </div>

          <div
            ref={imageRef}
            className="md:w-1/2 relative opacity-0 bg-teal-100 transform transition-all duration-1000 rounded-2xl delay-600 overflow-hidden"
          >
            <div className="relative animate-float">
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-violet-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-4 left-20 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

              <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Users className="text-violet-600 w-6 h-6 mr-2" />
                    <h3 className="font-bold text-lg">YANA Dashboard</h3>
                  </div>
                  <div className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                    Campus View
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <MessageCircle className="text-teal-500 w-5 h-5 mr-2" />
                      <h4 className="font-medium">New Messages</h4>
                    </div>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <ShoppingBag className="text-orange-500 w-5 h-5 mr-2" />
                      <h4 className="font-medium">Marketplace</h4>
                    </div>
                    <p className="text-2xl font-bold">8 New</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Upcoming Events</h4>
                    <span className="text-violet-600 text-sm">View All</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Campus Cleanup</p>
                        <p className="text-gray-500 text-sm">
                          Tomorrow, 10:00 AM
                        </p>
                      </div>
                      <div className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs">
                        RSVP
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Book Club Meeting</p>
                        <p className="text-gray-500 text-sm">May 15, 6:00 PM</p>
                      </div>
                      <div className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs">
                        RSVP
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <Layout className="text-violet-600 w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Active Circles</p>
                      <p className="text-gray-500 text-sm">4 new updates</p>
                    </div>
                  </div>
                  <div className="bg-violet-600 text-white p-2 rounded-full">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-16 text-center">
        <div className="animate-bounce inline-block">
          <ChevronDown size={24} className="text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
