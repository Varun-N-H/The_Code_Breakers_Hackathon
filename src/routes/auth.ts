import { Router, Request, Response } from 'express';
import { authService, LoginCredentials, AuthResult } from '../services/authService';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    created_at?: string;
    last_login?: string;
  };
  message?: string;
}

// POST /api/auth/login - Admin login
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const credentials: LoginCredentials = { email, password };
  const result: AuthResult = await authService.login(credentials);

  if (!result.success) {
    return res.status(401).json({
      success: false,
      message: result.message || 'Login failed'
    });
  }

  const response: LoginResponse = {
    success: true,
    token: result.token,
    user: result.user
  };

  res.json(response);
}));

// POST /api/auth/verify - Verify JWT token
router.post('/verify', asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Token is required', 400);
  }

  const payload = await authService.verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  res.json({
    success: true,
    data: {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    }
  });
}));

// POST /api/auth/setup - Create initial admin user (for setup)
router.post('/setup', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  const result = await authService.createAdminUser(email, password);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message || 'Failed to create admin user'
    });
  }

  res.status(201).json({
    success: true,
    message: 'Admin user created successfully',
    user: result.user
  });
}));

export { router as authRouter };
