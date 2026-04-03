'use client';

import React, { useState, useEffect } from 'react';
import { Store, Save, Clock, MapPin } from 'lucide-react';
import { getStoreInfo, updateStoreInfo } from '@/lib/api';

export function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [store, setStore] = useState<any>({
    name: '',
    address: '',
    welcomeMessage: '',
    apiKey: '',
    location: {
      type: 'Point',
      coordinates: [0, 0] // [longitude, latitude]
    },
    deliveryRadius: 5,
    operatingHours: {
      open: '08:00',
      close: '20:00'
    }
  });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getStoreInfo();
        if (data) {
          setStore({
            ...data,
            location: data.location || { type: 'Point', coordinates: [0, 0] },
            deliveryRadius: data.deliveryRadius || 5,
            operatingHours: data.operatingHours || { open: '08:00', close: '20:00' }
          });
        }
      } catch (error) {
        console.error('Failed to fetch store info:', error);
      }
    };
    fetchStore();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStoreInfo(store);
      alert('Settings updated successfully! 🎉');
    } catch (error) {
      alert('Failed to update settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
              <input 
                type="text" 
                value={store.name || ''} 
                onChange={(e) => setStore({...store, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 ml-1">Address</label>
              <input 
                type="text" 
                value={store.address || ''} 
                onChange={(e) => setStore({...store, address: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 ml-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600" /> Latitude
              </label>
              <input 
                type="number" 
                step="0.000001"
                value={store.location?.coordinates?.[1] || 0} 
                onChange={(e) => setStore({
                  ...store, 
                  location: { ...store.location, coordinates: [store.location.coordinates[0], parseFloat(e.target.value)] }
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 ml-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600" /> Longitude
              </label>
              <input 
                type="number" 
                step="0.000001"
                value={store.location?.coordinates?.[0] || 0} 
                onChange={(e) => setStore({
                  ...store, 
                  location: { ...store.location, coordinates: [parseFloat(e.target.value), store.location.coordinates[1]] }
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 ml-1">Delivery Radius (km)</label>
              <input 
                type="number" 
                value={store.deliveryRadius || 5} 
                onChange={(e) => setStore({...store, deliveryRadius: parseFloat(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 ml-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" /> Opening Time
              </label>
              <input 
                type="time" 
                value={store.operatingHours?.open || '08:00'} 
                onChange={(e) => setStore({
                  ...store, 
                  operatingHours: { ...store.operatingHours, open: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 ml-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" /> Closing Time
              </label>
              <input 
                type="time" 
                value={store.operatingHours?.close || '20:00'} 
                onChange={(e) => setStore({
                  ...store, 
                  operatingHours: { ...store.operatingHours, close: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none" 
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500 ml-1">Welcome Message (WhatsApp)</label>
            <textarea 
              value={store.welcomeMessage || ''} 
              onChange={(e) => setStore({...store, welcomeMessage: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none h-32 resize-none" 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl shadow-slate-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Save className="h-5 w-5" />
          )}
          Save All Changes
        </button>
      </div>
    </div>
  );
}
