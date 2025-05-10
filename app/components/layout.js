"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import {
  Home,
  Users,
  ShoppingBag,
  MessageSquarePlus,
  UserPlus2,
  Bell,
  Search,
  LogOut,
  CircleUserRound,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import BottomNavBar from "./BottomNavBar";
import InnerPageFooter from "./InnerPagefooter";

function NavLink({ href, icon: Icon, label }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-indigo-100 text-indigo-600"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{label}</span>
    </Link>
  );
}

export default function Layout({ children }) {
  const footerRef = useRef();
  const [footerVisible, setFooterVisible] = useState(false);
  const pathname = usePathname();
  const isCirclesPage = pathname === "/circles";
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [showForm, setShowForm] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1, // adjust as needed
      }
    );

    observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("logOut error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <aside className="w-64 bg-white border-r border-gray-200 p-4 fixed h-full">
          <div className="flex items-center mb-8">
            <UserPlus2 className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">YANA</span>
          </div>
          <nav className="space-y-2">
            <NavLink href="/dashboard" icon={Home} label="Dashboard" />
            <NavLink href="/bulletin" icon={Bell} label="Bulletin" />
            <NavLink href="/shelf" icon={ShoppingBag} label="Shelf" />
            <NavLink href="/circles" icon={Users} label="Circles" />
            <NavLink href="/profile" icon={CircleUserRound} label="Profile" />
          </nav>
        </aside>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 ${!isMobile && "md:ml-64"}`}>
        {/* Header */}
        {!isCirclesPage && (
          <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-lg">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search your community..."
                className="bg-transparent border-none focus:outline-none w-full"
              />
            </div>
            <div className="ml-4 flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button onClick={() => setLogoutPopup(!logoutPopup)} className="p-2 hover:bg-gray-100 rounded-lg">
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </header>
        )}

        {logoutPopup && (
          <div className="absolute top-16 right-5 mt-2 bg-white shadow-lg rounded-lg p-4 w-40 border border-gray-200 z-50">
            <p className="text-sm text-gray-700">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-between mt-3">
              <button
                onClick={handleLogOut}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setLogoutPopup(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Circles Page Header */}
        {isCirclesPage && (
          <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between">
            {!isMobile && (
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-lg">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search your community..."
                  className="bg-transparent border-none focus:outline-none w-full"
                />
              </div>
            )}
            {isMobile && (
              <span className="text-2xl font-bold text-gray-900">YANA</span>
            )}
            <div className="ml-4 flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MessageSquarePlus
                  className="h-5 w-5 text-gray-600 cursor-pointer"
                  onClick={() => setShowForm(!showForm)}
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button onClick={() => setLogoutPopup(!logoutPopup)} className="p-2 hover:bg-gray-100 rounded-lg">
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </header>
        )}

        {/* Page Content */}
        <div className={`${isCirclesPage ? "" : "p-4 sm:p-2"}`}>
          {children}
        </div>
      </main>

      {isMobile && !isCirclesPage && !footerVisible && <BottomNavBar />}
      {isMobile && !isCirclesPage && <InnerPageFooter ref={footerRef} />}
    </div>
  );
}
