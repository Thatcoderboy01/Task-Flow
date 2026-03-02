import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import mongoose from 'mongoose';

/* ============================================================
 * Global error handler middleware
 * ============================================================ */

const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default to 500 internal server error
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: Record<string, string> | undefined;

  // Operational errors we threw intentionally
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = {};
    for (const [field, error] of Object.entries(err.errors)) {
      errors[field] = error.message;
    }
  }

  // Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as any).keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

export default errorHandler;
