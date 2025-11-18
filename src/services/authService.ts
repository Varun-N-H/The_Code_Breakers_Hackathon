import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabaseAdmin, TABLES, AdminUser } from '../config/supabase';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: Omit<AdminUser, 'password_hash'>;
  message?: string;
}

class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const { email, password } = credentials;

      // Find admin user
      const { data: user, error } = await supabaseAdmin
        .from(TABLES.ADMIN_USERS)
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Update last login
      await supabaseAdmin
        .from(TABLES.ADMIN_USERS)
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Generate JWT token
      const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: 'admin'
      };

      const token = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn
      });

      // Return user data without password
      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        token,
        user: userWithoutPassword
      };

    } catch (error) {
      return {
        success: false,
        message: 'Authentication failed'
      };
    }
  }

  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async createAdminUser(email: string, password: string): Promise<AuthResult> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from(TABLES.ADMIN_USERS)
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return {
          success: false,
          message: 'User already exists'
        };
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const { data: user, error } = await supabaseAdmin
        .from(TABLES.ADMIN_USERS)
        .insert({
          email,
          password_hash: passwordHash
        })
        .select()
        .single();

      if (error || !user) {
        return {
          success: false,
          message: 'Failed to create user'
        };
      }

      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to create user'
      };
    }
  }

  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });
  }
}

export const authService = new AuthService();
