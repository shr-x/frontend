'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { OrderList } from '@/components/admin/OrderList';
import { ProductList } from '@/components/admin/ProductList';
import { Bell, Search, Menu, Sparkles, Send, Megaphone, Plus, AlertCircle, X, ShoppingBasket } from 'lucide-react';
import { getStoreInfo, getOrders } from '@/lib/api';

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [store, setStore] = useState<any>(null);
  const [newOrder, setNewOrder] = useState<any>(null);
  const [lastOrderCount, setLastOrderCount] = useState(0);

  useEffect(() => {
    getStoreInfo().then(setStore).catch(console.error);
    
    // Polling for new orders (Real-time pop-out simulation)
    const interval = setInterval(async () => {
      try {
        const orders = await getOrders();
        if (orders.length > lastOrderCount && lastOrderCount !== 0) {
          const latest = orders[0];
          setNewOrder(latest);
          // Auto-hide notification after 5 seconds
          setTimeout(() => setNewOrder(null), 5000);
        }
        setLastOrderCount(orders.length);
      } catch (e) {
        console.error(e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lastOrderCount]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                <OrderList />
              </div>
              <div className="space-y-10">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                    <Sparkles className="h-12 w-12 text-red-600" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Shop Health</h3>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-100">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-sm font-bold text-green-800">Bot Online</span>
                      </div>
                    </div>
                    <div className="space-y-4 px-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400">Shop Name</span>
                        <span className="text-sm font-black text-slate-900">Chick Meat</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400">Status</span>
                        <span className="text-sm font-black text-green-600 uppercase text-[10px]">Open</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden group">
                  <Megaphone className="h-12 w-12 text-white/10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-black text-lg mb-4 tracking-tight">Active Campaign</h3>
                  <p className="text-slate-400 text-sm mb-6 font-medium">
                    "Weekend Meat Feast" campaign is currently reaching 450+ customers.
                  </p>
                  <button onClick={() => setActiveTab('campaigns')} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black py-3 rounded-xl transition-all shadow-lg shadow-red-900/40">
                    Manage Campaigns
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case 'orders':
        return <OrderList />;
      case 'inventory':
        return <ProductList />;
      case 'campaigns':
        return (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center space-y-6">
            <div className="h-20 w-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto">
              <Megaphone className="h-10 w-10" />
            </div>
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Marketing Campaigns</h2>
              <p className="text-slate-500 font-medium mt-2">Send WhatsApp broadcasts to all your customers about new stock or weekend deals.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-6">
              <button className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-red-200 hover:bg-white transition-all text-left group">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all mb-4">
                  <Send className="h-5 w-5" />
                </div>
                <h4 className="font-black text-slate-900">New Broadcast</h4>
                <p className="text-xs text-slate-400 mt-1">Send text & buttons</p>
              </button>
              <button className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-red-200 hover:bg-white transition-all text-left group">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all mb-4">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="font-black text-slate-900">AI Promotion</h4>
                <p className="text-xs text-slate-400 mt-1">Auto-generated deals</p>
              </button>
            </div>
          </div>
        );
      default:
        return <div className="p-20 text-center font-bold text-slate-400">Coming Soon</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* Real-time Order Pop-out Notification */}
      {newOrder && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right duration-500">
          <div className="bg-white rounded-2xl shadow-2xl border-l-4 border-red-500 p-6 flex items-start space-x-4 max-w-md">
            <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
              <ShoppingBasket className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-slate-900 tracking-tight">New Order Received!</h4>
                <span className="text-[10px] font-black text-red-500 uppercase">Just Now</span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {newOrder.items.length} items • ₹{newOrder.totalAmount}
              </p>
              <button 
                onClick={() => { setActiveTab('orders'); setNewOrder(null); }}
                className="mt-3 text-xs font-black text-red-600 hover:text-red-700 underline underline-offset-4"
              >
                View Details
              </button>
            </div>
            <button onClick={() => setNewOrder(null)} className="text-slate-300 hover:text-slate-500">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setMobileOpen(false)}
        >
          <div 
            className="fixed inset-y-0 left-0 w-72 z-50 animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} className="hidden lg:flex" />

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
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Live Sync</span>
            </div>

            <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl relative transition-all">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors">Chick Meat</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Admin Panel</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 p-0.5 shadow-lg shadow-red-200 group-hover:rotate-3 transition-transform">
                <div className="h-full w-full rounded-[10px] bg-white border-2 border-white overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/initials/svg?seed=CM" alt="Avatar" />
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
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                    {activeTab === 'inventory' ? 'Stock Manager' : activeTab === 'campaigns' ? 'Marketing' : 'Overview'}
                  </h1>
                  <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-slate-500 font-medium mt-1">
                  Manage your meat business at <span className="text-red-600 font-bold underline underline-offset-4">Chick Meat</span>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {activeTab === 'inventory' ? (
                  <button className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-red-200 hover:shadow-red-300 transition-all flex items-center justify-center">
                    <Plus className="h-4 w-4 mr-2" />
                    New Product
                  </button>
                ) : (
                  <button onClick={() => setActiveTab('campaigns')} className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-red-200 hover:shadow-red-300 transition-all flex items-center justify-center">
                    <Send className="h-4 w-4 mr-2" />
                    Launch Campaign
                  </button>
                )}
              </div>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
