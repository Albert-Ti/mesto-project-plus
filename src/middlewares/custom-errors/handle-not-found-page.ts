import { Request, Response } from 'express';
import { STATUS_CODES } from '../../constants';

export default (req: Request, res: Response) => {
  res.status(STATUS_CODES.notFound).json({ message: 'Страница не найдена' });
};
