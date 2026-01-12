import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // In production, this would:
    // 1. Verify JWT token
    // 2. Query MySQL for user's attendance records
    // 3. Return sorted by date

    const records = [
      { id: '1', checkIn: '09:00 AM', checkOut: '05:30 PM', date: '2024-01-12' },
      { id: '2', checkIn: '09:15 AM', checkOut: '05:45 PM', date: '2024-01-11' },
      { id: '3', checkIn: '08:50 AM', checkOut: '05:20 PM', date: '2024-01-10' }
    ]

    res.status(200).json(records)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance history' })
  }
}
