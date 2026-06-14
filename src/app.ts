import { requireAuth, requireAdmin } from './middleware/auth'
import express from 'express'
import authRouter from './routes/auth'
import usersRouter from './routes/users'
import adminRouter from './routes/admin'

const app = express()

app.use(express.json())

// Public routes
app.use('/auth', authRouter)

// Authenticated routes
app.use('/users', usersRouter)

// Admin routes: require auth AND admin role at router level
app.use('/admin', requireAuth, requireAdmin, adminRouter)

export default app