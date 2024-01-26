import { Request, Response, NextFunction } from 'express';
import * as errors from '../errors';

export default (req: Request, res: Response, next: NextFunction) => {
  next(new errors.NotFoundError('Маршрут не найден.'));
};
