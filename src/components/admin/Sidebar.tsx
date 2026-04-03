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
  X,
  ShoppingBasket,
  ChevronRight,
  LifeBuoy,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

interface SidebarProps {
  onClose?: () => void;
  className?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  store?: any;
}

export function Sidebar({ onClose, className, activeTab, setActiveTab, store }: SidebarProps) {
  const { logout } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'inventory', label: 'Stock Manager', icon: Package },
    { id: 'offers', label: 'Today\'s Offers', icon: Megaphone },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ];

  return (
    <div className={cn("flex h-full w-80 flex-col bg-white overflow-hidden", className)}>      {/* Brand Logo */}
      <div className="flex h-24 items-center px-10 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <ShoppingBasket className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none uppercase">{store?.name || 'STORE'}</h1>
            <span className="text-[10px] font-black text-slate-300 tracking-[0.2em] mt-1 uppercase">Admin Hub</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-10 space-y-2">
        <div className="px-4 mb-6">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Menu</span>
        </div>
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
                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black transition-all duration-300 text-left group relative",
                isActive 
                  ? "bg-red-600 text-white shadow-xl shadow-red-600/20" 
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 opacity-50" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="p-8 border-t border-slate-50 space-y-6">
        <div className="px-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System</span>
        </div>
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black transition-all duration-300 text-left group",
              activeTab === 'settings' ? "bg-red-600 text-white shadow-xl shadow-red-600/20" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <Link 
            href="/privacy-policy"
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300 text-left group"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Privacy Policy</span>
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
        
        {/* Simple Store Indicator */}
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-8 w-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</span>
            <span className="text-xs font-black text-slate-900 mt-1 uppercase">Store Open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
