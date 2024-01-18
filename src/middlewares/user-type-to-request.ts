/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: Types.ObjectId | string;
      };
    }
  }
}

export default (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65a7f4c11ff8e48435f08c73',
  };

  next();
};
