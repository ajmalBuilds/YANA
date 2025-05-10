'use client';
import { Home, Search, PlusCircle, Bell, ShoppingBag, Users, CircleUserRound } from 'lucide-react';
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation"

function NavLink({ href, Icon }) {
    const pathname = usePathname();
    const isActive = pathname === href;
    const router = useRouter();
  
    return (
      <button
        onClick={() => router.push(href)}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-indigo-100 text-indigo-600"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Icon className="h-5 w-5 mr-3" />
      </button>
    );
  }

export default function BottomNavBar() {
  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-3 flex justify-between items-center z-500">
      <NavLink href="/dashboard" Icon={Home} />
      <NavLink href="/bulletin" Icon={Bell} />
      <NavLink href="/shelf" Icon={ShoppingBag} />
      <NavLink href="/circles" Icon={Users} />
      <NavLink href="/profile" Icon={CircleUserRound} />
    </nav>
  );
}

function NavItem({ Icon }) {
  return (
    <button className="text-gray-600 hover:text-black transition duration-200">
      <Icon className="w-6 h-6" />
    </button>
  );
}
