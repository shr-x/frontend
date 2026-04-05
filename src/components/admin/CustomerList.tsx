'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { getCustomers } from '@/lib/api';

export function CustomerList() {
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
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.whatsappNumber?.includes(searchQuery)
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-10 border-b border-slate-50 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-200">
            <Users className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {loading ? 'Fetching Customers...' : `All Customers (${filteredCustomers.length})`}
          </h3>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/5">
          <Search className="h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search community..." 
            className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
  );
}
