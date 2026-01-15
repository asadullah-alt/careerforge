"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Download, FileUp, Sparkles, ArrowRight, Chrome } from 'lucide-react'
import { useTheme } from 'next-themes'

export function EmptyJobsState() {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    // Enhanced animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
                when: "beforeChildren" as const
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15,
                mass: 0.8
            }
        }
    }

    const heroVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 120,
                damping: 20,
                mass: 1
            }
        }
    }

    const shimmerVariants = {
        initial: { x: '-100%' },
        animate: {
            x: '100%',
            transition: {
                repeat: Infinity,
                duration: 2,
                ease: "linear" as const,
                repeatDelay: 3
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[600px] px-4 py-12">
            <motion.div
                className="max-w-4xl w-full"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Hero Section */}
                <motion.div
                    variants={heroVariants}
                    className="text-center mb-12 relative"
                >
                    <motion.h2
                        className={`text-3xl font-bold mb-3 bg-gradient-to-r ${isDark ? 'from-gray-100 to-gray-400' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent relative inline-block`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        No Jobs Saved Yet
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            style={{ overflow: 'hidden' }}
                        />
                    </motion.h2>
                    <motion.p
                        className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Get started in 3 easy steps to streamline your job application process
                    </motion.p>
                </motion.div>

                {/* Steps */}
                <div className="space-y-6">
                    {/* Step 1: Download Extension */}
                    <motion.div
                        variants={itemVariants}
                        className="group relative"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Animated glow effect */}
                        <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-blue-500/20 to-purple-500/20' : 'from-blue-500/10 to-purple-500/10'} rounded-2xl blur-xl transition-all`}
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <div className={`relative ${isDark ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' : 'bg-white border-gray-100'} border-2 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-blue-300 ${isDark ? 'hover:border-blue-500' : ''}`}>
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <motion.div
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg relative overflow-hidden"
                                        whileHover={{ scale: 1.15, rotate: 360 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                            animate={{
                                                x: ['-100%', '100%']
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 1
                                            }}
                                        />
                                        <span className="relative z-10">1</span>
                                    </motion.div>
                                </div>
                                <div className="flex-1">
                                    <motion.h3
                                        className={`text-xl font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Chrome className="w-5 h-5 text-blue-600" />
                                        Download the Chrome Extension
                                    </motion.h3>
                                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                        Install our powerful browser extension to start tracking and analyzing job postings
                                    </p>
                                    <motion.a
                                        href="https://chromewebstore.google.com/detail/bhaikaamdo-streamline-you/cfhjopkjaegoadmcfmepdbnmkikkpjjk"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-xl group/btn relative overflow-hidden"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <Download className="w-4 h-4 relative z-10" />
                                        <span className="relative z-10">Download Extension</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                                    </motion.a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 2: Upload Resume */}
                    <motion.div
                        variants={itemVariants}
                        className="group relative"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Animated glow effect */}
                        <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-purple-500/20 to-pink-500/20' : 'from-purple-500/10 to-pink-500/10'} rounded-2xl blur-xl transition-all`}
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                        />
                        <div className={`relative ${isDark ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' : 'bg-white border-gray-100'} border-2 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-purple-300 ${isDark ? 'hover:border-purple-500' : ''}`}>
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <motion.div
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg relative overflow-hidden"
                                        whileHover={{ scale: 1.15, rotate: -360 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                            animate={{
                                                x: ['-100%', '100%']
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 1,
                                                delay: 0.5
                                            }}
                                        />
                                        <span className="relative z-10">2</span>
                                    </motion.div>
                                </div>
                                <div className="flex-1">
                                    <motion.h3
                                        className={`text-xl font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <FileUp className="w-5 h-5 text-purple-600" />
                                        Upload or Create Your Resume
                                    </motion.h3>
                                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                        Upload your existing resume, create a new one, or import your LinkedIn profile using the extension
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {['Upload Resume', 'Create New', 'Import LinkedIn'].map((text, index) => (
                                            <motion.div
                                                key={text}
                                                className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700'} rounded-lg text-sm font-medium`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.6 + index * 0.1 }}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                            >
                                                <motion.span
                                                    className="w-2 h-2 bg-purple-500 rounded-full"
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [1, 0.7, 1]
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        delay: index * 0.2
                                                    }}
                                                />
                                                {text}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 3: Start Saving Jobs */}
                    <motion.div
                        variants={itemVariants}
                        className="group relative"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Animated glow effect */}
                        <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-pink-500/20 to-orange-500/20' : 'from-pink-500/10 to-orange-500/10'} rounded-2xl blur-xl transition-all`}
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                        />
                        <div className={`relative ${isDark ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' : 'bg-white border-gray-100'} border-2 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-pink-300 ${isDark ? 'hover:border-pink-500' : ''}`}>
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <motion.div
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg relative overflow-hidden"
                                        whileHover={{ scale: 1.15, rotate: 360 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                            animate={{
                                                x: ['-100%', '100%']
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 1,
                                                delay: 1
                                            }}
                                        />
                                        <span className="relative z-10">3</span>
                                    </motion.div>
                                </div>
                                <div className="flex-1">
                                    <motion.h3
                                        className={`text-xl font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Sparkles className="w-5 h-5 text-pink-600" />
                                        Save & Analyze Job Postings
                                    </motion.h3>
                                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                        Visit any job posting website, use the extension to save applications, analyze your resume match, and get AI-powered improvement suggestions
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {[
                                            'Save job applications',
                                            'Analyze resume match',
                                            'Get AI suggestions',
                                            'Improve your resume'
                                        ].map((text, index) => (
                                            <motion.div
                                                key={text}
                                                className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8 + index * 0.1 }}
                                                whileHover={{ x: 5 }}
                                            >
                                                <motion.div
                                                    className="w-1.5 h-1.5 bg-pink-500 rounded-full"
                                                    animate={{
                                                        scale: [1, 1.3, 1],
                                                        opacity: [1, 0.6, 1]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: index * 0.3
                                                    }}
                                                />
                                                {text}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                    className="mt-12 text-center"
                >
                    <motion.div
                        className={`inline-flex items-center gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-blue-500" />
                        </motion.div>
                        <span>Start building your perfect job application strategy today</span>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}