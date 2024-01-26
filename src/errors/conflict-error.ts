import { STATUS_CODES } from '../constants';

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CODES.conflict;
  }
}
