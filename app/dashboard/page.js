"use client";

import Layout from "../components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import PrivateRoute from "@/components/PrivateRoute";
import { useMediaQuery } from "react-responsive";
import { Calendar, TrendingUp, Users, Bell } from "lucide-react";
import InnerPageFooter from "../components/InnerPagefooter";

function ActivityCard({ icon: Icon, title, description, time }) {
  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-2 bg-indigo-100 rounded-lg">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <span className="text-gray-400 text-xs">{time}</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm w-full">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
    return <div className="p-8">Loading...</div>;
  }

  return (
    <PrivateRoute>
      <Layout>
        <div className="px-4 sm:px-8 py-6 space-y-8">
          {/* Welcome Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.displayName || "Neighbor"}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening in your community today.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} value="156" label="Active Neighbors" />
            <StatCard icon={Calendar} value="12" label="Upcoming Events" />
            <StatCard icon={TrendingUp} value="89%" label="Engagement" />
            <StatCard icon={Bell} value="24" label="New Updates" />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              <ActivityCard
                icon={Users}
                title="New Member"
                description="John Smith joined your neighborhood"
                time="2 hours ago"
              />
              <ActivityCard
                icon={Calendar}
                title="Upcoming Event"
                description="Community Garden Workshop this Saturday"
                time="3 hours ago"
              />
              <ActivityCard
                icon={Bell}
                title="Community Alert"
                description="Road maintenance scheduled for next week"
                time="5 hours ago"
              />
            </div>
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  );
}

export default Dashboard;
