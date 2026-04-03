'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { useAuth } from '@/lib/AuthContext';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  if (isLoading) return null;
  if (!isAuthenticated) return null; // Root page handles login

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <div className="hidden lg:flex lg:w-80 shrink-0 border-r border-slate-100 bg-white">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 flex items-center px-10 border-b border-slate-50 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hub Analytics</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Deep dive into Chick Meat performance</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Minimal Placeholder for Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                  <BarChart3 className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Sales Growth</h3>
                  <p className="text-sm font-medium text-slate-400 mt-1">Monthly performance tracking</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                  <PieChart className="h-8 w-8 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Product Mix</h3>
                  <p className="text-sm font-medium text-slate-400 mt-1">Category distribution</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                  <Activity className="h-8 w-8 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">User Traffic</h3>
                  <p className="text-sm font-medium text-slate-400 mt-1">Real-time visitor data</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-20 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="h-24 w-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-8">
                <TrendingUp className="h-10 w-10 text-slate-200" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 italic uppercase">Optimization Hub</h2>
              <p className="text-slate-400 font-bold max-w-md leading-relaxed">
                We're currently processing your hub data to provide precise business insights.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
