import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand/5 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="container-custom max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-bold mb-6">
            <MessageSquare size={16} />
            We're Here to Help
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black tracking-tight mb-6 leading-tight">
            Get in <span className="text-brand">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have a question about a job posting? Need help with your profile? Or just want to say hi? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24 px-4 bg-gray-50/50">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            
            {/* Contact Information Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">Contact Information</h2>
                <p className="text-gray-500 mb-8">Reach out to us directly through any of these channels.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-black mb-1">Email Us</h3>
                  <p className="text-gray-500 text-sm mb-2">For general support and inquiries.</p>
                  <a href="mailto:support@rozgarx.com" className="text-brand font-medium hover:underline">support@rozgarx.com</a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-black mb-1">Call Us</h3>
                  <p className="text-gray-500 text-sm mb-2">Mon-Fri from 9am to 6pm.</p>
                  <a href="tel:+911234567890" className="text-black font-medium hover:text-brand transition-colors">+91 12345 67890</a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-black mb-1">Office</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    123 Innovation Drive,<br />
                    Tech Park, Sector 45,<br />
                    New Delhi, India 110001
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white p-8 lg:p-10 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-[100px] pointer-events-none"></div>
                
                <h3 className="text-2xl font-bold text-black mb-6">Send us a message</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">First Name</label>
                      <input type="text" placeholder="John" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Last Name</label>
                      <input type="text" placeholder="Doe" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Subject</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-gray-700">
                      <option>General Inquiry</option>
                      <option>Help with my profile</option>
                      <option>Report an issue</option>
                      <option>Partnership opportunities</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Message</label>
                    <textarea rows={5} placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all resize-none"></textarea>
                  </div>

                  <button type="button" className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-md shadow-brand/20">
                    <Send size={18} /> Send Message
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-4">By submitting this form, you agree to our privacy policy.</p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
