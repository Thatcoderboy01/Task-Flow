import { type Request, type Response, type NextFunction } from 'express';

/* ============================================================
 * catchAsync — wraps async route handlers to forward errors
 * ============================================================ */

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
