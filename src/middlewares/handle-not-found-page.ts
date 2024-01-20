import { Request, Response } from 'express';
import { STATUS_CODE } from '../constants';

export default (req: Request, res: Response) => {
  res.status(STATUS_CODE.notFound).json({ message: 'Страница не найдена' });
};
