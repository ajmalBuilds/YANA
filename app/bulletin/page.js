'use client';
import Layout from '../components/layout';
import React, { useState } from 'react';
import { Users, Calendar, MapPin, X } from 'lucide-react';

function EventCard({ title, date, location, attendees, onJoin }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{date}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span>{attendees} attending</span>
        </div>
      </div>
      <button
        onClick={onJoin}
        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Join Event
      </button>
    </div>
  );
}

function Bulletin() {
  const [events, setEvents] = useState([
    {
      title: 'Community Garden Workshop',
      date: 'March 15, 2024 • 10:00 AM',
      location: 'Central Park Garden',
      attendees: 24,
    },
    {
      title: 'Neighborhood Clean-up',
      date: 'March 18, 2024 • 9:00 AM',
      location: 'Main Street',
      attendees: 18,
    },
    {
      title: 'Local Art Exhibition',
      date: 'March 20, 2024 • 3:00 PM',
      location: 'Community Center',
      attendees: 45,
    },
  ]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '' });
  const [selectedCircle, setSelectedCircle] = useState('');
  const [circleDropdownOpen, setCircleDropdownOpen] = useState(false);

  const userCircles = ['Campus A', 'Photography Club', 'Hostel 3', 'RGUKT Basar'];

  const handleAddEvent = () => {
    if (!selectedCircle) return alert('Please select a circle!');
    setEvents([
      ...events,
      {
        ...newEvent,
        circle: selectedCircle,
        attendees: Math.floor(Math.random() * 20 + 5),
      },
    ]);
    setShowAddPopup(false);
    setNewEvent({ title: '', date: '', location: '' });
    setSelectedCircle('');
  };

  return (
    <Layout>
      <div className="space-y-8 relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">📣 Yana Bulletin</h1>
            <p className="text-gray-600">Discover and join events happening in your Circles.</p>
          </div>
          <button
            onClick={() => setShowAddPopup(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            + Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard
              key={index}
              {...event}
              onJoin={() => setShowConfirm(true)}
            />
          ))}
        </div>

        {/* Confirm Join Popup */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full relative animate-fadeIn">
              <button
                onClick={() => setShowConfirm(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-black"
              >
                <X />
              </button>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Join this Event?</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to join this event?
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('You have joined the event!');
                    setShowConfirm(false);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                >
                  Yes, Join
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Event Popup */}
        {showAddPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full relative animate-fadeIn">
              <button
                onClick={() => setShowAddPopup(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-black"
              >
                <X />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📌 Add New Event</h2>

              <input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event Title"
                className="w-full mb-3 px-4 py-2 border rounded-xl text-sm placeholder:text-gray-400"
              />
              <input
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                placeholder="Date & Time"
                className="w-full mb-3 px-4 py-2 border rounded-xl text-sm placeholder:text-gray-400"
              />
              <input
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Location"
                className="w-full mb-4 px-4 py-2 border rounded-xl text-sm placeholder:text-gray-400"
              />

              {/* Custom Dropdown */}
              <div className="relative mb-4">
                <button
                  onClick={() => setCircleDropdownOpen(!circleDropdownOpen)}
                  className="w-full px-4 py-2 border rounded-xl text-sm text-left bg-gray-50 hover:bg-gray-100"
                >
                  {selectedCircle || 'Select Circle'}
                </button>
                {circleDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-xl shadow-md max-h-40 overflow-y-auto">
                    {userCircles.map((circle, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedCircle(circle);
                          setCircleDropdownOpen(false);
                        }}
                        className="px-4 py-2 text-sm hover:bg-indigo-100 cursor-pointer"
                      >
                        {circle}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAddEvent}
                className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
              >
                ➕ Add Event
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Bulletin;
