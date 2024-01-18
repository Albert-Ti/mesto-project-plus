import { Request, Response } from 'express';
import { statusCode } from '../constants';

export default (err: Error, req: Request, res: Response) => {
  res.status(statusCode['internal-server-error']).send({ message: err.message });
};
