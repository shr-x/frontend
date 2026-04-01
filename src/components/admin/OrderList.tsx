'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const statusStyles: Record<string, string> = {
  preparing: 'bg-yellow-100 text-yellow-800',
  out_for_delivery: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  paid: 'bg-purple-100 text-purple-800',
};

export function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Replace with your actual storeId
    const storeId = '60d21b4667d0d8992e610c85'; 
    axios.get(`/api/orders?storeId=${storeId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    axios.patch(`/api/orders/${orderId}`, { status: newStatus })
      .then(response => {
        setOrders(orders.map((o: any) => o._id === orderId ? response.data : o));
      })
      .catch(error => {
        console.error('Error updating order status:', error);
      });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
        <button className="text-sm font-medium text-red-600 hover:text-red-700">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {orders.map((order: any) => (
              <tr key={order._id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.customerId?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 truncate max-w-xs">{order.items.map((i: any) => i.name).join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{order.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                    <option value="paid">Paid</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {format(new Date(order.createdAt), 'h:mm a')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
