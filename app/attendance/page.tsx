'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { Html5Qrcode } from 'html5-qrcode'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaQrcode, FaClock, FaCheck } from 'react-icons/fa'

interface AttendanceRecord {
  id: string
  checkIn: string
  checkOut?: string
  date: string
}

export default function AttendancePage() {
  const [mode, setMode] = useState<'checkin' | 'checkout' | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<'checked-out' | 'checked-in'>('checked-out')
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null)

  useEffect(() => {
    fetchAttendanceRecords()
    checkCurrentStatus()
  }, [])

  const fetchAttendanceRecords = async () => {
    try {
      const token = localStorage.getItem('fittrack_token')
      const response = await fetch('/api/attendance/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      }
    } catch (error) {
      // Demo data
      setRecords([
        { id: '1', checkIn: '09:00 AM', checkOut: '05:30 PM', date: '2024-01-12' },
        { id: '2', checkIn: '09:15 AM', checkOut: '05:45 PM', date: '2024-01-11' },
        { id: '3', checkIn: '08:50 AM', checkOut: '05:20 PM', date: '2024-01-10' }
      ])
    }
  }

  const checkCurrentStatus = async () => {
    try {
      const token = localStorage.getItem('fittrack_token')
      const response = await fetch('/api/attendance/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentStatus(data.status)
      }
    } catch (error) {
      console.log('Using default status')
    }
  }

  const generateQR = async (type: 'checkin' | 'checkout') => {
    const user = JSON.parse(localStorage.getItem('fittrack_user') || '{}')
    const qrData = {
      userId: user.id,
      username: user.username,
      type,
      timestamp: new Date().toISOString()
    }

    try {
      const url = await QRCode.toDataURL(JSON.stringify(qrData))
      setQrDataUrl(url)
      setMode(type)
    } catch (error) {
      console.error('QR generation failed:', error)
    }
  }

  const startScanning = async (type: 'checkin' | 'checkout') => {
    setMode(type)
    setScanning(true)

    try {
      const html5QrCode = new Html5Qrcode('qr-reader')
      setScanner(html5QrCode)

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
          await handleScan(decodedText, type)
          html5QrCode.stop()
          setScanning(false)
        },
        (error) => {
          // Scan error - ignore
        }
      )
    } catch (error) {
      console.error('Scanner error:', error)
      setScanning(false)
    }
  }

  const handleScan = async (data: string, type: 'checkin' | 'checkout') => {
    try {
      const qrData = JSON.parse(data)
      const token = localStorage.getItem('fittrack_token')

      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...qrData, type })
      })

      if (response.ok) {
        setCurrentStatus(type === 'checkin' ? 'checked-in' : 'checked-out')
        fetchAttendanceRecords()
        alert(`${type === 'checkin' ? 'Check-in' : 'Check-out'} successful!`)
      }
    } catch (error) {
      // Demo mode
      setCurrentStatus(type === 'checkin' ? 'checked-in' : 'checked-out')
      alert(`${type === 'checkin' ? 'Check-in' : 'Check-out'} successful! (Demo mode)`)
    }

    setMode(null)
    setScanning(false)
  }

  const stopScanning = () => {
    if (scanner) {
      scanner.stop()
      setScanning(false)
      setMode(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
              <FaArrowLeft /> Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold dark:text-white">QR Attendance System</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className={`p-6 rounded-xl shadow-lg ${currentStatus === 'checked-in' ? 'bg-green-100 dark:bg-green-900' : 'bg-orange-100 dark:bg-orange-900'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Current Status</p>
                <p className={`text-2xl font-bold ${currentStatus === 'checked-in' ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                  {currentStatus === 'checked-in' ? 'Checked In' : 'Checked Out'}
                </p>
              </div>
              <FaCheck className={`text-4xl ${currentStatus === 'checked-in' ? 'text-green-500' : 'text-orange-500'}`} />
            </div>
          </div>
        </div>

        {!mode ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
            >
              <div className="text-center mb-6">
                <FaClock className="text-6xl text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 dark:text-white">Check In</h2>
                <p className="text-gray-600 dark:text-gray-400">Mark your arrival</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => generateQR('checkin')}
                  disabled={currentStatus === 'checked-in'}
                  className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Check-in QR
                </button>
                <button
                  onClick={() => startScanning('checkin')}
                  disabled={currentStatus === 'checked-in'}
                  className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Scan Check-in QR
                </button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
            >
              <div className="text-center mb-6">
                <FaClock className="text-6xl text-orange-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 dark:text-white">Check Out</h2>
                <p className="text-gray-600 dark:text-gray-400">Mark your departure</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => generateQR('checkout')}
                  disabled={currentStatus === 'checked-out'}
                  className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Check-out QR
                </button>
                <button
                  onClick={() => startScanning('checkout')}
                  disabled={currentStatus === 'checked-out'}
                  className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Scan Check-out QR
                </button>
              </div>
            </motion.div>
          </div>
        ) : scanning ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Scanning for {mode === 'checkin' ? 'Check-in' : 'Check-out'}
            </h2>
            <div id="qr-reader" className="mx-auto max-w-md"></div>
            <button
              onClick={stopScanning}
              className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
            >
              Cancel Scanning
            </button>
          </div>
        ) : qrDataUrl ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              {mode === 'checkin' ? 'Check-in' : 'Check-out'} QR Code
            </h2>
            <img src={qrDataUrl} alt="QR Code" className="mx-auto mb-6 border-4 border-gray-200 dark:border-gray-700 rounded-lg" />
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Scan this QR code to mark your {mode === 'checkin' ? 'check-in' : 'check-out'}
            </p>
            <button
              onClick={() => {
                setQrDataUrl('')
                setMode(null)
              }}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        ) : null}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Attendance History</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 dark:text-gray-300">Check In</th>
                  <th className="text-left py-3 px-4 dark:text-gray-300">Check Out</th>
                  <th className="text-left py-3 px-4 dark:text-gray-300">Duration</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const checkIn = new Date(`2000-01-01 ${record.checkIn}`)
                  const checkOut = record.checkOut ? new Date(`2000-01-01 ${record.checkOut}`) : null
                  const duration = checkOut ? Math.round((checkOut.getTime() - checkIn.getTime()) / 1000 / 60 / 60 * 10) / 10 : 0

                  return (
                    <tr key={record.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 dark:text-gray-300">{record.date}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{record.checkIn}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{record.checkOut || '-'}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{duration ? `${duration}h` : '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
