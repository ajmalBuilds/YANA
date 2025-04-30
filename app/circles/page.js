"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { format } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  MessageSquarePlus,
  LogOut,
  Bell,
  Search,
  X,
  Check,
  CheckCheck,
} from "lucide-react";
import Layout from "../components/layout";
import { createCircle, getAllCircles } from "@/lib/circles";
import { set } from "mongoose";
import CircleChat from "../components/circleChat";

// Circle preview (left panel)
const CirclePreview = ({ circle, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-4 p-4 hover:bg-gray-50 cursor-pointer ${
      selected ? "bg-indigo-50" : ""
    }`}
  >
    <div className="relative">
      <img
        src={"/assets/avatar.png"}
        alt={circle.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      {circle.online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 truncate">{circle.name}</h3>
        <span className="text-sm text-gray-500">
          {format(new Date(circle.createdAt.seconds * 1000), "h:mm a")}
        </span>
      </div>
      <p className="text-gray-600 text-sm truncate">{circle.lastMessage}</p>
    </div>
    {circle.unread > 0 && (
      <div className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
        {circle.unread}
      </div>
    )}
  </div>
);

// Message bubble
const MessageBubble = ({ message }) => (
  <div
    className={`flex ${
      message.sender === "user" ? "justify-end" : "justify-start"
    } mb-4`}
  >
    <div
      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
        message.sender === "user"
          ? "bg-indigo-600 text-white rounded-br-none"
          : "bg-gray-100 text-gray-900 rounded-bl-none"
      }`}
    >
      <p>{message.content}</p>
      <div
        className={`flex items-center justify-end gap-1 mt-1 text-xs ${
          message.sender === "user" ? "text-indigo-200" : "text-gray-500"
        }`}
      >
        <span>{format(message.time, "h:mm a")}</span>
        {message.sender === "user" &&
          (message.status === "read" ? (
            <CheckCheck className="h-4 w-4" />
          ) : message.status === "delivered" ? (
            <Check className="h-4 w-4" />
          ) : null)}
      </div>
    </div>
  </div>
);

// Circle header
const CircleHeader = ({ circle }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
    <div className="flex items-center space-x-4">
      <div className="relative">
        <img
          src={circle.avatar}
          alt={circle.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {circle.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div>
        <h2 className="font-semibold text-gray-900">{circle.name}</h2>
        <p className="text-sm text-gray-500">
          {circle.online ? "Online" : "Offline"}
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      {[Phone, Video, Search, MoreVertical].map((Icon, idx) => (
        <button key={idx} className="p-2 hover:bg-gray-100 rounded-full">
          <Icon className="h-5 w-5 text-gray-600" />
        </button>
      ))}
    </div>
  </div>
);

// Main Yana Circles Page
const Messages = () => {
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const messageEndRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [circles, setCircles] = useState([]);
  const [popupAlert, setPopupAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [newCircle, setNewCircle] = useState({
    name: "",
    description: "",
  });

  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [creatingCircle, setCreatingCircle] = useState(false);
  const router = useRouter();

  const [circleMessages, setCircleMessages] = useState({
    1: [],
    2: [],
    3: [],
  });

  useEffect(() => {
    if (circles.length > 0 && !selectedCircle) {
      setSelectedCircle(circles[0].id);
    }
  }, [circles]);

  const showPopupAlert = (message, type = "success") => {
    setPopupAlert({ show: true, message, type });
    setTimeout(
      () => setPopupAlert({ show: false, message: "", type: "success" }),
      5000
    );
  };

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

  useEffect(() => {
    if (!currentUser.uid) return;
    setLoading(true);
    const fetchCircles = async () => {
      const allCircles = await getAllCircles();
      const usersCircles = allCircles.filter((circle) => {
        return circle.members?.includes(currentUser.uid);
      });
      setCircles(usersCircles);
      setLoading(false);
    };
    fetchCircles();
  }, [currentUser]);

  const handleCreateCircle = async (e) => {
    e.preventDefault();
    setCreatingCircle(true);

    if (!newCircle.name || !newCircle.description || !currentUser?.uid) return;

    const id = await createCircle(newCircle, currentUser.uid);
    if (id) {
      setCircles((prev) => [
        ...prev,
        {
          id,
          ...newCircle,
          ownerId: currentUser.uid,
          members: [currentUser.uid],
          createdAt: new Date(),
        },
      ]);
      setNewCircle({ name: "", description: "" });
      setCreatingCircle(false);
      setShowForm(false);
      showPopupAlert("🎉 Circle created successfully!", "success");
    } else {
      setCreatingCircle(false);
      setShowForm(false);
      showPopupAlert("❌ Failed to create circle", "error");
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: messageInput,
      time: new Date(),
      sender: "user",
      status: "sent",
    };

    setCircleMessages((prev) => ({
      ...prev,
      [selectedCircle]: [...(prev[selectedCircle] || []), newMessage],
    }));

    setMessageInput("");
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [circleMessages[selectedCircle]]);

  const selectedCircleData = circles.find((c) => c.id === selectedCircle);

  return (
    <PrivateRoute>
      <Layout>
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search your community..."
                className="bg-transparent border-none focus:outline-none flex-1"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MessageSquarePlus
                  className="h-5 w-5 text-gray-600 cursor-pointer"
                  onClick={() => setShowForm(!showForm)}
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>
        {circles.length > 0 ? (
          <div className="h-[90vh] flex overflow-hidden">
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                  Yana Circles
                </h1>
              </div>
              <div className="flex-1 overflow-y-auto">
                {circles.map((circle) => (
                  <CirclePreview
                    key={circle.id}
                    circle={circle}
                    selected={circle.id === selectedCircle}
                    onClick={() => setSelectedCircle(circle.id)}
                  />
                ))}
              </div>
            </div>

            {/* Circle Messages */}
            {loading ? (
              ""
            ) : (
              <CircleChat
                circleId={selectedCircle}
                selectedCircleData={selectedCircleData}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-black-500 text-lg">No Circles</p>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
            <form
              onSubmit={handleCreateCircle}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative animate-fadeIn"
            >
              <div className="flex flex-row justify-between items-center py-4">
                <h2 className="text-lg font-semibold text-gray-900 ">
                  📌 Create New Circle
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-black"
                >
                  <X />
                </button>
              </div>
              <input
                type="text"
                placeholder="Circle Name"
                value={newCircle.name}
                onChange={(e) =>
                  setNewCircle({ ...newCircle, name: e.target.value })
                }
                required
                className="w-full mb-3 px-4 py-2 border rounded-xl text-sm placeholder:text-gray-400"
              />
              <textarea
                placeholder="Description"
                value={newCircle.description}
                onChange={(e) =>
                  setNewCircle({ ...newCircle, description: e.target.value })
                }
                required
                className="w-full mb-3 px-4 py-2 border rounded-xl text-sm placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition cursor-pointer"
              >
                {creatingCircle ? "Creating..." : "Create Circle"}
              </button>
            </form>
          </div>
        )}

        {popupAlert.show && (
          <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-opacity duration-300 z-50 ${
              popupAlert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {popupAlert.message}
          </div>
        )}
      </Layout>
    </PrivateRoute>
  );
};

export default Messages;
