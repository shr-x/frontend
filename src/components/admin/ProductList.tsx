import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Replace with your actual storeId
    const storeId = '60d21b4667d0d8992e610c85'; 
    axios.get(`/api/products?storeId=${storeId}`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">All Products</h2>
        <button className="text-sm font-medium text-red-600 hover:text-red-700">Add Product</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {products.map((product: any) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{product.basePrice}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{product.variants.reduce((acc, v) => acc + v.stock, 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
