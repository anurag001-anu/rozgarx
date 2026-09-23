"use client";

import Link from "next/link";
import { Sparkles, Mail, Lock, User, Briefcase, AlertCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { registerAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      if (state.user?.role === 'employer') {
        router.push('/employer');
      } else {
        router.push('/jobs');
      }
    }
  }, [state, router]);

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-5 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles size={16} /> Join RozgarX
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-brand hover:text-brand-hover">
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium text-red-800">{state.error}</p>
            </div>
          )}

          <form className="space-y-6" action={formAction}>
            
            {/* Account Type Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input type="radio" name="role" value="jobseeker" className="peer sr-only" defaultChecked />
                  <div className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50 peer-checked:border-brand peer-checked:bg-brand/5 peer-checked:ring-1 peer-checked:ring-brand text-center transition-all">
                    <User className="mx-auto mb-2 text-gray-400 peer-checked:text-brand" size={24} />
                    <span className="block text-sm font-bold text-gray-900">Job Seeker</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="role" value="employer" className="peer sr-only" />
                  <div className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50 peer-checked:border-brand peer-checked:bg-brand/5 peer-checked:ring-1 peer-checked:ring-brand text-center transition-all">
                    <Briefcase className="mx-auto mb-2 text-gray-400 peer-checked:text-brand" size={24} />
                    <span className="block text-sm font-bold text-gray-900">Employer</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand hover:bg-brand-hover focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
