import { type Request, type Response, type NextFunction } from 'express';
import { verifyToken, type JwtPayload } from '../config/jwt.js';
import { Unauthorized } from '../utils/AppError.js';
import User from '../models/User.js';

/* ============================================================
 * Auth middleware — verifies JWT from cookie or Bearer header
 * ============================================================ */

// Extend Express Request with the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Try HTTP-only cookie first
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. Fall back to Authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw Unauthorized('No authentication token provided');
    }

    // 3. Verify token
    const decoded: JwtPayload = verifyToken(token);

    // 4. Confirm user still exists
    const user = await User.findById(decoded.userId).select('_id email');
    if (!user) {
      throw Unauthorized('User no longer exists');
    }

    // 5. Attach to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
