"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Download, FileUp, Sparkles, ArrowRight, Chrome } from 'lucide-react'
import { useTheme } from 'next-themes'

export function EmptyJobsState() {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div className="flex items-center justify-center min-h-[600px] px-4 py-12">
            <div className="max-w-4xl w-full">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.34, 1.56, 0.64, 1]
                        }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-6 shadow-lg"
                    >
                        <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>

                    <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r ${isDark ? 'from-gray-100 to-gray-400' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
                        No Jobs Saved Yet
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                        Get started in 3 easy steps to streamline your job application process
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="space-y-6">
                    {/* Step 1: Download Extension */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="group relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl transition-all group-hover:blur-2xl" />
                        <div className={`relative ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-200`}>
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <motion.div
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        1
                                    </motion.div>
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-xl font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                                        <Chrome className="w-5 h-5 text-blue-600" />
                                        Download the Chrome Extension
                                    </h3>
                                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                        Install our powerful browser extension to start tracking and analyzing job postings
                                    </p>
                                    <a
                                        href="https://chromewebstore.google.com/detail/bhaikaamdo-streamline-you/cfhjopkjaegoadmcfmepdbnmkikkpjjk"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg group/btn"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Extension
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 2: Upload Resume */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="group relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl transition-all group-hover:blur-2xl" />
                        <div className={`relative ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:border-purple-200`}>
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <motion.div
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        2
                                    </motion.div>
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-xl font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                                        <FileUp className="w-5 h-5 text-purple-600" />
                                        Upload or Create Your Resume
                                    </h3>
                                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                        Upload your existing resume, create a new one, or import your LinkedIn profile using the extension
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                            Upload Resume
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                            Create New
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                            Import LinkedIn
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 3: Start Saving Jobs */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="group relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-2xl blur-xl transition-all group-hover:blur-2xl" />
                        <div className={`relative ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:border-pink-200`}>
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <motion.div
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        3
                                    </motion.div>
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-xl font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                                        <Sparkles className="w-5 h-5 text-pink-600" />
                                        Save & Analyze Job Postings
                                    </h3>
                                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                        Visit any job posting website, use the extension to save applications, analyze your resume match, and get AI-powered improvement suggestions
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                                            Save job applications
                                        </div>
                                        <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                                            Analyze resume match
                                        </div>
                                        <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                                            Get AI suggestions
                                        </div>
                                        <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                                            Improve your resume
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-12 text-center"
                >
                    <div className={`inline-flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <motion.div
                            animate={{
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >

                        </motion.div>
                        <span>Start building your perfect job application strategy today</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}