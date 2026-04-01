import React from 'react';
import { Sidebar } from '@/components/admin/Sidebar';

export default function CustomersPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
            {/* Customer list component will go here */}
          </div>
        </main>
      </div>
    </div>
  );
}
