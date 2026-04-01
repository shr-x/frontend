'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { OrderList } from '@/components/admin/OrderList';
import { Bell, Search, Menu, Sparkles, Send } from 'lucide-react';
import { getStoreInfo } from '@/lib/api';

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    getStoreInfo().then(setStore).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setMobileOpen(false)}
        >
          <div 
            className="fixed inset-y-0 left-0 w-72 z-50 bg-white shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center flex-1 max-w-xl">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2.5 mr-4 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search orders, customers, products..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-5">
            <div className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">System Live</span>
            </div>

            <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl relative transition-all">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors">{store?.name || 'Loading...'}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Admin Dashboard</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 p-0.5 shadow-lg shadow-red-200 group-hover:rotate-3 transition-transform">
                <div className="h-full w-full rounded-[10px] bg-white border-2 border-white overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${store?.name || 'MS'}`} alt="Avatar" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-10">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                  <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-slate-500 font-medium mt-1">
                  Everything is looking great today at <span className="text-red-600 font-bold">{store?.name}</span>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex-1 sm:flex-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
                  View Reports
                </button>
                <button className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-red-200 hover:shadow-red-300 transition-all flex items-center justify-center">
                  <Send className="h-4 w-4 mr-2" />
                  New Broadcast
                </button>
              </div>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                <OrderList />
              </div>
              <div className="space-y-10">
                {/* Enhanced Quick Actions */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                    <Sparkles className="h-12 w-12 text-red-600" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-6">Store Quick Status</h3>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-100 group/status">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 bg-green-500 rounded-full mr-3 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-sm font-bold text-green-800 tracking-tight">WhatsApp Bot Active</span>
                      </div>
                      <div className="h-6 w-10 bg-green-200 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                    <div className="space-y-4 px-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400">Hours</span>
                        <span className="text-sm font-black text-slate-900">{store?.operatingHours?.open || '09:00'} - {store?.operatingHours?.close || '21:00'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400">Radius</span>
                        <span className="text-sm font-black text-slate-900">{store?.deliveryRadius || '5'} km</span>
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                          Manage Shop Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights Card */}
                <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-8 text-white shadow-2xl shadow-red-200 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-32 w-32" />
                  </div>
                  <div className="flex items-center mb-6">
                    <div className="bg-white/20 p-2.5 rounded-xl mr-4 backdrop-blur-md">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-black text-lg tracking-tight">Smart Insights</h3>
                  </div>
                  <p className="text-white/90 text-sm mb-8 leading-relaxed font-medium">
                    "Chicken Curry Cut" is trending! Customers are asking for skinless variants 24% more frequently this week.
                  </p>
                  <button className="w-full bg-white text-red-600 hover:bg-red-50 text-xs font-black py-3.5 rounded-xl transition-all shadow-lg shadow-black/10 flex items-center justify-center">
                    Launch Promo Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
