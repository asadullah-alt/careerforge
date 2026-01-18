"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export const WaitingList = () => {
    return (
        <div className="w-full max-w-md bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl shadow-opacity-10 p-10 flex flex-col items-center border border-blue-100 text-black">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-8 shadow-inner"
            >
                <CheckCircle2 className="w-10 h-10 text-green-500" />
            </motion.div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900"
            >
                You're on the list!
            </motion.h2>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-center mb-10 leading-relaxed"
            >
                Welcome to the future of career growth. We've added you to our exclusive waiting list. We'll notify you as soon as a spot opens up.
            </motion.p>

            <div className="w-full space-y-4 mb-8">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-50 shadow-sm"
                >
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">Current Status</p>
                        <p className="text-xs text-gray-500">In Queue (Early Access)</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-50 shadow-sm"
                >
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">Next Step</p>
                        <p className="text-xs text-gray-500">Watch your inbox for an invite</p>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full"
            >
                <Link
                    href="/"
                    className="w-full group flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98]"
                >
                    Back to Homepage
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-xs text-gray-400"
            >
                Follow us for updates and early access tips.
            </motion.p>
        </div>
    )
}
