'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Clock
} from 'lucide-react';
import { getDashboardStats } from '@/lib/api';
import axios from 'axios';
import { cn } from '@/lib/utils';

export function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh stats every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-3xl bg-white border border-slate-100 animate-pulse"></div>
        ))}
      </div>
    );
  }

  const statItems = [
    { 
      name: 'Total Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      name: 'Active Orders', 
      value: stats.activeOrders.toString(), 
      icon: ShoppingBag, 
      color: 'text-slate-900',
      bgColor: 'bg-slate-100'
    },
    { 
      name: 'Customers', 
      value: stats.totalCustomers.toString(), 
      icon: Users, 
      color: 'text-slate-900',
      bgColor: 'bg-slate-100'
    },
    { 
      name: 'Fulfillment', 
      value: stats.avgFulfillment, 
      icon: Clock, 
      color: 'text-slate-900',
      bgColor: 'bg-slate-100'
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.name} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 group hover:border-red-100 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", item.bgColor)}>
                <Icon className={cn("h-6 w-6", item.color)} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.name}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{item.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
