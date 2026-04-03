'use client';

import React, { useState, useEffect } from 'react';
import { getSupportRequests, updateSupportStatus } from '@/lib/api';
import { LifeBuoy, MessageSquare, CheckCircle2, Clock, Phone, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export function SupportHub() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupportRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching support requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const updated = await updateSupportStatus(id, newStatus);
      setRequests(requests.map(r => r._id === id ? updated : r));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold">Loading support requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
              <LifeBuoy className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Support Hub</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage customer help requests</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest">
              {requests.filter(r => r.status === 'open').length} Active
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Request Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                          {req.customerId?.name?.[0] || 'W'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{req.customerId?.name || 'WhatsApp User'}</p>
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5" /> {req.whatsappNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-slate-600 leading-relaxed">{req.message}</p>
                        {req.orderId && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-wider">
                            Order #{req.orderId._id?.slice(-6).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {format(new Date(req.createdAt), 'MMM dd, hh:mm a')}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        req.status === 'open' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {req.status === 'open' ? (
                        <button 
                          onClick={() => handleStatusUpdate(req._id, 'resolved')}
                          className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-600 transition-all"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <div className="flex justify-end">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center">
                      <MessageSquare className="h-10 w-10 text-slate-200 mb-4" />
                      <p className="text-slate-400 font-bold">No support requests yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
