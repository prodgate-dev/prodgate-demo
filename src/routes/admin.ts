import { Router } from 'express'

const router = Router()

// Auth and admin checks are applied once at the mount point in app.ts,
// so these handlers do not repeat the guards.
router.get('/users', (req, res) => {
  res.json({ users: [] })
})

router.post('/users', (req, res) => {
  res.json({ message: 'User created' })
})

router.delete('/users/:id', (req, res) => {
  res.json({ message: 'User deleted' })
})

router.get('/audit-logs', (req, res) => {
  res.json({ logs: [] })
})

router.post('/impersonate/:userId', (req, res) => {
  res.json({ message: 'Impersonating user' })
})

export default router
