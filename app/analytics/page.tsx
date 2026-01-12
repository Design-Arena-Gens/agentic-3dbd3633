'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { FaArrowLeft, FaDownload, FaDatabase, FaCheckCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function AnalyticsPage() {
  const router = useRouter()
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [dbStatus, setDbStatus] = useState({ mysql: true, mongodb: true })
  const [stats, setStats] = useState({
    totalUsers: 156,
    totalWorkouts: 1247,
    avgAccuracy: 87,
    totalCalories: 45620
  })

  useEffect(() => {
    const token = localStorage.getItem('fittrack_token')
    if (!token) {
      router.push('/')
    }

    checkDatabaseStatus()
  }, [router])

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/admin/db-status')
      if (response.ok) {
        const data = await response.json()
        setDbStatus(data)
      }
    } catch (error) {
      console.log('Using demo mode')
    }
  }

  const performanceData = {
    labels: period === 'daily' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            period === 'weekly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Accuracy %',
        data: period === 'daily' ? [85, 88, 82, 90, 87, 89, 91] :
              period === 'weekly' ? [84, 86, 88, 90] :
              [80, 82, 85, 87, 88, 90],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const caloriesData = {
    labels: period === 'daily' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            period === 'weekly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Calories Burned',
        data: period === 'daily' ? [320, 280, 350, 310, 340, 360, 380] :
              period === 'weekly' ? [2100, 2300, 2450, 2600] :
              [8500, 9200, 9800, 10200, 10800, 11400],
        backgroundColor: 'rgba(249, 115, 22, 0.6)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 2
      }
    ]
  }

  const exerciseDistribution = {
    labels: ['Hand Raises', 'Sit-ups'],
    datasets: [
      {
        data: [58, 42],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#6b7280'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        }
      }
    }
  }

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      period,
      stats,
      performanceData,
      caloriesData
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fitness-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                <FaArrowLeft /> Back
              </button>
            </Link>
            <h1 className="text-2xl font-bold dark:text-white">Analytics Dashboard</h1>
          </div>

          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FaDownload /> Export Report
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Database Status</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaDatabase className="text-blue-500" />
                  <span className="dark:text-white">MySQL (Attendance)</span>
                </div>
                {dbStatus.mysql ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <span className="text-red-500">Disconnected</span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaDatabase className="text-green-500" />
                  <span className="dark:text-white">MongoDB (Analytics)</span>
                </div>
                {dbStatus.mongodb ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <span className="text-red-500">Disconnected</span>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
              <p className="text-3xl font-bold dark:text-white">{stats.totalUsers}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Workouts</p>
              <p className="text-3xl font-bold dark:text-white">{stats.totalWorkouts}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avg Accuracy</p>
              <p className="text-3xl font-bold dark:text-white">{stats.avgAccuracy}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Calories</p>
              <p className="text-3xl font-bold dark:text-white">{stats.totalCalories.toLocaleString()}</p>
            </motion.div>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                period === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4 dark:text-white">Accuracy Trends</h3>
            <div style={{ height: '300px' }}>
              <Line data={performanceData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4 dark:text-white">Calories Burned</h3>
            <div style={{ height: '300px' }}>
              <Bar data={caloriesData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4 dark:text-white">Exercise Distribution</h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={exerciseDistribution} options={{ ...chartOptions, maintainAspectRatio: false }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4 dark:text-white">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { exercise: 'Hand Raises', reps: 25, accuracy: 92, time: '2 hours ago' },
                { exercise: 'Sit-ups', reps: 30, accuracy: 88, time: '5 hours ago' },
                { exercise: 'Hand Raises', reps: 20, accuracy: 85, time: '1 day ago' },
                { exercise: 'Sit-ups', reps: 28, accuracy: 90, time: '1 day ago' }
              ].map((activity, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold dark:text-white">{activity.exercise}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="dark:text-gray-300">Reps: {activity.reps}</span>
                    <span className="dark:text-gray-300">Accuracy: {activity.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
