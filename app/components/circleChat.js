"use client";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  Paperclip,
  Send,
  Smile,
  Phone,
  Video,
  Search,
  MoreVertical,
  UserRoundPlus,
  X,
} from "lucide-react";

const addMemberToCircle = async (circleId, userId) => {
  try {
    const circleRef = doc(db, "circles", circleId);
    const circleSnap = await getDoc(circleRef);

    if (!circleSnap.exists()) {
      throw new Error("Circle does not exist");
    }

    const data = circleSnap.data();
    const members = data.members || [];

    if (members.includes(userId)) {
      return {
        success: false,
        message: "User is already a member of this circle",
      };
    }

    await updateDoc(circleRef, {
      members: arrayUnion(userId),
      memberTimestamps: {
        [userId]: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `User ${userId} added to circle ${circleId}`,
    };
  } catch (error) {
    console.error("❌ Error adding member:", error.message);
  }
};

const MessageBubble = ({ message, currentUser }) => {
  return (
    <div
      className={`flex ${
        message.senderId === `${currentUser.uid}`
          ? "justify-end"
          : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          message.senderId === `${currentUser.uid}`
            ? "bg-indigo-600 text-white rounded-tr-none"
            : "bg-gray-100 text-gray-900 rounded-tl-none"
        }`}
      >
        {!(message.senderId === currentUser.uid) && (
          <div className="text-xs text-pink-500 font-bold">
            {message.senderName.length > 18
              ? `${message.senderName.slice(0, 18)}...`
              : message.senderName}
          </div>
        )}

        <pre className="whitespace-pre-wrap">
          <code>{message.text}</code>
        </pre>
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-xs ${
            message.senderId === currentUser.uid
              ? "text-indigo-200"
              : "text-gray-500"
          }`}
        >
          <span
          // className={`${message.senderId === currentUser.uid ? "text-white" : "text-black"}`}
          >
            {message.createdAt?.seconds &&
              format(new Date(message.createdAt.seconds * 1000), "h:mm a")}
          </span>
          {message.senderId === currentUser?.uid &&
            (message.status === "read" ? (
              <CheckCheck className="h-4 w-4" />
            ) : message.status === "delivered" ? (
              <Check className="h-4 w-4" />
            ) : null)}
        </div>
      </div>
    </div>
  );
};

// Circle header
const CircleHeader = ({ circle }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [popupAlert, setPopupAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showPopupAlert = (message, type = "success") => {
    setPopupAlert({ show: true, message, type });
    setTimeout(
      () => setPopupAlert({ show: false, message: "", type: "success" }),
      5000
    );
  };

  const handleAddNewMember = async (e) => {
    e.preventDefault();
    try {
      setAddingMember(true);
      await addMemberToCircle(circle?.id, newMemberId);
      showPopupAlert("🎉 Member added successfully!", "success");
      setNewMemberId("");
      setShowAddMemberForm(false);
    } catch (error) {
      showPopupAlert("❌ Error adding member.", "error");
      console.error("Error adding member: ", error);
    } finally {
      setAddingMember(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={"/assets/avatar.png"}
            alt={circle?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {circle?.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{circle?.name}</h2>
          <p className="text-sm text-gray-500">
            {circle?.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {[Phone, Video].map((Icon, idx) => (
          <button
            key={idx}
            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <Icon className="h-5 w-5 text-gray-600" />
          </button>
        ))}
        <button
          onClick={() => setShowAddMemberForm(!showAddMemberForm)}
          className="p-2 hover:bg-gray-100 rounded-full relative"
        >
          <UserRoundPlus className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {showAddMemberForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <form
            onSubmit={handleAddNewMember}
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative animate-fadeIn"
          >
            <div className="flex flex-row justify-between items-center py-4">
              <h2 className="text-lg font-semibold text-gray-900 ">
                📌 Add New Member in Circle
              </h2>
              <button
                onClick={() => setShowAddMemberForm(false)}
                className="text-gray-400 hover:text-black"
              >
                <X />
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter user ID"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              required
              className="w-full mb-3 px-4 py-2 border rounded-xl text-sm placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition cursor-pointer"
            >
              {addingMember ? "Adding..." : "Add member"}
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
    </div>
  );
};

export default function CircleChat({ circleId, selectedCircleData }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const user = auth.currentUser;
  const messagesEndRef = useRef();
  const [currentUser, setCurrentUser] = useState("");
  const router = useRouter();

  useEffect(() => {
    // setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        // setLoading(false);
      } else {
        setCurrentUser(null);
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!circleId) return;

    const messagesRef = collection(db, "circles", circleId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
      console.log("Messages: ", newMessages);
      console.log("message state=", messages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [circleId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !user?.uid) return;

    const messagesRef = collection(db, "circles", circleId, "messages");

    await addDoc(messagesRef, {
      text: messageInput.trim(),
      senderId: user.uid,
      senderName: user.displayName,
      createdAt: serverTimestamp(),
    });

    setMessageInput("");
  };

  return (
    <>
      <div className="flex flex-col flex-1 bg-white">
        <CircleHeader circle={selectedCircleData} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-white  bg-[url('/assets/circles-bg-4.jpeg')] bg-contain bg-center space-y-4">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              currentUser={currentUser}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Paperclip className="h-5 w-5 text-gray-600 cursor-pointer" />
            </button>
            <textarea
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Share something with your circle..."
              rows={1}
              style={{ lineHeight: "1.5rem" }}
              onInput={(e) => {
                e.target.style.height = "auto"; 
                e.target.style.height = `${e.target.scrollHeight }px`;
              }}
              className="flex-1 bg-white flex items-center px-4 py-2 outline-none resize-none hide-scrollbar overflow-y-scroll max-h-25 "
              // focus:outline-none focus:ring-2 focus:ring-indigo-500
              /* onKeyDown={(e) => e.key === "Enter" && sendMessage(e)} */
            />
            <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
              <Smile className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={sendMessage}
              className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 cursor-pointer"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
