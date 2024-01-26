import { Request, Response } from 'express';
import { STATUS_CODES } from '../../constants';

export default (err: Error, req: Request, res: Response) => {
  res.status(STATUS_CODES.serverError).json({ message: 'Внутренняя ошибка сервера.' });
};
