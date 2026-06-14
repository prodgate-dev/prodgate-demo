import { Router } from 'express'

const router = Router()

// Public routes, no auth required
router.post('/login', (req, res) => {
  res.json({ token: 'jwt-token-here' })
})

router.post('/register', (req, res) => {
  res.json({ message: 'User created' })
})

router.post('/forgot-password', (req, res) => {
  res.json({ message: 'Reset email sent' })
})

export default router