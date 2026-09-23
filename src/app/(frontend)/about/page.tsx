import React from 'react';
import { Target, Users, ShieldCheck, Zap, Briefcase, Award } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand/5 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="container-custom max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Award size={16} />
            India's Trusted Job Portal
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-black tracking-tight mb-6 leading-tight">
            Connecting Talent with <span className="text-brand">Opportunity</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            RozgarX is on a mission to democratize job discovery across India. Whether you are looking for secure government roles or fast-paced private sector jobs, we bring the right opportunities directly to you.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="container-custom max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-black mb-2">10K+</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Jobs</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-black mb-2">50K+</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Candidates</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-black mb-2">1K+</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Companies</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-black mb-2">24/7</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-20 lg:py-32 px-4">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-black mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We believe that finding the right job should not be a struggle. Our platform simplifies the search process by aggregating verified government and private jobs in one easy-to-use interface.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 mt-1"><span className="text-xs font-bold">✓</span></div>
                  <span className="text-gray-700 font-medium">Verified and updated daily.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 mt-1"><span className="text-xs font-bold">✓</span></div>
                  <span className="text-gray-700 font-medium">Free forever for job seekers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 mt-1"><span className="text-xs font-bold">✓</span></div>
                  <span className="text-gray-700 font-medium">Curated career growth resources.</span>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <Target size={32} className="text-brand mb-4" />
                <h3 className="font-bold text-black mb-2">Precision</h3>
                <p className="text-sm text-gray-600">Smart algorithms to match your skills with the right employer.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sm:translate-y-8">
                <ShieldCheck size={32} className="text-brand mb-4" />
                <h3 className="font-bold text-black mb-2">Trust</h3>
                <p className="text-sm text-gray-600">Every job post is vetted to ensure maximum safety and authenticity.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <Zap size={32} className="text-brand mb-4" />
                <h3 className="font-bold text-black mb-2">Speed</h3>
                <p className="text-sm text-gray-600">Fast application process designed to respect your valuable time.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sm:translate-y-8">
                <Users size={32} className="text-brand mb-4" />
                <h3 className="font-bold text-black mb-2">Community</h3>
                <p className="text-sm text-gray-600">Join thousands of professionals growing their careers together.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand/5 py-20 px-4 border-t border-brand/10 text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <Briefcase size={48} className="text-brand mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-extrabold text-black mb-4">Ready to take the next step?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join RozgarX today and discover thousands of opportunities waiting for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/jobs" className="bg-brand text-white font-bold py-3 px-8 rounded-md hover:bg-brand-hover transition-colors">
              Explore Jobs
            </Link>
            <Link href="/contact" className="bg-white border-2 border-gray-200 text-black font-bold py-3 px-8 rounded-md hover:border-gray-300 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
