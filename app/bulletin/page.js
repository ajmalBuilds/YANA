'use client';
import Layout from '../components/layout';
import React, { useEffect, useState } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { createCircle, getAllCircles } from "@/lib/circles";
import { useRouter } from 'next/navigation';
// import { auth } from 'firebase/firestore';
import { Users, Calendar, MapPin, X, Trash2 } from 'lucide-react';
import axios from 'axios';
import { format } from "date-fns";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import { set } from 'mongoose';

function SkeltonCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-full animate-pulse">
      {/* Title and delete icon */}
      <div className="flex flex-row justify-between items-center mb-2">
        <div className="h-6 bg-gray-300 rounded w-2/3"></div>
        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
      </div>

      {/* Event Info */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>

      {/* Join button */}
      <div className="mt-4 h-10 bg-gray-300 rounded-lg w-full"></div>
    </div>

  )
};

function EventCard({ _id, title, timeOfEvent, venue, attendingMembers, onJoin, joining, showConfirmJoin, setShowConfirmJoin, onDelete, deleting, currentUser, ownerId , showConfirmDelete, setShowConfirmDelete, currentEventId, setCurrentEventId }) {

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-full">
        <div className={`${currentUser===ownerId ?  'flex flex-row justify-between items-center' : ''}  mb-2 `}>
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
          { currentUser===ownerId ? (<button
            onClick={() => {
              setShowConfirmDelete(true);
              setCurrentEventId(_id);
            }}
            className=" text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>) : ''}
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{timeOfEvent}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{venue}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{attendingMembers} attending</span>
          </div>
        </div>
        <button
          onClick={() => {
            setShowConfirmJoin(true);
            setCurrentEventId(_id);
          }}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Join Event
        </button>
      </div>

      {/* Confirm Delete Popup */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full relative animate-fadeIn">
            <button
              onClick={() => {
                setShowConfirmDelete(false);
                setCurrentEventId(null);
              }}
              className="absolute top-3 right-4 text-gray-400 hover:text-black cursor-pointer"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{ }</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to Delete this event?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setCurrentEventId(null);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={() => {
                  onDelete(currentEventId);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm cursor-pointer"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Join Popup */}
        {showConfirmJoin && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full relative animate-fadeIn">
              <button
                onClick={() => {
                  setShowConfirmJoin(false);
                  setCurrentEventId(null);
                }}
                className="absolute top-3 right-4 text-gray-400 hover:text-black cursor-pointer"
              >
                <X />
              </button>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Join this Event?</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to join this event?
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowConfirmJoin(false);
                    setCurrentEventId(null);
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={joining}
                  onClick={() => {
                    onJoin(currentEventId);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm cursor-pointer"
                >
                  { joining ? "Joining..." : "Yes, Join" }
                </button>
              </div>
            </div>
          </div>
        )}

    </>
  );
}

function CompletedEventCard({ _id, title, timeOfEvent, venue, attendingMembers, onDelete, deleting, currentUser, ownerId, showConfirmDelete, setShowConfirmDelete, currentEventId, setCurrentEventId  }) {

  return (
    <>
    <div className="bg-gray-100 p-6 rounded-xl shadow-sm flex flex-col justify-between h-full relative border border-gray-300 opacity-80">
      <div className='h-[20px] w-full'>
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
          Completed
        </div>
      </div>

      <div className="flex flex-row justify-between items-center mb-2">
        <h3 className="font-semibold text-lg text-gray-700 line-through">{title}</h3>
        { currentUser===ownerId ? (<button
            onClick={() => {
              setShowConfirmDelete(true);
              setCurrentEventId(_id);
            }}
            className=" text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>) : ''}
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{timeOfEvent}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{venue}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Users className="h-4 w-4 mr-2" />
          <span>{attendingMembers} attended</span>
        </div>
      </div>

      <button
        disabled
        className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
      >
        Event Over
      </button>
    </div>

    {/* Confirm Delete Popup */}
    {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full relative animate-fadeIn">
            <button
              onClick={() => {
                setShowConfirmDelete(false);
                setCurrentEventId(null);
              }}
              className="absolute top-3 right-4 text-gray-400 hover:text-black cursor-pointer"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{ }</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to Delete this event?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setCurrentEventId(null);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(currentEventId);
                }}
                disabled={deleting}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm cursor-pointer"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function isEventCompleted(timeOfEvent) {
  const [datePart, timePart] = timeOfEvent.split(' • ');
  const dateTimeStr = `${datePart} ${timePart}`;
  const eventDate = new Date(dateTimeStr);
  const now = new Date();
  return eventDate < now;
}


function Bulletin() {

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });
  const [selectedCircle, setSelectedCircle] = useState('');
  const [circleDropdownOpen, setCircleDropdownOpen] = useState(false);
  const [popupAlert, setPopupAlert] = useState({ show: false, message: '', type: 'success' });
  const [addingEvent, setAddingEvent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bulletin, setBulletin] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showConfirmJoin, setShowConfirmJoin] = useState(false);
  const [joiningEventId, setJoiningEventId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [circles, setCircles] = useState([]);
  const [circleNames, setCircleNames] = useState({});
  const router = useRouter();

  const getUserRole = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return docSnap.data().role;
    } else {
      return null;
    }
  };
  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     const user = auth.currentUser;
  //     if (user) {
  //       const role = await getUserRole(user.uid);
  //       setUserRole(role);
  //     }
  //   };
  //   fetchUserRole();
  // }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe(); 
  },[]);

    
  useEffect(() => {
    if (!currentUser?.uid) return;
    setLoading(true);
    const fetchCircles = async () => {
      const allCircles = await getAllCircles();
      const usersCircles = allCircles.filter((circle) => {
        return circle.members?.includes(currentUser?.uid);
      })
      setCircles(usersCircles);
      const newCircleNames = {};
      usersCircles.forEach((circle) => {
        newCircleNames[circle.name] = circle.id;
      });
      setCircleNames(newCircleNames);
      setLoading(false);
    };
    fetchCircles();
  }, [currentUser]);

  
  const showPopupAlert = (message, type = 'success') => {
    setPopupAlert({ show: true, message, type });
    setTimeout(() => setPopupAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleDeleteBulletin = async (id) => {
    setDeleting(true);
    if (!id) {
      setDeleting(false);
      showPopupAlert("❌ Error deleting bulletin.", "error");
      return;
    }
      try {
        const detetedBulletin = await axios.delete('/api/bulletin', { data: { id } });
        if (detetedBulletin.status === 200) {
          await fetchBulletin();
          showPopupAlert("🎉 Bulletin deleted successfully!", "success");
        }
      } catch (error) {
          console.error(error);
          showPopupAlert("❌ Error deleting bulletin.", "error");
      } finally {
        setDeleting(false);
        setShowConfirmDelete(false);
      }
  }

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location || !selectedCircle) {
      setAddingEvent(false);
      showPopupAlert("❌ All feilds are required.", "error");
      return;
    }

    setAddingEvent(true);
    const formattedDate = format(new Date(newEvent.date), "MMMM d, yyyy • h:mm a");

    const eventdata = {
      title: newEvent.title,
      timeOfEvent: formattedDate,
      venue: newEvent.location,
      description: newEvent.description || '',
      circle: selectedCircle,
      ownerId: currentUser?.uid,
      circleIdString: circleNames[selectedCircle],
    };

      try {
        const res = await axios.post('/api/bulletin', eventdata );

        if (res.status === 200 || res.status === 201) {
          await fetchBulletin();
        }
        showPopupAlert("🎉 Bulletin created successfully!", "success");
      } catch (error) {
          console.error('Error adding event:', error);
          showPopupAlert("❌ Error creating bulletin.", "error");
      } finally {
        setNewEvent({ title: '', date: '', location: '', description: '' });
        setSelectedCircle('');
        setCircleDropdownOpen(false);
        setShowAddPopup(false);
        setAddingEvent(false);
      }
  };

  const handleJoinEvent = async (id) => {
    setJoining(true);
    if (!id) {
      showPopupAlert("❌ Error joining event.", "error");
      return;
    }

    try {
        const res = await axios.patch(`/api/bulletin/`, { id } );
        if (res.status === 200) {
          await fetchBulletin();
          showPopupAlert("🎉 You have joined the event!", "success");
        }
      } catch (error) {      
          console.error('Error joining event:', error);
          showPopupAlert("❌ Error joining event.", "error");
      } finally {
        setJoining(false);
        setShowConfirmJoin(false); 
      }
  };

  const fetchBulletin = async () => {
      try {
        const res = await axios.get('/api/bulletin');
        if (res.status === 200) {
          const temp =  res.data;
          const allowedIds = new Set(Object.values({ ...circleNames }));
          const filteredBulletins = temp.filter(item => allowedIds.has(item.circleIdString));
          setBulletin(filteredBulletins);
        }
      } catch (error) {
        console.error('Error fetching bulletin:', error);
          console.error("Failed to fetch bulletin after retries.");
      } finally {
       setLoading(false);
      }
  };
  useEffect(() => {
    setLoading(true);

    fetchBulletin();
  }, [circleNames]);



  return (
    <PrivateRoute>
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
          {loading ? (
            Array(3).fill(0).map((_, i) => <SkeltonCard key={i} />
          )) : (bulletin.length > 0 ? (bulletin.map((event) => (

            isEventCompleted(event.timeOfEvent) ? (
              <CompletedEventCard
                key={event._id}
                _id={event._id}
                title={event.title}
                timeOfEvent={event.timeOfEvent}
                venue={event.venue}
                attendingMembers={event.attendingMembers}
                onDelete={handleDeleteBulletin}
                deleting={deleting}
                currentUser={currentUser?.uid}
                ownerId={event.ownerId}
                showConfirmDelete={showConfirmDelete}
                setShowConfirmDelete={setShowConfirmDelete}
                currentEventId={currentEventId}
                setCurrentEventId={setCurrentEventId}
              />
            ) : (
            <EventCard
              key={event._id}
              _id={event._id}
              title={event.title}
              timeOfEvent={event.timeOfEvent}
              venue={event.venue}
              attendingMembers={event.attendingMembers}
              onJoin={handleJoinEvent}
              joiningEventId={joiningEventId}
              setJoiningEventId={setJoiningEventId}
              joining={joining}
              showConfirmJoin={showConfirmJoin}
              setShowConfirmJoin={setShowConfirmJoin}
              onDelete={handleDeleteBulletin}
              deleting={deleting}
              showConfirmDelete={showConfirmDelete}
              setShowConfirmDelete={setShowConfirmDelete}
              currentEventId={currentEventId}
              setCurrentEventId={setCurrentEventId}
            />
            )
          ))) : (
            <div className="col-span-1 min-h-[60vh] flex justify-center items-center md:col-span-2 lg:col-span-3 text-center">
              <p className="text-gray-500">No events available at the moment.</p>
            </div>
          ))}
        </div>

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
              <Datetime
                value={newEvent.date ? moment(newEvent.date, "MMMM D, YYYY • h:mm A") : null}
                onChange={(date) => {
                  setNewEvent({ ...newEvent, date: date });
                }}
                dateFormat="MMMM D, YYYY"
                timeFormat="h:mm A"
                inputProps={{
                  placeholder: "Select Date & Time",
                  className: "w-full mb-3 px-4 py-2 border rounded-xl text-sm placeholder:text-gray-400",
                }}
              />

              <input
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Location"
                className="w-full mb-4 px-4 py-2 border rounded-xl text-sm placeholder:text-gray-400"
              />

              <input
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Description"
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
                    {circles.map((circle, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedCircle(circle?.name);
                          setCircleDropdownOpen(false);
                        }}
                        className="px-4 py-2 text-sm hover:bg-indigo-100 cursor-pointer"
                      >
                        {circle?.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAddEvent}
                className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
              >
                {addingEvent ? "Adding..." : "➕ Add Event"}
              </button>
            </div>
          </div>
        )}

        {/* Popup Alert */}
        {popupAlert.show && (
          <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-opacity duration-300 z-50 ${popupAlert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}
          >
            {popupAlert.message}
          </div>
        )}

      </div>
    </Layout>
    </PrivateRoute>
  );
}

export default Bulletin;

// if (moment.isMoment(date)) {
//   const formatted = date.format("MMMM D, YYYY • h:mm A");
//   setNewEvent({ ...newEvent, date: formatted });
// }