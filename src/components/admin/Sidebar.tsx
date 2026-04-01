'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  Megaphone,
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onClose?: () => void;
  className?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ onClose, className, activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn("flex h-full w-72 flex-col bg-slate-900 text-white shadow-2xl", className)}>
      <div className="flex h-20 items-center justify-between px-8 border-b border-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
            <Package className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">CHICK<span className="text-red-500">MEAT</span></h1>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose?.();
              }}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 text-left",
                isActive 
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500")} />
              <span>{item.label}</span>
              {item.id === 'orders' && (
                <span className="ml-auto bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-black">8</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
