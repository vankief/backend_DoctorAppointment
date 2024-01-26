import { NextFunction, Request, Response } from 'express';

const asyncHandler = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await Promise.resolve(fn(req, res, next));
    } catch (error) {
      next(error);
    }
  };
};

export default asyncHandler;
