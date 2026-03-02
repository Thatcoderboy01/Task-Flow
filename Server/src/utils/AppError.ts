/* ============================================================
 * AppError — structured application error class
 * ============================================================ */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/** Helper constructors */
export const BadRequest = (msg: string) => new AppError(msg, 400);
export const Unauthorized = (msg = 'Not authenticated') => new AppError(msg, 401);
export const Forbidden = (msg = 'Not authorized') => new AppError(msg, 403);
export const NotFound = (msg = 'Resource not found') => new AppError(msg, 404);
export const Conflict = (msg: string) => new AppError(msg, 409);
