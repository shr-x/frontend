'use client';

import React from 'react';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-100 selection:text-red-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-tight">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-black tracking-tighter text-xl">CHICK MEAT</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Title Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 md:p-16 space-y-12">
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black tracking-tight">1. Introduction</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Welcome to Chick Meat. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or interact with our WhatsApp automated bot and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black tracking-tight">2. The Data We Collect</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="block font-black text-slate-900 mb-1 uppercase text-[10px] tracking-widest">Identity Data</span>
                <p className="text-xs text-slate-500 font-bold">Includes first name, last name, and WhatsApp profile name.</p>
              </li>
              <li className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="block font-black text-slate-900 mb-1 uppercase text-[10px] tracking-widest">Contact Data</span>
                <p className="text-xs text-slate-500 font-bold">Includes WhatsApp phone number and delivery location coordinates.</p>
              </li>
              <li className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="block font-black text-slate-900 mb-1 uppercase text-[10px] tracking-widest">Transaction Data</span>
                <p className="text-xs text-slate-500 font-bold">Includes details about payments to and from you and other details of products you have purchased from us.</p>
              </li>
              <li className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="block font-black text-slate-900 mb-1 uppercase text-[10px] tracking-widest">Location Data</span>
                <p className="text-xs text-slate-500 font-bold">Live location shared via WhatsApp specifically for order delivery verification.</p>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black tracking-tight">3. How We Use Your Data</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="space-y-3">
              {[
                "To process and deliver your order including managing payments and fees.",
                "To manage our relationship with you which will include notifying you about changes to our terms or privacy policy.",
                "To enable you to partake in a prize draw, competition or complete a survey.",
                "To use data analytics to improve our website, products/services, marketing, customer relationships and experiences."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 text-sm font-bold">
                  <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] shrink-0 mt-0.5">{i+1}</div>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black tracking-tight">4. Data Security</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tight">5. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              If you have any questions about this privacy policy or our privacy practices, please contact us via our official WhatsApp number.
            </p>
          </section>

        </div>

        <footer className="mt-16 text-center space-y-4">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} Chick Meat. All Rights Reserved.
          </p>
          <div className="flex items-center justify-center gap-6">
             <Link href="/" className="text-[10px] font-black text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-widest">Admin Dashboard</Link>
             <span className="h-1 w-1 rounded-full bg-slate-200"></span>
             <Link href="/privacy-policy" className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Privacy Policy</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
