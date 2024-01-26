import { STATUS_CODES } from '../constants';

export default class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CODES.badRequest;
  }
}
