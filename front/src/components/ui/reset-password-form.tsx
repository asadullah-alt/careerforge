"use client"

import * as React from "react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useState } from "react";

import { Lock, Check, AlertCircle } from "lucide-react";
import { authApi } from '@/lib/api';

const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: 'At least 8 characters', regex: /.{8,}/ },
  { id: 'lowercase', label: 'One lowercase letter', regex: /[a-z]/ },
  { id: 'uppercase', label: 'One uppercase letter', regex: /[A-Z]/ },
  { id: 'number', label: 'One number', regex: /\d/ },
  { id: 'special', label: 'One special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
];

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const checkPasswordRequirement = (requirement: { regex: RegExp }) => {
    return requirement.regex.test(newPassword);
  };

  const allPasswordRequirementsMet = () => {
    return PASSWORD_REQUIREMENTS.every(checkPasswordRequirement);
  };

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (!allPasswordRequirementsMet()) {
      setError("Please meet all password requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await authApi.resetPassword(token, newPassword);
      setSuccess("Password reset successfully! Redirecting to sign in...");
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      // @ts-expect-error - backend error response shape
      setError(err.body?.message || 'An error occurred during password reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white  rounded-3xl shadow-xl shadow-opacity-10 p-8 flex flex-col items-center border border-blue-100 text-black">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-opacity-5">
        <Lock className="w-7 h-7 text-black" />
      </div>
      <h2 className="text-2xl font-semibold mb-2 text-center">
        Reset Password
      </h2>
      <p className="text-gray-500 text-sm mb-6 text-center">
        Enter your new password below
      </p>
      <div className="w-full flex flex-col gap-3 mb-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock className="w-4 h-4" />
          </span>
          <input
            placeholder="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
            onChange={(e) => setNewPassword(e.target.value)}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
          >
            {showNewPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Password requirements */}
        {passwordFocus && (
          <div className="text-xs space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="font-medium text-gray-700 mb-1">Password requirements:</p>
            {PASSWORD_REQUIREMENTS.map((req) => (
              <div key={req.id} className="flex items-center gap-2">
                {checkPasswordRequirement(req) ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-gray-300" />
                )}
                <span className={checkPasswordRequirement(req) ? "text-green-600" : "text-gray-500"}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock className="w-4 h-4" />
          </span>
          <input
            placeholder="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
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
            Resetting Password...
          </span>
        ) : (
          'Reset Password'
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

export { ResetPasswordForm };
