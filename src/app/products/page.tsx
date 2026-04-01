import React from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { ProductList } from '@/components/admin/ProductList';

export default function ProductsPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            <ProductList />
          </div>
        </main>
      </div>
    </div>
  );
}
