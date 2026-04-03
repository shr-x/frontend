'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { useAuth } from '@/lib/AuthContext';
import { Users, Search, Filter, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { getCustomers } from '@/lib/api';

export default function CustomersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchCustomers();
  }, [isAuthenticated]);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.whatsappNumber?.includes(searchQuery)
  );

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex lg:w-80 shrink-0 border-r border-slate-100 bg-white">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 flex items-center px-10 border-b border-slate-50 shrink-0">
          <div className="flex-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Customer Hub</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your Chick Meat community</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-red-500/10 transition-all">
              <Search className="h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="bg-transparent border-none outline-none text-sm font-bold text-slate-600 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {loading ? 'Fetching Customers...' : `All Customers (${filteredCustomers.length})`}
                  </h3>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
                  <Filter className="h-4 w-4" />
                  Filter List
                </button>
              </div>
              
              {loading ? (
                <div className="p-20 flex flex-col items-center">
                  <div className="h-12 w-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400 font-bold">Loading your community...</p>
                </div>
              ) : filteredCustomers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                        <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">WhatsApp</th>
                        <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined</th>
                        <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity</th>
                        <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer._id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:from-red-50 group-hover:to-red-100 group-hover:text-red-600 transition-all">
                                {customer.name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="font-black text-slate-900">{customer.name || 'Anonymous'}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Regular Customer</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-2 text-slate-600 font-bold">
                              <Phone className="h-3 w-3 text-slate-300" />
                              {customer.whatsappNumber}
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                              <Calendar className="h-3 w-3 text-slate-300" />
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-green-50 text-green-600 uppercase tracking-wider">
                              Active
                            </span>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <button className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-red-600 transition-all">
                              <ShoppingBag className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center flex flex-col items-center justify-center">
                  <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                    <Users className="h-10 w-10 text-slate-200" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">No Customers Found</h4>
                  <p className="text-slate-400 font-bold max-w-sm">
                    We couldn't find any customers matching your search.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
