import React from 'react';
import { format } from 'date-fns';

const orders = [
  { id: 'ORD-001', customer: 'Rahul Sharma', items: 'Chicken Curry Cut (1kg)', amount: '₹280', status: 'preparing', time: new Date() },
  { id: 'ORD-002', customer: 'Priya Singh', items: 'Mutton Bone-in (500g)', amount: '₹450', status: 'out_for_delivery', time: new Date() },
  { id: 'ORD-003', customer: 'Amit Patel', items: 'Fish Fillet (1kg)', amount: '₹650', status: 'delivered', time: new Date() },
];

const statusStyles = {
  preparing: 'bg-yellow-100 text-yellow-800',
  out_for_delivery: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  paid: 'bg-purple-100 text-purple-800',
};

export function OrderList() {
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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 truncate max-w-xs">{order.items}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{order.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {format(order.time, 'h:mm a')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
