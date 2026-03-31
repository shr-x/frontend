import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Clock 
} from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: '₹1,24,500', icon: TrendingUp, change: '+12.5%', changeType: 'increase' },
  { name: 'Active Orders', value: '18', icon: ShoppingBag, change: '+3.2%', changeType: 'increase' },
  { name: 'New Customers', value: '42', icon: Users, change: '+18.7%', changeType: 'increase' },
  { name: 'Avg. Fulfillment', value: '45 mins', icon: Clock, change: '-2 mins', changeType: 'decrease' },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div key={item.name} className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <item.icon className="h-6 w-6 text-slate-400" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-slate-500">{item.name}</dt>
                <dd>
                  <div className="text-lg font-bold text-slate-900">{item.value}</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-xs font-semibold ${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {item.change}
            </span>
            <span className="text-xs text-slate-500 ml-1">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}
