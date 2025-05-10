"use client";

import Layout from "../components/layout";
import React, { useEffect, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { Mail, Phone, MapPin, Calendar, Camera } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import InnerPageFooter from "../components/InnerPagefooter";

function ProfileSection({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Profile() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
      } else {
        setCurrentUser(null);
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PrivateRoute>
      <Layout>
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full text-white hover:bg-indigo-700">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentUser.displayName}
                </h1>
                <p className="text-gray-600">
                  Community Member since March 2024
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <ProfileSection title="Contact Information">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>sarah.anderson@example.com</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>123 Community St, Neighborhood</span>
                </div>
              </div>
            </ProfileSection>

            {/* Community Stats */}
            <ProfileSection title="Community Engagement">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Events Attended</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items Listed</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Connections</span>
                  <span className="font-semibold">45</span>
                </div>
              </div>
            </ProfileSection>
          </div>

          {/* Recent Activity */}
          <ProfileSection title="Recent Activity">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-gray-900">
                    Joined Community Garden Workshop
                  </p>
                  <p className="text-sm text-gray-500">March 10, 2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-gray-900">Listed Garden Tools Set</p>
                  <p className="text-sm text-gray-500">March 8, 2024</p>
                </div>
              </div>
            </div>
          </ProfileSection>
        </div>
      </Layout>
    </PrivateRoute>
  );
}

export default Profile;
