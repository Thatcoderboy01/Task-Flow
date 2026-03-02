import { z } from 'zod';
import { type Request, type Response, type NextFunction } from 'express';
import { BadRequest } from '../utils/AppError.js';

/* ============================================================
 * Zod validation middleware factory
 * ============================================================ */

const validate = (schema: z.ZodObject<any, any>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((e) => e.message).join(', ');
        next(BadRequest(messages));
      } else {
        next(error);
      }
    }
  };
};

export default validate;
