import { Request, Response, NextFunction } from 'express'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const role = req.headers['x-user-role']
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export function requireSuperuser(req: Request, res: Response, next: NextFunction) {
  const role = req.headers['x-user-role']
  if (role !== 'superuser') {
    return res.status(403).json({ error: 'Superuser access required' })
  }
  next()
}