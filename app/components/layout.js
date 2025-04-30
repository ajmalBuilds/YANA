"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isCirclesPage = pathname === "/circles";

  return (
    <div className="min-h-screen bg-gray-50 flex">
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

      <main className="flex-1 ml-64">
        {!isCirclesPage && (
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
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <LogOut className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Conditionally applying padding */}
        <div className={isCirclesPage ? "p-0" : "p-8"}>{children}</div>
      </main>
    </div>
  );
}
