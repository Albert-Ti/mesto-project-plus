import expressWinston from 'express-winston';
import winston from 'winston';
import 'winston-daily-rotate-file';

const transportRequest = new winston.transports.DailyRotateFile({
  filename: './Logs/request-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '14d',
});
const transportError = new winston.transports.DailyRotateFile({
  filename: './Logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '14d',
});

const requestLog = expressWinston.logger({
  transports: [transportRequest],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
});

const errorLog = expressWinston.errorLogger({
  transports: [transportError],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
});

export default {
  requestLog,
  errorLog,
};
