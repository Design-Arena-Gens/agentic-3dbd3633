import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username } = req.body

  try {
    // In production, this would:
    // 1. Query MySQL for user
    // 2. Verify password with bcrypt
    // 3. Generate JWT token

    const user = {
      id: `user_${Date.now()}`,
      username
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id, username })).toString('base64')

    res.status(200).json({
      success: true,
      user,
      token
    })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
}
