import { HttpException } from '@/exceptions/httpException';
import handleException from '@/helpers/exceptions/handleException';
import { NextFunction, Request, Response } from 'express';

const asyncHandler = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await Promise.resolve(fn(req, res, next));
    } catch (error) {
      // console.log(error instanceof HttpException);
      // handleException(error, next);
      next(error);
    }
  };
};

export default asyncHandler;
