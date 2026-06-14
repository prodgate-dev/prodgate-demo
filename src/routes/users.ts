import { Router } from 'express'
import { requireAuth } from '../middleware/auth'

const router = Router()

// All user routes require authentication
router.get('/profile', requireAuth, (req, res) => {
  res.json({ user: 'profile data' })
})

router.put('/profile', requireAuth, (req, res) => {
  res.json({ message: 'Profile updated' })
})

router.get('/settings', requireAuth, (req, res) => {
  res.json({ settings: 'user settings' })
})

router.delete('/account', requireAuth, (req, res) => {
  res.json({ message: 'Account deleted' })
})

export default router