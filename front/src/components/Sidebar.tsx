'use client';

import Link from 'next/link';
import { UserCircle, Factory, ExternalLinkIcon, Store, ShoppingCart, Truck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { RoleType } from '@/app/entity/user.entity';

const menuItems = [
  { icon: <Truck />, label: 'Transporte', href: '/dashboard/transport', roles: [RoleType.TRANSPORT] },
  { icon: <Factory />, label: 'Fábrica', href: '/dashboard/factory', roles: [RoleType.PRODUCER] },
  { icon: <Store />, label: 'Distribuidor', href: '/dashboard/retailer', roles: [RoleType.DISTRIBUTOR] },
  { icon: <ShoppingCart />, label: 'Consumidor', href: '/dashboard/consumer', roles: [RoleType.USER] },
  { icon: <ExternalLinkIcon />, label: 'Salir', href: '/dashboard/exit', },
];

export default function Sidebar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return <div className="w-64 h-screen bg-green-700 text-white flex items-center justify-center">Cargando...</div>;
  }

  return (
    <aside className="w-64 h-screen bg-green-700 text-white flex flex-col">
      <Link href="/dashboard">
        <div className="py-6 px-4 text-xl font-bold border-b border-white-700">My Dashboard</div>
      </Link>
      <nav className="flex flex-col gap-2 p-4">
        {menuItems 
          .filter(item => !item.roles || user?.roles?.some(role => item.roles?.includes(role)))
          .map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition ${pathname === item.href ? 'bg-gray-800' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
}
