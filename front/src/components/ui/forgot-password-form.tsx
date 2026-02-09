"use client"

import * as React from "react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useState } from "react";

import { KeyRound, Mail } from "lucide-react";

const ForgotPasswordForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async () => {
        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const response = await fetch('https://careerback.bhaikaamdo.com/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Password reset instructions have been sent to your email.");
                setEmail("");
                // Optionally redirect after a delay
                setTimeout(() => {
                    router.push('/signin');
                }, 3000);
            } else {
                setError(data.info?.message || data.message || 'Failed to process request');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError('An error occurred while processing your request');
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white  rounded-3xl shadow-xl shadow-opacity-10 p-8 flex flex-col items-center border border-blue-100 text-black">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-opacity-5">
                <KeyRound className="w-7 h-7 text-black" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">
                Forgot Password
            </h2>
            <p className="text-gray-500 text-sm mb-6 text-center">
                Enter your email to receive password reset instructions
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                    />
                </div>

                <div className="w-full min-h-[20px]">
                    {error && (
                        <div className="text-sm text-red-500">{error}</div>
                    )}
                    {success && (
                        <div className="text-sm text-green-600">{success}</div>
                    )}
                </div>
            </div>
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                    </span>
                ) : (
                    'Send Reset Link'
                )}
            </button>
            <div className="mt-4 text-center text-sm">
                <span className="text-gray-500">Remember your password? </span>
                <Link href="/signin" className="font-semibold text-gray-900 hover:underline">
                    Sign in
                </Link>
            </div>
        </div>

    );
};

export { ForgotPasswordForm };
