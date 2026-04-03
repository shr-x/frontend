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
  pending: { label: 'New Order', icon: Clock, color: 'text-rose-600', bgColor: 'bg-rose-50' },
  confirmed: { label: 'Verified', icon: CheckCircle2, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  preparing: { label: 'Preparing', icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  out_for_delivery: { label: 'On Way', icon: Truck, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
  cancelled: { label: 'Cancelled', icon: Package, color: 'text-slate-400', bgColor: 'bg-slate-100' },
};

export function OrderList({ minimal = false }: { minimal?: boolean }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [editedItems, setEditedItems] = useState<any[]>([]);

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
    const interval = setInterval(fetchData, 10000); // Refresh orders every 10s
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o: any) => o._id === orderId ? updatedOrder : o));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePriceUpdate = async () => {
    if (!editingOrder || !newPrice) return;
    try {
      const updatedOrder = await updateOrderStatus(editingOrder._id, { 
        totalAmount: parseFloat(newPrice),
        items: editedItems,
        status: 'confirmed'
      } as any);
      setOrders(orders.map((o: any) => o._id === editingOrder._id ? updatedOrder : o));
      setEditingOrder(null);
      setNewPrice('');
      setEditedItems([]);
      alert('Order verified and price adjusted! Customer notified. 🍗');
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order. Please try again.');
    }
  };

  const handleItemWeightChange = (itemIndex: number, newWeight: string) => {
    const weight = parseFloat(newWeight);
    if (isNaN(weight)) return;

    const newItems = [...editedItems];
    const item = newItems[itemIndex];
    item.quantity = weight;
    
    // Recalculate total price for the item if we have the unit price
    // Note: We're using item.price which is price per unit (kg)
    const newTotal = (item.price || 0) * weight;
    
    setEditedItems(newItems);
    
    // Recalculate grand total
    const total = newItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    setNewPrice(Math.round(total).toString());
  };

  const openVerifyModal = (order: any) => {
    setEditingOrder(order);
    setNewPrice(order.totalAmount.toString());
    setEditedItems(JSON.parse(JSON.stringify(order.items))); // Deep clone items
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin shadow-sm"></div>
        <p className="text-slate-400 font-bold text-sm tracking-tight">Syncing orders...</p>
      </div>
    );
  }

  if (minimal) {
    return (
      <div className="divide-y divide-slate-50">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">No active orders</div>
        ) : (
          orders.slice(0, 5).map((order: any) => (
            <div key={order._id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 tracking-tight">#{order._id?.slice(-6).toUpperCase()}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{order.customerId?.name || 'Walk-in Customer'}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <p className="font-black text-slate-900">₹{order.totalAmount}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{format(new Date(order.createdAt), 'hh:mm a')}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${statusConfig[order.status]?.bgColor || 'bg-slate-100'} ${statusConfig[order.status]?.color || 'text-slate-600'}`}>
                  {order.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Management</h2>
          <p className="text-slate-400 font-bold text-sm mt-1">Real-time tracking of all incoming orders</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Items</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-10 py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-6 bg-slate-50 rounded-3xl">
                      <Package className="h-10 w-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold text-lg tracking-tight">No active orders found</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order: any) => {
                const config = statusConfig[order.status] || statusConfig.preparing;
                return (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6 whitespace-nowrap">
                      <span className="font-black text-slate-900 tracking-tight">#{order._id?.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs mr-3">
                          {order.customerId?.name?.charAt(0) || 'C'}
                        </div>
                        <div className="text-sm font-bold text-slate-900">{order.customerId?.name || 'Walk-in'}</div>
                      </div>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-500 max-w-[200px] truncate">
                        {order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      <span className="font-black text-slate-900">₹{order.totalAmount}</span>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${config.bgColor} ${config.color}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => openVerifyModal(order)}
                              className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all"
                            >
                              Verify & Adjust
                            </button>
                            <button 
                              onClick={() => handleStatusChange(order._id, 'cancelled')}
                              className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        ) : order.status === 'confirmed' ? (
                          <div className="flex gap-2">
                            <span className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 rounded-xl">
                              Waiting for Customer
                            </span>
                            <button 
                              onClick={() => handleStatusChange(order._id, 'cancelled')}
                              className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <select 
                            value={order.status}
                            disabled={order.status === 'delivered' || order.status === 'cancelled'}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="pending" disabled>New</option>
                            <option value="confirmed" disabled>Verified</option>
                            <option value="preparing" disabled={order.status !== 'preparing'}>Prepare</option>
                            <option value="out_for_delivery" disabled={order.status !== 'preparing' && order.status !== 'out_for_delivery'}>Dispatch</option>
                            <option value="delivered" disabled={order.status !== 'out_for_delivery' && order.status !== 'delivered'}>Deliver</option>
                            <option value="cancelled" disabled={order.status === 'delivered'}>Cancel</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Price Adjustment Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Verify Order</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8">Order #{editingOrder._id.slice(-6).toUpperCase()}</p>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adjust Quantities (Weight)</label>
                <div className="space-y-3">
                  {editedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">{item.productName || item.name}</span>
                        <span className="text-[10px] font-bold text-slate-400">₹{item.price}/{item.variantName || 'kg'}</span>
                      </div>
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-4 focus-within:ring-red-500/5 focus-within:border-red-500 transition-all">
                        <input 
                          type="number" 
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => handleItemWeightChange(idx, e.target.value)}
                          className="w-16 bg-transparent border-none outline-none text-xs font-black text-slate-900 text-right"
                        />
                        <span className="text-[10px] font-bold text-slate-400 ml-1">kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Final Total Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-900">₹</span>
                  <input 
                    type="number" 
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-6 py-4 text-slate-900 font-black focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => { setEditingOrder(null); setEditedItems([]); }}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePriceUpdate}
                  className="flex-[2] px-6 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-200"
                >
                  Send to Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
