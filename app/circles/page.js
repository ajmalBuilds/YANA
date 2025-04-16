"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { format } from "date-fns";
import {
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Search,
  Check,
  CheckCheck,
} from "lucide-react";
import Layout from "../components/layout";

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
        src={circle.avatar}
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
          {format(circle.time, "h:mm a")}
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
  const [selectedCircle, setSelectedCircle] = useState("1");
  const [messageInput, setMessageInput] = useState("");
  const messageEndRef = useRef(null);

  const [circleMessages, setCircleMessages] = useState({
    "1": [],
    "2": [],
    "3": [],
  });

  const circles = useMemo(() => {
    return [
      {
        id: "1",
        name: "Tech Enthusiasts",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        lastMessage:
          (circleMessages["1"] || []).slice(-1)[0]?.content || "",
        time:
          (circleMessages["1"] || []).slice(-1)[0]?.time ||
          new Date(2024, 2, 10, 14, 30),
        unread: (circleMessages["1"] || []).filter(
          (msg) => msg.sender !== "user" && msg.status !== "read"
        ).length,
        online: true,
      },
      {
        id: "2",
        name: "Startup Ideas",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        lastMessage:
          (circleMessages["2"] || []).slice(-1)[0]?.content || "",
        time:
          (circleMessages["2"] || []).slice(-1)[0]?.time ||
          new Date(2024, 2, 10, 12, 15),
        unread: (circleMessages["2"] || []).filter(
          (msg) => msg.sender !== "user" && msg.status !== "read"
        ).length,
        online: false,
      },
      {
        id: "3",
        name: "YANA Volunteers",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        lastMessage:
          (circleMessages["3"] || []).slice(-1)[0]?.content || "",
        time:
          (circleMessages["3"] || []).slice(-1)[0]?.time ||
          new Date(2024, 2, 10, 10, 45),
        unread: (circleMessages["3"] || []).filter(
          (msg) => msg.sender !== "user" && msg.status !== "read"
        ).length,
        online: true,
      },
    ];
  }, [circleMessages]);

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
    <Layout>
      { circles.length > 0 ? (<div className="h-[90vh] flex overflow-hidden">
        {/* Circles List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Yana Circles</h1>
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
        <div className="flex flex-col flex-1 bg-white">
          {selectedCircleData && (
            <>
              {/* Header */}
              <CircleHeader circle={selectedCircleData} />

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4  bg-[url('/assets/circles-bg-2.jpg')] bg-cover bg-center space-y-4">
                {(circleMessages[selectedCircle] || []).map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messageEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Paperclip className="h-5 w-5 text-gray-600" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Share something with your circle..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Smile className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-black-500 text-lg">No Circles</p>
        </div>
      ) }

    </Layout>
  );
};

export default Messages;
