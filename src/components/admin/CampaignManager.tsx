'use client';

import React, { useState } from 'react';
import { createCampaign, uploadImage, API_BASE_URL } from '@/lib/api';
import { Megaphone, Send, Image as ImageIcon, Sparkles, Loader2, X } from 'lucide-react';

export function CampaignManager() {
  const [campaignMessage, setCampaignMessage] = useState('');
  const [campaignImage, setCampaignImage] = useState('');
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { filePath } = await uploadImage(file);
      const fullUrl = `${API_BASE_URL}${filePath}`;
      setCampaignImage(fullUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendCampaign = async () => {
    if (!campaignMessage.trim()) return;
    setIsSendingCampaign(true);
    try {
      await createCampaign({ 
        message: campaignMessage, 
        name: 'Broadcast', 
        type: 'text',
        image: campaignImage || undefined
      });
      alert('Campaign sent successfully! 🚀');
      setCampaignMessage('');
      setCampaignImage('');
    } catch (error) {
      alert('Failed to send campaign');
    } finally {
      setIsSendingCampaign(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/20">
        <div className="flex items-center gap-5 mb-10">
          <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100/50 shrink-0">
            <Megaphone className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Broadcast Center</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">WhatsApp Marketing</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="h-3 w-3" /> Campaign Image (Optional)
              </label>
              {campaignImage && (
                <button 
                  onClick={() => setCampaignImage('')}
                  className="text-[10px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <X className="h-2.5 w-2.5" /> Remove
                </button>
              )}
            </div>
            
            <div className="flex gap-4 items-center">
              {campaignImage ? (
                <div className="h-20 w-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                  <img src={campaignImage} alt="Campaign" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-20 w-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 text-red-600 animate-spin" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-slate-300" />
                  )}
                </div>
              )}
              
              <div className="flex-1 relative">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isUploading}
                />
                <div className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-400 font-medium text-xs flex items-center justify-between">
                  <span>{isUploading ? 'Uploading...' : campaignImage ? 'Change Image' : 'Select Image File'}</span>
                  {!isUploading && <Sparkles className="h-3 w-3 text-red-400" />}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Message Content</label>
              <span className="text-[10px] font-bold text-slate-300 italic">Supports emojis ✨</span>
            </div>
            <textarea 
              className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all outline-none h-44 resize-none placeholder:text-slate-300"
              placeholder="E.g. Fresh Chicken Drumsticks at 20% off today! 🍗"
              value={campaignMessage}
              onChange={(e) => setCampaignMessage(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleSendCampaign}
            disabled={isSendingCampaign || !campaignMessage.trim()}
            className="w-full bg-slate-900 hover:bg-red-600 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black py-5 rounded-[1.25rem] transition-all flex items-center justify-center group relative overflow-hidden shadow-lg shadow-slate-200"
          >
            {isSendingCampaign ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="h-4 w-4 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                Launch to All Customers
              </>
            )}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-3 px-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Ready for <span className="text-slate-900 font-black text-[11px]">Instant Delivery</span>
          </p>
        </div>
      </div>
    </div>
  );
}
