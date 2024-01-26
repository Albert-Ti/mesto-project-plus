import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../constants';

interface CustomErrors extends Error {
  message: string;
  statusCode: number;
}

export default (err: CustomErrors, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = STATUS_CODES.serverError } = err;
  res
    .status(statusCode)
    .json({ message: statusCode === 500 ? 'Внутренняя ошибка сервера. ' : err.message });
};
