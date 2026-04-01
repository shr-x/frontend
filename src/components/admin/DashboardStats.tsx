'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getStoreInfo } from '@/lib/api';
import axios from 'axios';

export function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const store = await getStoreInfo();
        if (store) {
          const response = await axios.get(`/api/dashboard-stats?storeId=${store._id}`);
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-white border border-slate-100 animate-pulse"></div>
        ))}
      </div>
    );
  }

  const statItems = [
    { 
      name: 'Total Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: TrendingUp, 
      change: '+12.5%', 
      trend: 'up',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      name: 'Active Orders', 
      value: stats.activeOrders.toString(), 
      icon: ShoppingBag, 
      change: '+3.2%', 
      trend: 'up',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      name: 'Total Customers', 
      value: stats.totalCustomers.toString(), 
      icon: Users, 
      change: '+18.7%', 
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      name: 'Avg. Fulfillment', 
      value: stats.avgFulfillment, 
      icon: Clock, 
      change: '-2 mins', 
      trend: 'down',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div key={item.name} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className={`flex items-center space-x-1 text-xs font-bold px-2 py-1 rounded-full ${item.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'}`}>
              {item.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              <span>{item.change}</span>
            </div>
          </div>
          
          <div className="mt-5">
            <p className="text-sm font-bold text-slate-500">{item.name}</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className="text-2xl font-black text-slate-900">{item.value}</h3>
              <span className="text-[10px] text-slate-400 font-medium">vs last month</span>
            </div>
          </div>

          <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <item.icon className="h-24 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
