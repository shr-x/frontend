'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getOrders, updateOrderStatus, getStoreInfo } from '@/lib/api';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  CreditCard,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

const statusConfig: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  preparing: { label: 'Preparing', icon: Clock, color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  out_for_delivery: { label: 'On the Way', icon: Truck, color: 'text-blue-700', bgColor: 'bg-blue-50' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-green-700', bgColor: 'bg-green-50' },
  paid: { label: 'Paid', icon: CreditCard, color: 'text-purple-700', bgColor: 'bg-purple-50' },
};

export function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o: any) => o._id === orderId ? updatedOrder : o));
      alert(`Order status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and track your shop's orders</p>
        </div>
        <button className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all">
          View All History
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order Detail</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 bg-slate-50 rounded-full">
                      <Package className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No orders found yet</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order: any) => {
                const config = statusConfig[order.status] || statusConfig.preparing;
                return (
                  <tr key={order._id} className="group hover:bg-slate-50/50 transition-all duration-200">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className="text-xs text-slate-400 font-medium flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(order.createdAt), 'h:mm a, MMM d')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs mr-3">
                          {order.customerId?.name?.charAt(0) || 'C'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{order.customerId?.name || 'Guest Customer'}</span>
                          <span className="text-xs text-slate-400">{order.customerId?.whatsappNumber || 'No WhatsApp'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="max-w-[180px] truncate">
                        <span className="text-sm text-slate-600 font-medium">
                          {order.items.map((i: any) => i.name).join(', ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm font-black text-slate-900">₹{order.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-500 transition-all cursor-pointer ${config.bgColor} ${config.color}`}
                        >
                          <option value="paid">Paid</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">On Way</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronRight className="h-3 w-3 rotate-90" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
