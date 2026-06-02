import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jagoai_school_neural_secret_key_2026';

export interface AuthenticatedRequest extends Request {
  userId?: number;
  userRole?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // Asynchronously update user's last_active_at without blocking the response
    pool.query('UPDATE users SET last_active_at = NOW() WHERE id = ?', [decoded.id])
      .catch((err: any) => console.error('Failed to update last_active_at:', err));

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Access token has expired or is invalid' });
  }
};
