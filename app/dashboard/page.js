import Layout from '../components/layout';
import React from 'react';
import { Calendar, TrendingUp, Users, Bell } from 'lucide-react';

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
    <div className="bg-white p-6 rounded-xl shadow-sm">
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
  return (
    <Layout>
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, Sarah!</h1>
        <p className="text-gray-600">Here's what's happening in your community today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} value="156" label="Active Neighbors" />
        <StatCard icon={Calendar} value="12" label="Upcoming Events" />
        <StatCard icon={TrendingUp} value="89%" label="Community Engagement" />
        <StatCard icon={Bell} value="24" label="New Updates" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <ActivityCard
            icon={Users}
            title="New Community Member"
            description="John Smith joined your neighborhood community"
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
  );
}

export default Dashboard;
