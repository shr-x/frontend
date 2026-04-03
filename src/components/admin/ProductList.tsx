'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, getStoreInfo, updateProduct, createProduct, uploadImage } from '@/lib/api';
import { 
  Package, 
  Tag, 
  Layers, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Plus,
  Edit2,
  X,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

export function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'chicken',
    basePrice: '',
    unit: 'kg',
    description: '',
    image: '',
    isAvailable: true,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { filePath } = await uploadImage(file);
      const fullUrl = `${apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl}${filePath}`;
      setNewProduct({ ...newProduct, image: fullUrl });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh products every 30s
    return () => clearInterval(interval);
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = newProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const productData = {
        ...newProduct,
        basePrice: parseFloat(newProduct.basePrice as string),
        slug,
        variants: [] // Default empty variants for now
      };
      
      if (editingProductId) {
        const updated = await updateProduct(editingProductId, productData);
        setProducts(products.map(p => p._id === editingProductId ? updated : p));
        alert('Product updated successfully! 🍗');
      } else {
        const created = await createProduct(productData);
        setProducts([created, ...products]);
        alert('Product added successfully! 🍗');
      }
      
      closeModal();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please check all fields.');
    }
  };

  const openEditModal = (product: any) => {
    setEditingProductId(product._id);
    setNewProduct({
      name: product.name,
      category: product.category,
      basePrice: product.basePrice.toString(),
      unit: product.unit || 'kg',
      description: product.description || '',
      image: product.image || '',
      isAvailable: product.isAvailable,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setNewProduct({
      name: '',
      category: 'chicken',
      basePrice: '',
      unit: 'kg',
      description: '',
      image: '',
      isAvailable: true,
    });
  };

  const handlePriceChange = async (productId: string, field: string, newPrice: string) => {
    try {
      const price = parseFloat(newPrice);
      if (isNaN(price)) return;
      const updated = await updateProduct(productId, { [field]: price });
      setProducts(products.map(p => p._id === productId ? updated : p));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleAvailability = async (productId: string, current: boolean) => {
    try {
      const updated = await updateProduct(productId, { isAvailable: !current });
      setProducts(products.map(p => p._id === productId ? updated : p));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleOffer = async (productId: string, current: boolean) => {
    try {
      const updated = await updateProduct(productId, { onOffer: !current });
      setProducts(products.map(p => p._id === productId ? updated : p));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin shadow-sm"></div>
        <p className="text-slate-400 font-bold text-sm tracking-tight">Syncing inventory...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Catalog</h2>
          <p className="text-slate-400 font-bold text-sm mt-1">Manage stock and pricing for Chick Meat</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl shadow-red-600/20 transition-all flex items-center group active:scale-[0.98]"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
          Add Item
        </button>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                  {editingProductId ? 'Update item details' : 'Create a new item for your catalog'}
                </p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none"
                    placeholder="e.g. Chicken Curry Cut"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none appearance-none"
                  >
                    <option value="chicken">Chicken</option>
                    <option value="fish">Fish</option>
                    <option value="seafood">Seafood</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct({...newProduct, basePrice: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit</label>
                  <input 
                    type="text" 
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none"
                    placeholder="e.g. kg, 500g"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none h-24 resize-none"
                  placeholder="Tell customers more about this product..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-50 relative group flex items-center justify-center">
                    {newProduct.image ? (
                      <img src={newProduct.image} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-slate-300" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-red-600 animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="relative">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button 
                        type="button"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        {newProduct.image ? 'Change Image' : 'Upload Image'}
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 italic px-1 text-center">
                      Recommended: 800x800px square image
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-8 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-200"
                >
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">MRP (Original)</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">On Offer</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-10 py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-6 bg-slate-50 rounded-3xl">
                      <Tag className="h-10 w-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold text-lg tracking-tight">No products in catalog</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xs mr-4 overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 tracking-tight">{product.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{product.unit || 'per kg'}</span>
                          <button 
                            onClick={() => openEditModal(product)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 w-32 focus-within:ring-4 focus-within:ring-red-500/5 focus-within:border-red-500 transition-all">
                      <span className="text-slate-400 font-black text-xs mr-2">₹</span>
                      <input 
                        type="number" 
                        defaultValue={product.basePrice}
                        onBlur={(e) => handlePriceChange(product._id, 'basePrice', e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-black text-slate-900 w-full"
                      />
                    </div>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    <button 
                      onClick={() => toggleOffer(product._id, product.onOffer)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${product.onOffer ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                      {product.onOffer ? '🔥 Offer' : 'No Offer'}
                    </button>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    <div className={`flex items-center ${product.isAvailable ? 'text-green-600' : 'text-slate-300'}`}>
                      <div className={`h-2 w-2 rounded-full mr-2 ${product.isAvailable ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-200'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {product.isAvailable ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap text-right">
                    <button 
                      onClick={() => toggleAvailability(product._id, product.isAvailable)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${product.isAvailable ? 'bg-red-600' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${product.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
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
