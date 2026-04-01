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
  BarChart3,
  X
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

interface SidebarProps {
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full w-72 flex-col bg-slate-900 text-white shadow-2xl", className)}>
      <div className="flex h-20 items-center justify-between px-8 border-b border-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
            <Package className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">MEAT<span className="text-red-500">SAAS</span></h1>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
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
