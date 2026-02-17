"use client"

import * as React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useState } from "react";

import { LogIn, Lock, Mail } from "lucide-react";
import { authApi } from '@/lib/api';

const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const data = await authApi.login(email, password);
      console.log(data)
      if (data.token) {
        // Store token in cookie with proper expiration based on remember me
        const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days : 24 hours
        // Remove existing cookie if present
        document.cookie = 'cf_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = `cf_auth=${data.token}; path=/; max-age=${maxAge}`;
        router.push('/dashboard');
      } else {
        setError('An unexpected response was received.');
      }
    } catch (err) {
      console.error('Signin error:', err);
      setError('An error occurred while signing in');
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email and password on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
    if (rememberedPassword) {
      setPassword(rememberedPassword);
    }
  }, []);

  return (

    <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white  rounded-3xl shadow-xl shadow-opacity-10 p-8 flex flex-col items-center border border-blue-100 text-black">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-opacity-5">
        <LogIn className="w-7 h-7 text-black" />
      </div>
      <h2 className="text-2xl font-semibold mb-2 text-center">
        Sign In
      </h2>
      <p className="text-gray-500 text-sm mb-6 text-center">
        Welcome back to Bhai Kaam Do
      </p>
      <div className="w-full flex flex-col gap-3 mb-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail className="w-4 h-4" />
          </span>
          <input
            placeholder="Email"
            type="email"
            value={email}
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock className="w-4 h-4" />
          </span>
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="remember-me" className="text-sm text-gray-600">
            Remember me
          </label>
        </div>

        <div className="w-full flex justify-between items-center">
          {error && (
            <div className="text-sm text-red-500 flex-1">{error}</div>
          )}
          <Link href="/forgot-password" className="text-xs hover:underline font-medium ml-2">
            Forgot password?
          </Link>
        </div>
      </div>
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing In...
          </span>
        ) : (
          'Sign In'
        )}
      </button>
      <div className="flex items-center w-full my-2">
        <div className="flex-grow border-t border-dashed border-gray-200"></div>
        <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
        <div className="flex-grow border-t border-dashed border-gray-200"></div>
      </div>
      <div className="flex gap-3 w-full justify-center mt-2">
        <button
          type="button"
          onClick={() => (window.location.href = authApi.getGoogleAuthUrl())}
          className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow"
        >
          <Image
            src="/google-color.svg"
            alt="Google"
            className="w-6 h-6"
            width={24}
            height={24}
          />
        </button>
      </div>
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">Don&apos;t have an account? </span>
        <Link href="/signup" className="font-semibold text-gray-900 hover:underline">
          Sign up
        </Link>
      </div>
    </div>

  );
};

export { SignInForm };
