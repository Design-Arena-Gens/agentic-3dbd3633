import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, email } = req.body

  try {
    // In production, this would:
    // 1. Connect to MySQL
    // 2. Hash password with bcrypt
    // 3. Store user in database
    // 4. Generate JWT token

    const user = {
      id: `user_${Date.now()}`,
      username,
      email,
      createdAt: new Date().toISOString()
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id, username })).toString('base64')

    res.status(201).json({
      success: true,
      user,
      token
    })
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' })
  }
}
