'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, updateProduct } from '@/lib/api';
import { Flame, Tag, Plus, Check, X, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const toggleOffer = async (productId: string, currentStatus: boolean) => {
    setIsUpdating(productId);
    try {
      const updated = await updateProduct(productId, { onOffer: !currentStatus });
      setProducts(products.map(p => p._id === productId ? updated : p));
    } catch (error) {
      console.error('Failed to toggle offer:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleOfferPriceChange = async (productId: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price)) return;
    setIsUpdating(productId);
    try {
      const updated = await updateProduct(productId, { offerPrice: price });
      setProducts(products.map(p => p._id === productId ? updated : p));
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(null);
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
                <div key={p._id} className={cn(
                  "group relative bg-slate-50 rounded-[2.5rem] p-8 border-2 transition-all duration-500",
                  isUpdating === p._id ? "opacity-50 scale-95 border-red-100" : "hover:bg-white hover:shadow-2xl hover:shadow-red-500/10 border-transparent hover:border-red-50"
                )}>
                  {/* Badge */}
                  <div className="absolute -top-3 -right-3 h-10 w-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/40 rotate-12 group-hover:rotate-0 transition-transform duration-500 z-10">
                    <Flame className="h-5 w-5 text-white fill-white" />
                  </div>

                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-[2rem] overflow-hidden bg-white border-4 border-white shadow-xl shrink-0">
                        <img src={p.image || 'https://placehold.co/200x200/png?text=Meat'} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-xl border-4 border-slate-50 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <h4 className="font-black text-xl text-slate-900 truncate tracking-tight mb-1 uppercase">{p.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{p.category}</p>
                      
                      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original MRP</span>
                          <span className="text-sm font-black text-slate-400 line-through">₹{p.basePrice}</span>
                        </div>
                        
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-red-600 uppercase tracking-widest block text-left ml-2">Special Offer Price</label>
                          <div className="flex items-center bg-red-50/50 border-2 border-red-100 rounded-2xl px-4 py-3 focus-within:ring-8 focus-within:ring-red-500/5 focus-within:border-red-500 transition-all">
                            <span className="text-red-600 font-black text-lg mr-1">₹</span>
                            <input 
                              type="number" 
                              defaultValue={p.offerPrice}
                              onBlur={(e) => handleOfferPriceChange(p._id, e.target.value)}
                              className="bg-transparent border-none outline-none text-lg font-black text-red-600 w-full placeholder:text-red-200"
                              placeholder="0.00"
                            />
                            <span className="text-xs font-black text-red-400 ml-2 uppercase">/{p.unit}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleOffer(p._id, true)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2 group/btn"
                    >
                      <X className="h-4 w-4 group-hover/btn:rotate-90 transition-transform" />
                      Remove from Deals
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
