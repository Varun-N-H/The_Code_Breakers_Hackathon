import { Request, Response, NextFunction } from 'express';
import { authService, JWTPayload } from '../services/authService';
import { asyncHandler, AppError } from './errorHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw new AppError('Access token required', 401);
  }

  const payload = await authService.verifyToken(token);
  
  if (!payload) {
    throw new AppError('Invalid or expired token', 401);
  }

  req.user = payload;
  next();
});

export const requireAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }
  next();
});
