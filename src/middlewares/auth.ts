/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { STATUS_CODES } from '../constants';

const { JWT_SECRET } = process.env;

declare global {
  namespace Express {
    interface Request {
      user: jwt.JwtPayload;
    }
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies.token) {
      return res.status(STATUS_CODES.unauthorized).json({ message: 'Требуется авторизация' });
    }
    const payload = jwt.verify(req.cookies.token, JWT_SECRET as string) as jwt.JwtPayload;

    if (!payload) {
      return res.status(STATUS_CODES.unauthorized).json({ message: 'Требуется авторизация' });
    }

    req.user = payload;

    return next();
  } catch (error) {
    return next(error);
  }
};
