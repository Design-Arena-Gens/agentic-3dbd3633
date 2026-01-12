'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import FaceAuth from '@/components/FaceAuth'
import { motion } from 'framer-motion'

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('fittrack_token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {!showAuth ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
              FitTrack Pro
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              AI-Powered Fitness Management Platform
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Real-time posture analysis • Smart diet planning • Advanced analytics • 24/7 AI assistant
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuth(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Get Started with Face Authentication
            </motion.button>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              >
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">AI Posture Detection</h3>
                <p className="text-gray-600 dark:text-gray-400">Real-time exercise form analysis with instant feedback</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              >
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Advanced Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">Track progress with detailed charts and reports</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              >
                <div className="text-4xl mb-4">🥗</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Indian Diet Plans</h3>
                <p className="text-gray-600 dark:text-gray-400">Customized meal plans with macro tracking</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      ) : (
        <FaceAuth onSuccess={() => router.push('/dashboard')} />
      )}
    </main>
  )
}
