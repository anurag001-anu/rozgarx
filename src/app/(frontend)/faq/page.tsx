'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "Is RozgarX completely free to use?",
        a: "Yes! RozgarX is completely free for job seekers. You can search, browse, and save jobs without any hidden charges or subscription fees."
      },
      {
        q: "How often are the job listings updated?",
        a: "Our job listings are updated daily. We constantly monitor government portals, private companies, and top recruitment agencies to bring you the latest opportunities."
      },
      {
        q: "Do I need an account to search for jobs?",
        a: "No, you can freely browse and search for jobs without an account. However, creating an account allows you to save jobs, set up alerts, and build your professional profile."
      }
    ]
  },
  {
    category: "Applying for Jobs",
    questions: [
      {
        q: "How do I apply for a job?",
        a: "When you find a job you like, click the 'Apply' button. You will be securely redirected to the official employer's or government's website where you can complete the actual application process."
      },
      {
        q: "Does RozgarX submit my application for me?",
        a: "No. RozgarX is a job discovery platform. We connect you with the right opportunities, but the actual application process and hiring decisions are handled entirely by the external employer or government authority."
      },
      {
        q: "How can I track my job applications?",
        a: "Currently, RozgarX helps you discover and save jobs. Since applications are submitted on external websites, you should track your application status directly through the employer's official portal."
      }
    ]
  },
  {
    category: "Government & Private Jobs",
    questions: [
      {
        q: "What is the difference between Government and Private jobs on RozgarX?",
        a: "Government jobs include opportunities from state and central government departments, PSUs, and defense. Private jobs include roles in corporate, startups, and MNCs. We provide dedicated sections for both to make your search easier."
      },
      {
        q: "How do I know if a government job listing is genuine?",
        a: "We aggregate government jobs directly from official notifications and trusted employment news sources. We always provide a link to the official authority website where you can verify the notification before applying."
      }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden border-b border-gray-100 bg-brand/5">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-white blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="container-custom max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center gap-2 bg-white border border-brand/20 text-brand px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-sm">
            <HelpCircle size={16} />
            Help Center
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black tracking-tight mb-6 leading-tight">
            Frequently Asked <span className="text-brand">Questions</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Find answers to common questions about using RozgarX, finding jobs, and managing your account.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative shadow-lg shadow-gray-200/50 rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-brand text-gray-900 bg-white placeholder:text-gray-400 transition-shadow"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24 px-4">
        <div className="container-custom max-w-4xl mx-auto">
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No questions found matching your search.</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-brand font-medium hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredFaqs.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3 pb-2 border-b border-gray-100">
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((faq, qIndex) => {
                      const id = `${catIndex}-${qIndex}`;
                      const isOpen = openIndex === id;
                      
                      return (
                        <div 
                          key={qIndex} 
                          className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                            isOpen ? 'border-brand/30 bg-brand/5 shadow-md shadow-brand/5' : 'border-gray-200 bg-white hover:border-brand/30'
                          }`}
                        >
                          <button
                            onClick={() => toggleAccordion(id)}
                            className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                          >
                            <span className={`font-bold text-lg pr-4 ${isOpen ? 'text-brand' : 'text-gray-900'}`}>
                              {faq.q}
                            </span>
                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              isOpen ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </span>
                          </button>
                          
                          <div 
                            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <p className="text-gray-600 leading-relaxed pt-2 border-t border-brand/10">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Still need help? CTA */}
          <div className="mt-20 p-8 sm:p-10 bg-gray-900 text-center rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-bl-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/20 rounded-tr-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
              <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you with any queries.
              </p>
              <Link href="/contact" className="bg-brand hover:bg-brand-hover text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-brand/20">
                Contact Support
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
