import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';

interface TokenPayload {
  id: string;
  email: string;
}

export interface AuthResult {
  success: boolean;
  user?: TokenPayload;
  error?: string;
}

export async function verifyAdminToken(request: NextRequest): Promise<AuthResult> {
  try {
    // Check Authorization header first
    const authHeader = request.headers.get('authorization');
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Check cookie
      token = request.cookies.get('admin_token')?.value;
    }

    if (!token) {
      return { success: false, error: 'No token provided' };
    }

    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return { success: true, user: payload };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { success: false, error: 'Token expired' };
    }
    return { success: false, error: 'Invalid token' };
  }
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}
