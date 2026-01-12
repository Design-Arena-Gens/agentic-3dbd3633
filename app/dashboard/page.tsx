'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'
import { FaSun, FaMoon, FaDumbbell, FaChartLine, FaUtensils, FaQrcode, FaSignOutAlt, FaUserCircle, FaCalendarCheck } from 'react-icons/fa'

export default function Dashboard() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    workoutsToday: 0,
    caloriesBurned: 0,
    avgAccuracy: 0,
    streak: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('fittrack_token')
    if (!token) {
      router.push('/')
      return
    }

    const userData = localStorage.getItem('fittrack_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics/user-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        // Use demo data
        setStats({
          workoutsToday: 2,
          caloriesBurned: 320,
          avgAccuracy: 87,
          streak: 5
        })
      }
    }

    fetchStats()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('fittrack_token')
    localStorage.removeItem('fittrack_user')
    router.push('/')
  }

  const cards = [
    {
      title: 'Start Workout',
      description: 'AI-powered posture detection',
      icon: FaDumbbell,
      href: '/workout',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Progress Analytics',
      description: 'Track your fitness journey',
      icon: FaChartLine,
      href: '/analytics',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Diet Plans',
      description: 'Indian meal plans & macros',
      icon: FaUtensils,
      href: '/diet',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Attendance',
      description: 'QR check-in/check-out',
      icon: FaQrcode,
      href: '/attendance',
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <FaDumbbell className="text-blue-500 text-2xl" />
              <h1 className="text-2xl font-bold gradient-text">FitTrack Pro</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                {theme === 'light' ? <FaMoon className="text-gray-700" /> : <FaSun className="text-yellow-400" />}
              </button>

              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{user?.username || 'User'}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2 dark:text-white">Welcome back, {user?.username || 'User'}!</h2>
          <p className="text-gray-600 dark:text-gray-400">Let's crush your fitness goals today</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Workouts Today</p>
                <p className="text-3xl font-bold mt-1 dark:text-white">{stats.workoutsToday}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FaDumbbell className="text-blue-500 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Calories Burned</p>
                <p className="text-3xl font-bold mt-1 dark:text-white">{stats.caloriesBurned}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-orange-500 text-2xl">🔥</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Avg Accuracy</p>
                <p className="text-3xl font-bold mt-1 dark:text-white">{stats.avgAccuracy}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-green-500 text-2xl">🎯</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Day Streak</p>
                <p className="text-3xl font-bold mt-1 dark:text-white">{stats.streak}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <FaCalendarCheck className="text-purple-500 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <Link href={card.href}>
                <div className="card-hover bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md cursor-pointer h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-full flex items-center justify-center mb-4`}>
                    <card.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{card.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
