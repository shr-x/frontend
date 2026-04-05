'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { OrderList } from '@/components/admin/OrderList';
import { ProductList } from '@/components/admin/ProductList';
import { CustomerList } from '@/components/admin/CustomerList';
import { Settings } from '@/components/admin/Settings';
import { OffersManager } from '@/components/admin/OffersManager';
import { SupportHub } from '@/components/admin/SupportHub';
import { CampaignManager } from '@/components/admin/CampaignManager';
import { 
  Bell, 
  Search, 
  Menu, 
  Sparkles, 
  Plus, 
  AlertCircle, 
  X, 
  ShoppingBasket,
  ChevronRight,
  User,
  LogOut,
  Lock,
  Megaphone,
  Send,
  LifeBuoy,
  Download
} from 'lucide-react';
import { getStoreInfo, getOrders, searchData, createCampaign, getDashboardStats, exportReport } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      window.location.reload();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Admin Portal</h1>
          <p className="text-slate-400 font-medium">Please enter your credentials to access the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm font-bold text-center">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-red-600/30 transform active:scale-[0.98]"
          >
            Authenticate Access
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [store, setStore] = useState<any>(null);
  const [newOrder, setNewOrder] = useState<any>(null);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Auto-clear search results when clicking away or selecting a tab
  useEffect(() => {
    if (activeTab !== 'orders') {
      setSelectedOrderId(null);
    }
  }, [activeTab]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [storeData, statsData] = await Promise.all([
          getStoreInfo(),
          getDashboardStats()
        ]);
        setStore(storeData);
        setTotalCustomers(statsData.totalCustomers);
        setTotalProducts(statsData.totalProducts);
      } catch (e) {
        setStore({ name: 'Chick Meat' });
      }
    };
    fetchData();
    
    const interval = setInterval(async () => {
      try {
        const orders = await getOrders();
        if (orders.length > lastOrderCount && lastOrderCount !== 0) {
          setNewOrder(orders[0]);
          setTimeout(() => setNewOrder(null), 8000);
        }
        setLastOrderCount(orders.length);
      } catch (e) {
        console.error('Order sync failed');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, lastOrderCount]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { csv, filename } = await exportReport();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', filename);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const results = await searchData(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (isLoading) return null;
  if (!isAuthenticated) return <Login />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-red-600 font-bold text-sm flex items-center hover:translate-x-1 transition-transform">
                      View all <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <OrderList minimal />
                </div>
              </div>
              <div className="space-y-10">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 group">
                  <h3 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Store Overview</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-5 bg-green-50/50 rounded-2xl border border-green-100">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-green-500 rounded-full mr-3 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-sm font-black text-green-800">WhatsApp Bot Active</span>
                      </div>
                    </div>
                    <div className="space-y-5 px-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400">Inventory</span>
                        <span className="text-sm font-black text-slate-900">{totalProducts} Items</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400">Customers</span>
                        <span className="text-sm font-black text-slate-900">{totalCustomers} Users</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                    <Megaphone className="h-24 w-24" />
                  </div>
                  <h3 className="font-black text-lg mb-4 tracking-tight">Marketing</h3>
                  <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">
                    Schedule and send broadcasts to your customer base.
                  </p>
                  <button onClick={() => setActiveTab('marketing')} className="w-full bg-white text-slate-900 text-sm font-black py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-white/5 active:scale-[0.98]">
                    Launch Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return <OrderList selectedOrderId={selectedOrderId} onClearSelection={() => setSelectedOrderId(null)} />;
      case 'inventory':
        return <ProductList />;
      case 'offers':
        return <OffersManager />;
      case 'customers':
        return <CustomerList />;
      case 'support':
        return <SupportHub />;
      case 'marketing':
        return <CampaignManager />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* Search Results Dropdown */}
              {searchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    {searchResults.orders.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">Orders</h4>
                        {searchResults.orders.map((order: any) => (
                          <div 
                            key={order._id}
                            onClick={() => { 
                              setSelectedOrderId(order._id);
                              setActiveTab('orders'); 
                              setSearchQuery(''); 
                            }}
                            className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                          >
                            <span className="text-xs font-bold text-slate-700">#{order._id.toString().slice(-6).toUpperCase()}</span>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 rounded-md">{order.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {searchResults.customers.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">Customers</h4>
                        {searchResults.customers.map((customer: any) => (
                          <div 
                            key={customer._id}
                            onClick={() => { setActiveTab('customers'); setSearchQuery(''); }}
                            className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                          >
                            <p className="text-xs font-bold text-slate-700">{customer.name}</p>
                            <p className="text-[10px] text-slate-400">{customer.whatsappNumber}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.products.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">Products</h4>
                        {searchResults.products.map((product: any) => (
                          <div 
                            key={product._id}
                            onClick={() => { setActiveTab('inventory'); setSearchQuery(''); }}
                            className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors flex items-center gap-3"
                          >
                            <div className="h-8 w-8 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={product.image} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700">{product.name}</p>
                              <p className="text-[10px] text-slate-400">₹{product.basePrice}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.orders.length === 0 && searchResults.customers.length === 0 && searchResults.products.length === 0 && (
                      <div className="p-8 text-center">
                        <p className="text-sm font-bold text-slate-400">No results found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-5">
            <div className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Live Sync</span>
            </div>

            <div className="relative group">
              <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl relative transition-all">
                <Bell className="h-6 w-6" />
                {newOrder && (
                  <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
                )}
                <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {/* Notifications Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">Notifications</h4>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">Real-time</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {newOrder ? (
                    <div 
                      onClick={() => { setActiveTab('orders'); setNewOrder(null); }}
                      className="p-4 hover:bg-slate-50 cursor-pointer transition-colors border-l-4 border-red-500"
                    >
                      <p className="text-xs font-black text-slate-900">New Order Received!</p>
                      <p className="text-[11px] text-slate-500 mt-1">Order for ₹{newOrder.totalAmount} just arrived.</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Just now</p>
                    </div>
                  ) : (
                    <div className="p-10 text-center">
                      <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bell className="h-6 w-6 text-slate-200" />
                      </div>
                      <p className="text-xs font-bold text-slate-400">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
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
                    {activeTab === 'inventory' ? 'Stock Manager' : 
                     activeTab === 'offers' ? "Today's Offers" : 
                     activeTab === 'customers' ? 'Community' :
                     activeTab === 'support' ? 'Support Hub' :
                     activeTab === 'marketing' ? 'Marketing' :
                     activeTab === 'settings' ? 'Settings' :
                     activeTab === 'orders' ? 'Orders' : 'Overview'}
                  </h1>
                  <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-slate-500 font-medium mt-1">
                  Manage your business at <span className="text-red-600 font-bold underline underline-offset-4">{store?.name || 'Store'}</span>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {activeTab === 'orders' ? (
                  <button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center disabled:opacity-50 shadow-sm"
                  >
                    <Download className={cn("h-4 w-4 mr-2", isExporting && "animate-bounce")} />
                    {isExporting ? 'Exporting...' : 'Export Report'}
                  </button>
                ) : null}
                {activeTab === 'inventory' ? (
                  <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                ) : null}
              </div>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
