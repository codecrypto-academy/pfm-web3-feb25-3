'use client';

import Link from 'next/link';
import {  UserCircle, Factory, ExternalLinkIcon, Store, ShoppingCart, Truck, } from 'lucide-react';
import { usePathname } from 'next/navigation';

const menuItems = [
  //{ icon: <UserCircle />, label: 'Profile', href: '/dashboard/profile' },
  { icon: <Truck />, label: 'Transport', href: '/dashboard/transport' },
  { icon: <Factory />, label: 'Factory', href: '/dashboard/factory' },
  { icon: <Store />, label: 'Retailer', href: '/dashboard/retailer' },
  { icon: <ShoppingCart />, label: 'Consumer', href: '/dashboard/consumer' },
  { icon: <ExternalLinkIcon />, label: 'Exit', href: '/dashboard/exit' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-green-700 text-white flex flex-col">
      <Link href="/dashboard">
      <div className="py-6 px-4 text-xl font-bold border-b border-white-700">
        My Dashboard
      </div>
      </Link>
      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition ${
              pathname === item.href ? 'bg-gray-800' : ''
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
