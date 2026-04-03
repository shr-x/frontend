'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, updateProduct } from '@/lib/api';
import { Flame, Tag, Plus, Check, X, Package } from 'lucide-react';

export function OffersManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleOffer = async (productId: string, currentStatus: boolean) => {
    try {
      const updated = await updateProduct(productId, { onOffer: !currentStatus });
      setProducts(products.map(p => p._id === productId ? updated : p));
    } catch (error) {
      console.error('Failed to toggle offer:', error);
    }
  };

  const handleOfferPriceChange = async (productId: string, newPrice: string) => {
    try {
      const price = parseFloat(newPrice);
      if (isNaN(price)) return;
      const updated = await updateProduct(productId, { offerPrice: price });
      setProducts(products.map(p => p._id === productId ? updated : p));
    } catch (e) {
      console.error(e);
    }
  };

  const offerProducts = products.filter(p => p.onOffer);
  const otherProducts = products.filter(p => !p.onOffer);

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold">Syncing offers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Active Offers Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
              <Flame className="h-6 w-6 text-red-600 fill-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Special Deals</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Visible to customers on WhatsApp</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest">
            {offerProducts.length} Items Live
          </span>
        </div>
        
        <div className="p-8">
          {offerProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerProducts.map((p) => (
                <div key={p._id} className="group relative bg-slate-50 rounded-[2rem] p-6 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-red-500/5">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white border border-slate-100 shrink-0">
                      <img src={p.image || 'https://placehold.co/100x100/png?text=Meat'} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-900 truncate tracking-tight">{p.name}</h4>
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 line-through">MRP: ₹{p.basePrice}</span>
                        </div>
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-4 focus-within:ring-red-500/5 focus-within:border-red-500 transition-all">
                          <span className="text-red-600 font-black text-[10px] mr-1">Offer: ₹</span>
                          <input 
                            type="number" 
                            defaultValue={p.offerPrice}
                            onBlur={(e) => handleOfferPriceChange(p._id, e.target.value)}
                            className="bg-transparent border-none outline-none text-xs font-black text-red-600 w-full"
                            placeholder="Set Price"
                          />
                          <span className="text-[10px] font-bold text-slate-400 ml-1">/{p.unit}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleOffer(p._id, true)}
                      className="h-8 w-8 bg-white text-slate-400 hover:text-red-600 rounded-lg flex items-center justify-center shadow-sm border border-slate-100 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold">No items are currently on offer.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add More Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
            <Plus className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Add Items to "Today's Offers"</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {otherProducts.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        <img src={p.image || 'https://placehold.co/100x100/png?text=Meat'} alt="" className="h-full w-full object-cover" />
                      </div>
                      <span className="font-black text-slate-900 tracking-tight">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">{p.category}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-600">₹{p.basePrice}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => toggleOffer(p._id, false)}
                      className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all active:scale-95"
                    >
                      Add to Deals
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
