'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function DemoPaymentPage() {
  const { orderId } = useParams();
  const [status, setStatus] = useState('Processing payment...');

  useEffect(() => {
    if (orderId) {
      axios.post(`/api/payment/callback`, { 
        orderId,
        paymentId: `demo_${Date.now()}`,
        status: 'success'
      })
      .then(() => {
        setStatus('Payment successful! You can close this window.');
      })
      .catch(() => {
        setStatus('Payment failed. Please try again.');
      });
    }
  }, [orderId]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Demo Payment</h1>
        <p className="text-center text-gray-600">{status}</p>
      </div>
    </div>
  );
}
