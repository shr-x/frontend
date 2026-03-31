'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Orders', icon: ShoppingBag, href: '/orders' },
  { name: 'Products', icon: Package, href: '/products' },
  { name: 'Customers', icon: Users, href: '/customers' },
  { name: 'Marketing', icon: MessageSquare, href: '/marketing' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-20 items-center justify-center border-b border-slate-800">
        <h1 className="text-2xl font-bold text-red-500">MeatSaaS</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white',
              pathname === item.href ? 'bg-slate-800 text-white' : 'text-slate-400'
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
            MS
          </div>
          <div>
            <p className="text-white">Meat Shop Admin</p>
            <p className="text-xs">Premium Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
