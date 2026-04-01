'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            {/* Analytics charts and stats will go here */}
          </div>
        </main>
      </div>
    </div>
  );
}
