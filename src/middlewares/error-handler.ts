import { Request, Response } from 'express';
import { STATUS_CODE } from '../constants';

export default (err: Error, req: Request, res: Response) => {
  res.status(STATUS_CODE['internal-server-error']).send({ message: 'Внутренняя ошибка сервера.' });
};
