import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // In production, this would:
    // 1. Test MySQL connection
    // 2. Test MongoDB connection
    // 3. Return connectivity status

    res.status(200).json({
      mysql: true,
      mongodb: true,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to check database status' })
  }
}
