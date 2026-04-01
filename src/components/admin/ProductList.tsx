'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, getStoreInfo } from '@/lib/api';
import { 
  Package, 
  Tag, 
  Layers, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Plus
} from 'lucide-react';

export function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const store = await getStoreInfo();
        if (store) {
          const productsData = await getProducts(store._id);
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inventory</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your meat products and stock levels</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-red-200 transition-all flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Stock</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 bg-slate-50 rounded-full">
                      <Tag className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No products in your catalog</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product._id} className="group hover:bg-slate-50/50 transition-all duration-200">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm transition-all overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{product.name}</span>
                        <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">{product.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600">
                      <Layers className="h-3 w-3 mr-1" />
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-sm font-black text-slate-900">₹{product.basePrice}</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{product.variants.reduce((acc: number, v: any) => acc + v.stock, 0)} units</span>
                      <span className="text-[10px] text-slate-400 font-medium">{product.variants.length} variants</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${product.isAvailable ? 'bg-green-50 text-green-700 ring-1 ring-green-600/10' : 'bg-red-50 text-red-700 ring-1 ring-red-600/10'}`}>
                      {product.isAvailable ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
                      ) : (
                        <><XCircle className="h-3 w-3 mr-1" /> Disabled</>
                      )}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-sm">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
