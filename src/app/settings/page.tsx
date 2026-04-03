'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { useAuth } from '@/lib/AuthContext';
import { Settings, Store, Bell, Shield, Smartphone, Save } from 'lucide-react';

export default function SettingsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <div className="hidden lg:flex lg:w-80 shrink-0 border-r border-slate-100 bg-white">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 flex items-center px-10 border-b border-slate-50 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Configuration</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your Chick Meat preferences</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
          <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                  <Store className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Shop Identity</h3>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 ml-1">Shop Name</label>
                    <input type="text" defaultValue="Chick Meat" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 ml-1">Contact Email</label>
                    <input type="email" defaultValue="owner@chickmeat.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 ml-1">Welcome Message (WhatsApp)</label>
                  <textarea defaultValue="Welcome to Chick Meat! How can we help you today?" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none h-32 resize-none" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                  <Shield className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Security</h3>
              </div>
              <div className="p-8">
                <button className="text-red-600 font-black text-xs uppercase tracking-[0.2em] px-6 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all">
                  Rotate API Keys
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl shadow-slate-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Save className="h-5 w-5" />
                Save All Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
